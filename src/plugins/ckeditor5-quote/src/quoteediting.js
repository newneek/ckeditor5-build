/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * @module quote/quoteediting
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import QuoteCommand from './quotecommand';


export default class QuoteEditing extends Plugin {
	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;
		const schema = editor.model.schema;
		const conversion = editor.conversion;

		editor.commands.add('quote', new QuoteCommand(editor));

		schema.register('quote', {
			allowWhere: '$block',
			allowContentOf: '$root',
			allowAttributes: ['class'],
		});

		// Disallow Quote in Quote.
		schema.addChildCheck((ctx, childDef) => {
			if (ctx.endsWith('quote') && childDef.name == 'quote') {
				return false;
			}
		});



		editor.conversion.elementToElement( { model: 'quote', view: 'q' } );
		editor.conversion.attributeToAttribute( { model: { name: 'quote', key: 'class' }, view: 'class' });

		// Postfixer which cleans incorrect model states connected with block quotes.
		editor.model.document.registerPostFixer(writer => {
			const changes = editor.model.document.differ.getChanges();

			for (const entry of changes) {
				if (entry.type == 'insert') {
					const element = entry.position.nodeAfter;

					if (!element) {
						// We are inside a text node.
						continue;
					}

					if (element.is('quote') && element.isEmpty) {
						// Added an empty Quote - remove it.
						writer.remove(element);

						return true;
					} else if (element.is('quote') && !schema.checkChild(entry.position, element)) {
						// Added a Quote in incorrect place - most likely inside another Quote. Unwrap it
						// so the content inside is not lost.
						writer.unwrap(element);

						return true;
					} else if (element.is('element')) {
						// Just added an element. Check its children to see if there are no nested Quotes somewhere inside.
						const range = writer.createRangeIn(element);

						for (const child of range.getItems()) {
							if (child.is('quote') && !schema.checkChild(writer.createPositionBefore(child), child)) {
								writer.unwrap(child);

								return true;
							}
						}
					}
				} else if (entry.type == 'remove') {
					const parent = entry.position.parent;

					if (parent.is('quote') && parent.isEmpty) {
						// Something got removed and now Quote is empty. Remove the Quote as well.
						writer.remove(parent);

						return true;
					}
				}
			}

			return false;
		});
	}

	/**
	 * @inheritDoc
	 */
	afterInit() {
		const editor = this.editor;
		const command = editor.commands.get('quote');

		// Overwrite default Enter key behavior.
		// If Enter key is pressed with selection collapsed in empty block inside a quote, break the quote.
		// This listener is added in afterInit in order to register it after list's feature listener.
		// We can't use a priority for this, because 'low' is already used by the enter feature, unless
		// we'd use numeric priority in this case.
		this.listenTo(this.editor.editing.view.document, 'enter', (evt, data) => {
			const doc = this.editor.model.document;
			const positionParent = doc.selection.getLastPosition().parent;

			if (doc.selection.isCollapsed && positionParent.isEmpty && command.value) {
				this.editor.execute('quote');
				this.editor.editing.view.scrollToTheSelection();

				data.preventDefault();
				evt.stop();
			}
		});
	}
}
