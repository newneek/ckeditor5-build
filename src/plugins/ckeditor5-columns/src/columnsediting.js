import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import { toWidget, toWidgetEditable } from '@ckeditor/ckeditor5-widget/src/utils';
import ColumnsCommand from './columnscommand';

// 데스크톱에서는 2~3단, 모바일에서는 항상 1단으로 쌓이는 컬럼 레이아웃 블록.
// 실제 그리드는 발행 페이지(Tailwind) 쪽 클래스로 표현하고, 에디터 안에서는
// 각 컬럼을 독립적으로 편집 가능한 위젯 영역으로 보여준다.
// ponytail: 모바일 컬럼 수는 항상 1단 고정. 필요해지면 columnsBlock에
// mobileColumnsCount 속성을 추가해 확장한다.
export default class ColumnsEditing extends Plugin {
  static get pluginName() {
    return 'ColumnsEditing';
  }

  init() {
    const editor = this.editor;
    const schema = editor.model.schema;
    const conversion = editor.conversion;

    editor.commands.add('columns', new ColumnsCommand(editor));

    schema.register('columnsBlock', {
      allowWhere: '$block',
      isLimit: true,
      allowAttributes: ['columnsCount'],
    });

    schema.register('column', {
      allowIn: 'columnsBlock',
      allowContentOf: '$root',
      isLimit: true,
    });

    // columnsBlock 안에 columnsBlock이 중첩되는 것만 막는다.
    schema.addChildCheck((context, childDefinition) => {
      if (childDefinition.name === 'columnsBlock' && context.endsWith('columnsBlock column')) {
        return false;
      }
    });

    conversion.for('upcast').elementToElement({
      view: { name: 'div', classes: 'content-columns' },
      model: (viewElement, { writer }) => {
        const count = parseInt(viewElement.getAttribute('data-columns-count'), 10) || 2;
        return writer.createElement('columnsBlock', { columnsCount: count });
      },
    });

    conversion.for('upcast').elementToElement({
      view: { name: 'div', classes: 'content-column' },
      model: 'column',
    });

    conversion.for('editingDowncast').elementToElement({
      model: 'columnsBlock',
      view: (modelElement, { writer }) => {
        const count = modelElement.getAttribute('columnsCount');
        const div = writer.createContainerElement('div', {
          class: `ck-columns-block ck-columns-block--${count}`,
          style: `display: grid; grid-template-columns: repeat(${count}, 1fr); gap: 16px;`,
        });
        return toWidget(div, writer, { label: `${count}단 컬럼` });
      },
    });

    conversion.for('dataDowncast').elementToElement({
      model: 'columnsBlock',
      view: (modelElement, { writer }) => {
        const count = modelElement.getAttribute('columnsCount');
        return writer.createContainerElement('div', {
          class: `content-columns content-columns--${count} grid grid-cols-1 md:grid-cols-${count} gap-6`,
          'data-columns-count': count,
        });
      },
    });

    conversion.for('editingDowncast').elementToElement({
      model: 'column',
      view: (modelElement, { writer }) => {
        const div = writer.createEditableElement('div', {
          class: 'ck-column',
          style: 'min-width: 0; min-height: 3em; border: 1px dashed #c4c4c4; padding: 8px;',
        });
        return toWidgetEditable(div, writer);
      },
    });

    conversion.for('dataDowncast').elementToElement({
      model: 'column',
      view: (modelElement, { writer }) => writer.createContainerElement('div', { class: 'content-column min-w-0' }),
    });
  }
}
