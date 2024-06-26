/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * @module block-quote/blockquoteui
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

import bigIcon from '../theme/icons/big.svg';


/**
 * The quote UI plugin.
 *
 * It introduces the `'Quote'` button.
 *
 * @extends module:core/plugin~Plugin
 */
export default class BigUI extends Plugin {
	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;
		const t = editor.t;

		editor.ui.componentFactory.add( 'big', locale => {
			const command = editor.commands.get( 'big' );
			const buttonView = new ButtonView( locale );

			buttonView.set( {
				label: t( 'Big' ),
				icon: bigIcon,
				tooltip: true
			} );

			// Bind button model to command.
			buttonView.bind( 'isOn', 'isEnabled' ).to( command, 'value', 'isEnabled' );

			// Execute command.
			this.listenTo( buttonView, 'execute', () => editor.execute( 'big' ) );

			return buttonView;
		} );
	}
}
