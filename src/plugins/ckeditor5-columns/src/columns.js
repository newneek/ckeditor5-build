import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';
import ColumnsEditing from './columnsediting';
import ColumnsUI from './columnsui';
import ColumnsKeyboard from './columnskeyboard';

export default class Columns extends Plugin {
  static get requires() {
    return [ColumnsEditing, ColumnsUI, ColumnsKeyboard, Widget];
  }

  static get pluginName() {
    return 'Columns';
  }
}
