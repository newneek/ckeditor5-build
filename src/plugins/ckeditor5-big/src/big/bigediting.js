
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import AttributeCommand from '@ckeditor/ckeditor5-basic-styles/src/attributecommand';

const BIG = 'big';

export default class BigEditing extends Plugin {
	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;
		// Allow bold attribute on text nodes.
		editor.model.schema.extend( '$text', { allowAttributes: BIG } );

		// Build converter from model to view for data and editing pipelines.

		editor.conversion.attributeToElement( {
			model: BIG,
			view: {
				name: 'big',
			}
		} );
		editor.commands.add( BIG, new AttributeCommand( editor, BIG ) );
	}
}
