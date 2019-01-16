import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import CommentEditing from './comment/commentediting';
import CommentUI from './comment/commentui';

export default class Comment extends Plugin {
	static get requires() {
		return [ CommentEditing, CommentUI ];
	}

	static get pluginName() {
		return 'Comment';
	}
}
