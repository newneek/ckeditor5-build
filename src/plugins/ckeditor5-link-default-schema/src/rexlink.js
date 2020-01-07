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


    // this.linkFormView.on('render', (props) => {
    //   const currentUrl = this.linkActionView.href;
    //   console.log('render: ', currentUrl, ' & ', props);
    //   if (!currentUrl) {
    //     editor.execute( 'link', `${defaultSchema}://`);
    //   }
    // });


    editor.on('set', (evt, propertyName, newValue, oldValue) => {
      console.log('editor.change');
      console.log( `Value is going to be changed from ${ oldValue } to ${ newValue }` );
      console.log( `Current property value is ${ editor[ propertyName ] }` );
      console.log( `_withHttp value is ${ this._withHttp(newValue, defaultSchema) }` );
      return newValue;
    });

    editor.on('set:linkHref', (evt, propertyName, newValue, oldValue) => {
      console.log('editor.linkHref');
      console.log( `Value is going to be changed from ${ oldValue } to ${ newValue }` );
      console.log( `Current property value is ${ editor[ propertyName ] }` );
      console.log( `_withHttp value is ${ this._withHttp(newValue, defaultSchema) }` );

      return this._withHttp(newValue, defaultSchema);
    });

    editor.on('set:href', (evt, propertyName, newValue, oldValue) => {
      console.log('editor.href');
      console.log( `Value is going to be changed from ${ oldValue } to ${ newValue }` );
      console.log( `Current property value is ${ editor[ propertyName ] }` );
      console.log( `_withHttp value is ${ this._withHttp(newValue, defaultSchema) }` );

      return this._withHttp(newValue, defaultSchema);
    });

    linkUI.on('set:href', (evt, propertyName, newValue, oldValue) => {
      console.log('editor.href');
      console.log( `Value is going to be changed from ${ oldValue } to ${ newValue }` );
      console.log( `Current property value is ${ editor[ propertyName ] }` );
      console.log( `_withHttp value is ${ this._withHttp(newValue, defaultSchema) }` );

      return this._withHttp(newValue, defaultSchema);
    });

    this.linkFormView.urlInputView.on('set:value', (evt, propertyName, newValue, oldValue) => {
      console.log('this.linkFormView');
      console.log(evt);
      console.log( `Value is going to be changed from ${ oldValue } to ${ newValue }` );
      console.log( `_withHttp value is ${ this._withHttp(newValue, defaultSchema) }` );

      return this._withHttp(newValue, defaultSchema);
    });

    this.linkActionView.on('set:href', (evt, propertyName, newValue, oldValue) => {
      console.log('this.linkActionView');
      console.log(evt);
      console.log( `Value is going to be changed from ${ oldValue } to ${ newValue }` );
      console.log( `_withHttp value is ${ this._withHttp(newValue, defaultSchema) }` );

      return this._withHttp(newValue, defaultSchema);
    });


    // this.linkFormView.once('render', () => {
    //   // to use this in for each callback
    //   const that = this;
    //
    //   rexlinkConfig.forEach(function (item, index, array) {
    //     if (item == 'internal') {
    //       // Render button's tamplate.
    //       that.linkButton.render();
    //       // Register the button under the link form view, it will handle its destruction.
    //       that.linkFormView.registerChild(that.linkButton);
    //       // Inject the element into DOM.
    //       that.linkFormView.element.insertBefore(that.linkButton.element, that.linkFormView.saveButtonView.element);
    //     }
    //     if (item == 'media') {
    //       // Render button's tamplate.
    //       that.mediaButton.render();
    //       // Register the button under the link form view, it will handle its destruction.
    //       that.linkFormView.registerChild(that.mediaButton);
    //       // Inject the element into DOM.
    //       that.linkFormView.element.insertBefore(that.mediaButton.element, that.linkFormView.saveButtonView.element);
    //     }
    //   });
    //   console.log('render');
    //   this.listenTo( that, 'submit', () => {
    //     console.log(arguments);
    //     console.log('link');
    //   });
    //
    // });

    // this.linkFormView.on('submit', () => {
    //   console.log('submit begin');
    //   const linkCommand = editor.commands.get('link');
    //   const url = linkCommand.value;
    //   const withHttp = this._withHttp(url, defaultSchema);
    //
    //   if (url !== withHttp) {
    //     // this.linkFormView.set('value', withHttp);
    //     // this.linkActionView.set('href', withHttp);
    //     linkCommand.value = withHttp;
    //     this.linkFormView.urlInputView.value = withHttp;
    //     this.linkActionView.href = withHttp;
    //   }
    // });

    // this.linkFormView.on('change', (eventInfo, name, value, oldValue) => {
    //   console.log('linkFormView', eventInfo, name, value, oldValue);
    // });
    // this.linkFormView.urlInputView.on('change', (eventInfo, name, value, oldValue) => {
    //   console.log('linkFormView.urlInputView', eventInfo, name, value, oldValue);
    // });
    // this.linkActionView.on('change', (eventInfo, name, value, oldValue) => {
    //   console.log('linkActionView', eventInfo, name, value, oldValue);
    // });

  }



  _withHttp(url, defaultSchema) {
    if (/(http(s?)):\/\//gi.test(url)) {
      return url;
    }

    return `${defaultSchema}://${url}`;
  }
}
