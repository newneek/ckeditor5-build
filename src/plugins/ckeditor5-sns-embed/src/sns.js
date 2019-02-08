
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import SnsEmbed from './snsembed'

export default class Sns extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [ SnsEmbed ];
	}

	static get pluginName() {
		return 'Sns';
	}

}
