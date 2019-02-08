
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import AttributeCommand from '@ckeditor/ckeditor5-basic-styles/src/attributecommand';

const COMMENT = 'comment';

export default class CommentEditing extends Plugin {
	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;
		// Allow bold attribute on text nodes.
		editor.model.schema.extend( '$text', { allowAttributes: COMMENT } );

		// Build converter from model to view for data and editing pipelines.

		editor.conversion.attributeToElement( {
			model: COMMENT,
			view: {
				name: 'p',
				styles: {
					'color' : '#7f8c8d',
					'font-size' : '14px',
					'margin-top' : '0.3rem',
           			}
       			}		
		} );

		// Create bold command.
		editor.commands.add( COMMENT, new AttributeCommand( editor, COMMENT ) );
	}
}
