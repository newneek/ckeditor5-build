import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import QuotesEditing from './quotes/quotesediting';
import QuotesUI from './quotes/quotesui';


export default class Quotes extends Plugin {
	static get requires() {
		return [ QuotesEditing, QuotesUI ];
	}

	static get pluginName() {
		return 'Quotes';
	}
}

