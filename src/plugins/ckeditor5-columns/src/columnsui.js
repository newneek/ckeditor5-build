import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import Model from '@ckeditor/ckeditor5-ui/src/model';
import Collection from '@ckeditor/ckeditor5-utils/src/collection';
import { createDropdown, addListToDropdown } from '@ckeditor/ckeditor5-ui/src/dropdown/utils';

import columnsIcon from '../theme/icons/columns.svg';

const OPTIONS = [
  { count: 2, label: '2단 컬럼' },
  { count: 3, label: '3단 컬럼' },
];

export default class ColumnsUI extends Plugin {
  init() {
    const editor = this.editor;
    const t = editor.t;

    editor.ui.componentFactory.add('columns', locale => {
      const command = editor.commands.get('columns');
      const itemDefinitions = new Collection();

      for (const option of OPTIONS) {
        itemDefinitions.add({
          type: 'button',
          model: new Model({
            label: option.label,
            withText: true,
            columnsCount: option.count,
          }),
        });
      }

      const dropdownView = createDropdown(locale);
      addListToDropdown(dropdownView, itemDefinitions);

      dropdownView.buttonView.set({
        label: t('컬럼 레이아웃'),
        icon: columnsIcon,
        tooltip: true,
      });

      dropdownView.bind('isEnabled').to(command, 'isEnabled');

      this.listenTo(dropdownView, 'execute', evt => {
        editor.execute('columns', { count: evt.source.columnsCount });
        editor.editing.view.focus();
      });

      return dropdownView;
    });
  }
}
