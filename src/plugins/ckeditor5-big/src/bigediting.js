/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * @module quote/quoteediting
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import BigCommand from './bigcommand';


export default class BigEditing extends Plugin {
	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;
		const schema = editor.model.schema;
		const conversion = editor.conversion;

		editor.commands.add('big', new BigCommand(editor));

		schema.register('big', {
			allowWhere: '$block',
			allowContentOf: '$root',
			allowAttributes: ['class'],
		});

		// Disallow Big in Big.
		schema.addChildCheck((ctx, childDef) => {
			if (ctx.endsWith('big') && childDef.name == 'big') {
				return false;
			}
		});



		editor.conversion.elementToElement( { model: 'big', view: 'big' } );
		editor.conversion.attributeToAttribute( { model: { name: 'big', key: 'class' }, view: 'class' });

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

					if (element.is('big') && element.isEmpty) {
						// Added an empty Quote - remove it.
						writer.remove(element);

						return true;
					} else if (element.is('big') && !schema.checkChild(entry.position, element)) {
						// Added a Quote in incorrect place - most likely inside another Quote. Unwrap it
						// so the content inside is not lost.
						writer.unwrap(element);

						return true;
					} else if (element.is('element')) {
						// Just added an element. Check its children to see if there are no nested Quotes somewhere inside.
						const range = writer.createRangeIn(element);

						for (const child of range.getItems()) {
							if (child.is('big') && !schema.checkChild(writer.createPositionBefore(child), child)) {
								writer.unwrap(child);

								return true;
							}
						}
					}
				} else if (entry.type == 'remove') {
					const parent = entry.position.parent;

					if (parent.is('big') && parent.isEmpty) {
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
		const command = editor.commands.get('big');

		// Overwrite default Enter key behavior.
		// If Enter key is pressed with selection collapsed in empty block inside a quote, break the quote.
		// This listener is added in afterInit in order to register it after list's feature listener.
		// We can't use a priority for this, because 'low' is already used by the enter feature, unless
		// we'd use numeric priority in this case.
		this.listenTo(this.editor.editing.view.document, 'enter', (evt, data) => {
			const doc = this.editor.model.document;
			const positionParent = doc.selection.getLastPosition().parent;

			if (doc.selection.isCollapsed && positionParent.isEmpty && command.value) {
				this.editor.execute('big');
				this.editor.editing.view.scrollToTheSelection();

				data.preventDefault();
				evt.stop();
			}
		});
	}
}
