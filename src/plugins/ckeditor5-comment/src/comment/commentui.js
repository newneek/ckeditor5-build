import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

import commentIcon from '../../theme/icons/comment.svg';

const COMMENT = 'comment';

export default class CommentUI extends Plugin {
	init() {
		const editor = this.editor;
		const t = editor.t;

		// Add bold button to feature components.
		editor.ui.componentFactory.add( COMMENT, locale => {
			const command = editor.commands.get( COMMENT );
			const view = new ButtonView( locale );

			view.set( {
				label: t( 'Comment' ),
				icon: commentIcon,
				tooltip: true
			} );

			view.bind( 'isOn', 'isEnabled' ).to( command, 'value', 'isEnabled' );

			// Execute command.
			this.listenTo( view, 'execute', () => editor.execute( COMMENT ) );

			return view;
		} );
	}
}
