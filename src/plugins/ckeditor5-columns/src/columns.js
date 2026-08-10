import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ColumnsEditing from './columnsediting';
import ColumnsUI from './columnsui';

export default class Columns extends Plugin {
  static get requires() {
    return [ColumnsEditing, ColumnsUI];
  }

  static get pluginName() {
    return 'Columns';
  }
}
