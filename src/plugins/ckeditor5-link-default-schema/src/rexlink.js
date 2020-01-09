import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import LinkUI from '@ckeditor/ckeditor5-link/src/linkui';

/**
 * @extends module:core/plugin~Plugin
 */

const URLSchemaPattern = /(http(s?)):\/\//gi;
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
    const linkCommand = editor.commands.get( 'link' );
    const defaultSchema = editor.config.get('link.defaultSchema');

    const linkUI = editor.plugins.get(LinkUI);
    this.linkFormView = linkUI.formView;
    this.linkActionView = linkUI.actionsView;

    // 저장하기 직전에 url 에 default schema 가 적용된다. (schema 가 없는 경우에만)
    linkCommand.on('set:value', (evt, propertyName, newValue, oldValue) => {
      console.log(evt);
      console.log('linkCommand (set:value)');
      console.log(`  ${oldValue} -> ${newValue}`);

      if (oldValue === undefined && newValue !== undefined) {
        console.log('  Apply Schema');
        evt.return = this._withHttp(newValue, defaultSchema);
      }
    });

    // 버그 발생 (클릭 할 때마다 action 의 값이 변경된다.)
    // linkCommand.on('set:value', (evt, propertyName, newValue, oldValue) => {
    //   console.log('linkCommand (set:value)');
    //   console.log(`  ${oldValue} -> ${newValue}`);
    //
    //   if (oldValue === undefined && newValue === undefined) {
    //     console.log('  Apply Schema');
    //     evt.return = `${defaultSchema}://`;
    //   }
    // });

    //
    // editor.on('set', (evt, propertyName, newValue, oldValue) => {
    //   console.log('editor - set');
    //   console.log(`  ${propertyName}: ${oldValue} -> ${newValue}`);
    //   console.log('');
    // });
    //
    // editor.on('update', (evt, propertyName, newValue, oldValue) => {
    //   console.log('editor - update');
    //   console.log(`  ${propertyName}: ${oldValue} -> ${newValue}`);
    //   console.log('');
    // });
    //
    // editor.on('set:hasAny', (evt, propertyName, newValue, oldValue) => {
    //   console.log('editor - set:hasAny');
    //   console.log(`  ${propertyName}: ${oldValue} -> ${newValue}`);
    //   console.log('');
    // });
    //
    // editor.on('set:link0', (evt, propertyName, newValue, oldValue) => {
    //   console.log('editor - link0');
    //   console.log(`  ${propertyName}: ${oldValue} -> ${newValue}`);
    //   console.log('');
    // });
    //
    // editor.on('set:linkHref', (evt, propertyName, newValue, oldValue) => {
    //   console.log('editor - linkHref');
    //   console.log(`  ${propertyName}: ${oldValue} -> ${newValue}`);
    //   console.log('');
    // });
    //
    // linkUI.on('set', (evt, propertyName, newValue, oldValue) => {
    //   console.log('linkUI - set');
    //   console.log(`  ${propertyName}: ${oldValue} -> ${newValue}`);
    //   console.log('');
    // });
    //
    // linkUI.on('set:', (evt, propertyName, newValue, oldValue) => {
    //   console.log('linkUI - set:');
    //   console.log(`  ${propertyName}: ${oldValue} -> ${newValue}`);
    //   console.log('');
    // });
    //
    // linkCommand.on('set', (evt, propertyName, newValue, oldValue) => {
    //   console.log('linkCommand - set');
    //   console.log(`  ${propertyName}: ${oldValue} -> ${newValue}`);
    //   console.log('');
    // });
    //
    // linkCommand.on('set:value', (evt, propertyName, newValue, oldValue) => {
    //   console.log('linkCommand - set:value');
    //   console.log(`  ${propertyName}: ${oldValue} -> ${newValue}`);
    //   console.log('');
    // });
    //
    // this.linkFormView.on('set:value', (evt, propertyName, newValue, oldValue) => {
    //   console.log('linkFormView - set:value');
    //   console.log(`  ${propertyName}: ${oldValue} -> ${newValue}`);
    //   console.log('');
    // });
    //
    // this.linkFormView.urlInputView.on('set:value', (evt, propertyName, newValue, oldValue) => {
    //   console.log('linkFormView.urlInputView - set:value');
    //   console.log(`  ${propertyName}: ${oldValue} -> ${newValue}`);
    //   console.log('');
    // });
    //
    // this.linkActionView.on('set:href', (evt, propertyName, newValue, oldValue) => {
    //   console.log('linkActionView - set:href');
    //   console.log(`  ${propertyName}: ${oldValue} -> ${newValue}`);
    //   console.log('');
    // });
    //
    // this.linkFormView.on('render', (evt, propertyName, newValue, oldValue) => {
    //   console.log(evt, propertyName, newValue, oldValue);
    // })







    // linkCommand.on('set:value', (evt, propertyName, newValue, oldValue) => {
    //   console.log('this.linkCommand');
    //
    //   if (!newValue) {
    //     console.log( `Value is empty adding default schema (old: ${ oldValue }, new: ${ newValue }), withSchema: ${defaultSchema}://` );
    //     evt.return = `${defaultSchema}://`;
    //   }
    //
    //   console.log( `Value is not going to change (old: ${ oldValue }, new: ${ newValue })` );
    // });


    // this.linkFormView.on('render', (props) => {
    //   const currentUrl = this.linkActionView.href;
    //   console.log('render: ', currentUrl, ' & ', props);
    //   if (!currentUrl) {
    //     editor.execute( 'link', `${defaultSchema}://`);
    //   }
    // });


    // editor.on('set', (evt, propertyName, newValue, oldValue) => {
    //   console.log('editor.change');
    //   console.log( `Value is going to be changed from ${ oldValue } to ${ newValue }` );
    //   console.log( `Current property value is ${ editor[ propertyName ] }` );
    //   console.log( `_withHttp value is ${ this._withHttp(newValue, defaultSchema) }` );
    //   return newValue;
    // });
    //
    // editor.on('set:linkHref', (evt, propertyName, newValue, oldValue) => {
    //   console.log('editor.linkHref');
    //   console.log( `Value is going to be changed from ${ oldValue } to ${ newValue }` );
    //   console.log( `Current property value is ${ editor[ propertyName ] }` );
    //   console.log( `_withHttp value is ${ this._withHttp(newValue, defaultSchema) }` );
    //
    //   return this._withHttp(newValue, defaultSchema);
    // });
    //
    // editor.on('set:href', (evt, propertyName, newValue, oldValue) => {
    //   console.log('editor.href');
    //   console.log( `Value is going to be changed from ${ oldValue } to ${ newValue }` );
    //   console.log( `Current property value is ${ editor[ propertyName ] }` );
    //   console.log( `_withHttp value is ${ this._withHttp(newValue, defaultSchema) }` );
    //
    //   return this._withHttp(newValue, defaultSchema);
    // });
    //
    // linkUI.on('set:href', (evt, propertyName, newValue, oldValue) => {
    //   console.log('editor.href');
    //   console.log( `Value is going to be changed from ${ oldValue } to ${ newValue }` );
    //   console.log( `Current property value is ${ editor[ propertyName ] }` );
    //   console.log( `_withHttp value is ${ this._withHttp(newValue, defaultSchema) }` );
    //
    //   return this._withHttp(newValue, defaultSchema);
    // });
    //
    // this.linkFormView.urlInputView.on('set:value', (evt, propertyName, newValue, oldValue) => {
    //   console.log('this.linkFormView');
    //   console.log(evt);
    //   console.log( `Value is going to be changed from ${ oldValue } to ${ newValue }` );
    //   console.log( `_withHttp value is ${ this._withHttp(newValue, defaultSchema) }` );
    //   evt.return = this._withHttp(newValue, defaultSchema);
    // });
    //
    // this.linkActionView.on('set:href', (evt, propertyName, newValue, oldValue) => {
    //   console.log('this.linkActionView');
    //   console.log(evt);
    //   console.log( `Value is going to be changed from ${ oldValue } to ${ newValue }` );
    //   console.log( `_withHttp value is ${ this._withHttp(newValue, defaultSchema) }` );
    //   evt.return = this._withHttp(newValue, defaultSchema);
    // });

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

  _checkURLSchema(url) {
    return URLSchemaPattern.test(url);
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
