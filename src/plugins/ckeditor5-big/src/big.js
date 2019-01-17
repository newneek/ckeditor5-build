import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import BigEditing from './big/bigediting';
import BigUI from './big/bigui';

export default class Big extends Plugin {
	static get requires() {
		return [ BigEditing, BigUI ];
	}

	static get pluginName() {
		return 'Big';
	}
}
