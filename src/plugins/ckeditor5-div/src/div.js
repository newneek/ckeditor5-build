import Plugin from '@ckeditor/ckeditor5-core/src/plugin';



export default class Div extends Plugin {
  //https://stackoverflow.com/questions/49709031/ckeditor-5-paste-as-plain-text
  //
  static get pluginName() {
    return 'Div';
  }
  init() {
    const editor = this.editor;
    editor.model.schema.register( 'div', {
      allowContentOf: 'figure',
      isBlock: true,
      isObject: true,
    } );
    editor.conversion.elementToElement( { model: 'div', view: 'div' } );
  }

}
