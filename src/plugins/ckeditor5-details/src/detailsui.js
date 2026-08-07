import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

import detailsIcon from '../theme/icons/details.svg';

export default class DetailsUI extends Plugin {
  init() {
    const editor = this.editor;
    const t = editor.t;

    editor.ui.componentFactory.add('details', locale => {
      const command = editor.commands.get('details');
      const buttonView = new ButtonView(locale);

      buttonView.set({
        label: t('접었다 펼치기'),
        icon: detailsIcon,
        tooltip: true,
      });

      buttonView.bind('isEnabled').to(command, 'isEnabled');

      this.listenTo(buttonView, 'execute', () => editor.execute('details'));

      return buttonView;
    });
  }
}
