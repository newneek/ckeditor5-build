import Command from '@ckeditor/ckeditor5-core/src/command';
import { findOptimalInsertionPosition } from '@ckeditor/ckeditor5-widget/src/utils';

export default class DetailsCommand extends Command {
  refresh() {
    this.isEnabled = isDetailsAllowed(this.editor.model);
  }

  execute() {
    const model = this.editor.model;

    model.change(writer => {
      const details = writer.createElement('details');
      const summary = writer.createElement('summary');
      const paragraph = writer.createElement('paragraph');

      writer.append(summary, details);
      writer.appendText('요약', summary);
      writer.append(paragraph, details);

      model.insertContent(details);
      writer.setSelection(paragraph, 0);
    });
  }
}

function isDetailsAllowed(model) {
  const schema = model.schema;
  const selection = model.document.selection;
  const insertionPosition = findOptimalInsertionPosition(selection, model);
  const parent = insertionPosition.parent.isEmpty && !insertionPosition.parent.is('$root')
    ? insertionPosition.parent.parent
    : insertionPosition.parent;

  return schema.checkChild(parent, 'details');
}
