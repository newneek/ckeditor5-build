import Command from '@ckeditor/ckeditor5-core/src/command';
import { findOptimalInsertionPosition } from '@ckeditor/ckeditor5-widget/src/utils';

export default class ColumnsCommand extends Command {
  refresh() {
    this.isEnabled = isColumnsAllowed(this.editor.model);
  }

  // count: 2 또는 3 (데스크톱 기준 컬럼 수. 모바일은 항상 1단으로 쌓임)
  execute({ count }) {
    const model = this.editor.model;

    model.change(writer => {
      const columnsBlock = writer.createElement('columnsBlock', { columnsCount: count });

      let firstParagraph;

      for (let i = 0; i < count; i++) {
        const column = writer.createElement('column');
        const paragraph = writer.createElement('paragraph');

        writer.append(paragraph, column);
        writer.append(column, columnsBlock);

        if (i === 0) {
          firstParagraph = paragraph;
        }
      }

      model.insertContent(columnsBlock);
      writer.setSelection(firstParagraph, 0);
    });
  }
}

function isColumnsAllowed(model) {
  const schema = model.schema;
  const selection = model.document.selection;
  const insertionPosition = findOptimalInsertionPosition(selection, model);
  const parent = insertionPosition.parent.isEmpty && !insertionPosition.parent.is('$root')
    ? insertionPosition.parent.parent
    : insertionPosition.parent;

  return schema.checkChild(parent, 'columnsBlock');
}
