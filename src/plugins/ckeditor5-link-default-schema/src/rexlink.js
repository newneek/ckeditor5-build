import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import LinkUI from '@ckeditor/ckeditor5-link/src/linkui';

/**
 * @extends module:core/plugin~Plugin
 * link 를 저장할 때 schema 가 없을 경우에 기본값을 추가해주는 플러그인
 * '@ckeditor/ckeditor5-link/src/link' 플러그인의 저장 명령을 overriding 하는 플러그인이다.
 */

export default class LinkDefaultSchema extends Plugin {
  /**
   * @inheritDoc
   */
  constructor(editor) {
    super(editor);
    editor.config.define('link.defaultSchema', '');
  }

  /**
   * @inheritDoc
   */
  init() {
    const editor = this.editor;
    const linkCommand = editor.commands.get('link');
    const defaultSchema = editor.config.get('link.defaultSchema');

    const linkUI = editor.plugins.get(LinkUI);
    this.linkFormView = linkUI.formView;
    this.linkActionView = linkUI.actionsView;

    // 저장하기 직전에 url 에 default schema 가 적용된다. (schema 가 없는 경우에만)
    linkCommand.on('set:value', (evt, propertyName, newValue, oldValue) => {
      if (oldValue === undefined && newValue !== undefined) {
        evt.return = this._withHttp(newValue, defaultSchema);
      }
    });
  }

  _withHttp(url, defaultSchema) {
    if (/(http(s?)):\/\//gi.test(url)) {
      return url;
    }

    if (!defaultSchema) {
      return url;
    }

    return `${defaultSchema}://${url}`;
  }
}
