import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import AttributeCommand from '../attributecommand';

const QUOTES = 'quotes';
export default class QuotesEditing extends Plugin {
	init() {
		const editor = this.editor;

		// Allow quotes attribute on text nodes.
		editor.model.schema.extend( '$text', { allowAttributes: QUOTES } );

		// Build converter from model to view for data and editing pipelines.

		editor.conversion.attributeToElement( {
			model: QUOTES,
			view: 'q',
		} );

		// Create bold command.
		editor.commands.add( QUOTES, new AttributeCommand( editor, QUOTES) );

		// Set the Ctrl+B keystroke.
		editor.keystrokes.set( 'CTRL+Q', QUOTES );
	}
}

