/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * @module quote/quote
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import BigEditing from './bigediting';
import BigUI from './bigui';

/**
 * The big plugin.
 *
 * For more information about this feature check the {@glink api/big package page}.
 *
 * This is a "glue" plugin which loads the {@link module:big/uoteediting~BigEditing big editing feature}
 * and {@link module:big/bigui~BigUI big UI feature}.
 *
 * @extends module:core/plugin~Plugin
 */
export default class Big extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [ BigEditing, BigUI ];
	}

	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'Big';
	}
}
