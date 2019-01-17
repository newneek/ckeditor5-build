import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

import bigIcon from '../../theme/icons/big.svg';

const BIG = 'big';

export default class BigUI extends Plugin {
	init() {
		const editor = this.editor;
		const t = editor.t;

		// Add bold button to feature components.
		editor.ui.componentFactory.add( BIG, locale => {
			const command = editor.commands.get( BIG );
			const view = new ButtonView( locale );

			view.set( {
				label: t( 'Big' ),
				icon: bigIcon,
				tooltip: true
			} );

			view.bind( 'isOn', 'isEnabled' ).to( command, 'value', 'isEnabled' );

			// Execute command.
			this.listenTo( view, 'execute', () => editor.execute( BIG ) );

			return view;
		} );
	}
}
