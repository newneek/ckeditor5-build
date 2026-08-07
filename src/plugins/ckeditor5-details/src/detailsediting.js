import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import DetailsCommand from './detailscommand';

// 실제 콘텐츠 페이지(뷰어)에서는 브라우저 기본 <details>/<summary> 동작으로
// 접고 펼칠 수 있어야 하므로 open 속성 없이 저장한다(기본 접힘).
// 에디터 안에서는 접혀서 편집이 안 되면 곤란하므로 편집 화면에서만 항상 펼쳐서 보여준다.
export default class DetailsEditing extends Plugin {
  static get pluginName() {
    return 'DetailsEditing';
  }

  init() {
    const editor = this.editor;
    const schema = editor.model.schema;
    const conversion = editor.conversion;

    editor.commands.add('details', new DetailsCommand(editor));

    schema.register('details', {
      allowWhere: '$block',
      allowContentOf: '$root',
      isLimit: true,
    });

    schema.register('summary', {
      allowIn: 'details',
      allowContentOf: '$block',
      isLimit: true,
    });

    // details 안에 details가 중첩되는 것만 막는다. 그 외 구조(순서 등)는 단순화를 위해 허용한다.
    schema.addChildCheck((context, childDefinition) => {
      if (childDefinition.name === 'details' && context.endsWith('details summary')) {
        return false;
      }
    });

    conversion.for('upcast').elementToElement({ view: 'details', model: 'details' });
    conversion.for('upcast').elementToElement({ view: 'summary', model: 'summary' });

    conversion.for('dataDowncast').elementToElement({ model: 'details', view: 'details' });
    conversion.for('editingDowncast').elementToElement({
      model: 'details',
      view: (modelElement, viewWriter) => viewWriter.createContainerElement('details', { open: 'open' }),
    });

    conversion.for('downcast').elementToElement({ model: 'summary', view: 'summary' });
  }
}
