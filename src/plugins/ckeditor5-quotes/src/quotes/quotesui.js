import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

import quotesIcon from '../../theme/icons/quotes.svg';

const QUOTES = 'quotes';

export default class QuotesUI extends Plugin {
	init() {
		const editor = this.editor;
		const t = editor.t;

		// Add bold button to feature components.
		editor.ui.componentFactory.add( QUOTES, locale => {
			const command = editor.commands.get( QUOTES );
			const view = new ButtonView( locale );

			view.set( {
				label: t( 'Quotes' ),
				icon: quotesIcon,
				keystroke: 'CTRL+Q',
				tooltip: true
			} );

			view.bind( 'isOn', 'isEnabled' ).to( command, 'value', 'isEnabled' );

			// Execute command.
			this.listenTo( view, 'execute', () => editor.execute( QUOTES ) );

			return view;
		} );
	}
}
