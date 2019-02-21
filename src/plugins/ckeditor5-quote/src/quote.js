/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * @module quote/quote
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import QuoteEditing from './quoteediting';
import QuoteUI from './quoteui';

/**
 * The quote plugin.
 *
 * For more information about this feature check the {@glink api/quote package page}.
 *
 * This is a "glue" plugin which loads the {@link module:quote/uoteediting~QuoteEditing quote editing feature}
 * and {@link module:quote/quoteui~QuoteUI quote UI feature}.
 *
 * @extends module:core/plugin~Plugin
 */
export default class Quote extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [ QuoteEditing, QuoteUI ];
	}

	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'Quote';
	}
}
