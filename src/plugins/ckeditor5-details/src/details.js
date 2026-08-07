import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import DetailsEditing from './detailsediting';
import DetailsUI from './detailsui';

export default class Details extends Plugin {
  static get requires() {
    return [DetailsEditing, DetailsUI];
  }

  static get pluginName() {
    return 'Details';
  }
}
