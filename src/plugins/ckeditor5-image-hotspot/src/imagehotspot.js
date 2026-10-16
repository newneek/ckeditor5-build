import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ImageHotspotEditing from './imagehotspotediting';
import ImageHotspotUI from './imagehotspotui';

export default class ImageHotspot extends Plugin {
  static get requires() {
    return [ImageHotspotEditing, ImageHotspotUI];
  }

  static get pluginName() {
    return 'ImageHotspot';
  }
}
