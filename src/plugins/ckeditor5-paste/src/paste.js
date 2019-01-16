import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import plainTextToHtml from '@ckeditor/ckeditor5-clipboard/src/utils/plaintexttohtml';
/**
 * The clipboard feature. It is responsible for intercepting the `paste` and `drop` events and
 * passing the pasted content through the clipboard pipeline in order to insert it into the editor's content.
 * It also handles the `cut` and `copy` events to fill the native clipboard with serialized editor's data.
 *
 * Read more about the clipboard integration in {@glink framework/guides/deep-dive/clipboard "Clipboard" deep dive} guide.
 *
 * @extends module:core/plugin~Plugin
 */
export default class Paste extends Plugin {
	//https://stackoverflow.com/questions/49709031/ckeditor-5-paste-as-plain-text
	//
	static get pluginName() {
		return 'Paste';
	}
	init() {
		const editor = this.editor;
		const clipboardPlugin = editor.plugins.get( 'Clipboard' );
		const editingView = editor.editing.view;

		editingView.document.on( 'clipboardInput', ( evt, data ) => {
			if ( editor.isReadOnly ) {
				return;
			}

			const dataTransfer = data.dataTransfer;

			let content = plainTextToHtml( dataTransfer.getData( 'text/plain' ) ).replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"');

			content = clipboardPlugin._htmlDataProcessor.toView( content );

			clipboardPlugin.fire( 'inputTransformation', { content, dataTransfer } );

			editingView.scrollToTheSelection();

			evt.stop();
		} );
	}
}
