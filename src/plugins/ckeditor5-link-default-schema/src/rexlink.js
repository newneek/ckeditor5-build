import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import LinkUI from '@ckeditor/ckeditor5-link/src/linkui';

/**
 * @extends module:core/plugin~Plugin
 */
export default class LinkDefaultSchema extends Plugin {
  /**
   * @inheritDoc
   */
  constructor(editor) {
    super(editor);
    editor.config.define('link.defaultSchema', 'http');
  }

  /**
   * @inheritDoc
   */
  init() {
    const editor = this.editor;
    const linkUI = editor.plugins.get(LinkUI);
    const defaultSchema = editor.config.get('link.defaultSchema');

    this.linkFormView = linkUI.formView;
    this.linkActionView = linkUI.actionsView;

    this.linkFormView.on('submit', () => {
      console.log('submit begin');
      const linkCommand = editor.commands.get('link');
      const url = linkCommand.value;
      const withHttp = this._withHttp(url, defaultSchema);

      if (url !== withHttp) {
        // this.linkFormView.set('value', withHttp);
        // this.linkActionView.set('href', withHttp);
        linkCommand.value = withHttp;
        this.linkFormView.urlInputView.value = withHttp;
        this.linkActionView.href = withHttp;
      }
    });

    this.linkFormView.on('change', (eventInfo, name, value, oldValue) => {
      console.log('linkFormView', eventInfo, name, value, oldValue);
    });
    this.linkFormView.urlInputView.on('change', (eventInfo, name, value, oldValue) => {
      console.log('linkFormView.urlInputView', eventInfo, name, value, oldValue);
    });
    this.linkActionView.on('change', (eventInfo, name, value, oldValue) => {
      console.log('linkActionView', eventInfo, name, value, oldValue);
    });

  }



  _withHttp(url, defaultSchema) {
    if (/(http(s?)):\/\//gi.test(url)) {
      return url;
    }

    return `${defaultSchema}://${url}`;
  }
}
