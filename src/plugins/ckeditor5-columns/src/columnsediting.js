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
    const model = editor.model;
    const schema = model.schema;
    const conversion = editor.conversion;

    editor.commands.add('columns', new ColumnsCommand(editor));

    schema.register('columnsBlock', {
      allowWhere: '$block',
      isLimit: true,
      isObject: true,
      isBlock: true,
      allowAttributes: ['columnsCount'],
    });

    schema.register('column', {
      allowIn: 'columnsBlock',
      allowContentOf: '$root',
      isLimit: true,
      isObject: true,
    });

    // columnsBlock이 (몇 단계를 거치더라도) 자기 자신의 column 안에 중첩되는 것을 막는다.
    schema.addChildCheck((context, childDefinition) => {
      if (childDefinition.name === 'columnsBlock' && Array.from(context.getNames()).includes('columnsBlock')) {
        return false;
      }
    });

    // column이 비면(모든 텍스트를 지우면) 커서가 있을 자리가 사라져 이후 입력/삭제가
    // 깨지므로, 항상 최소 1개의 paragraph를 갖도록 보정한다 (table의 tableCell과 동일한 방식).
    model.document.registerPostFixer(writer => columnContentsPostFixer(writer, model));

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

// table의 table-cell-paragraph-post-fixer.js를 column 구조(행/열 없이 columnsBlock > column만
// 있는 단순한 구조)에 맞게 줄인 버전. column이 자식 0개가 되지 않도록, 그리고 column 바로
// 아래에 $text가 직접 놓이지 않도록 보정한다.
function columnContentsPostFixer(writer, model) {
  const changes = model.document.differ.getChanges();
  let wasFixed = false;

  for (const entry of changes) {
    if (entry.type === 'insert' && entry.name === 'column') {
      wasFixed = fixColumnContent(entry.position.nodeAfter, writer) || wasFixed;
    }

    if (isColumnContentChange(entry)) {
      wasFixed = fixColumnContent(entry.position.parent, writer) || wasFixed;
    }
  }

  return wasFixed;
}

function fixColumnContent(column, writer) {
  if (column.childCount === 0) {
    writer.insertElement('paragraph', column);
    return true;
  }

  const textNodes = Array.from(column.getChildren()).filter(child => child.is('text'));

  for (const child of textNodes) {
    writer.wrap(writer.createRangeOn(child), 'paragraph');
  }

  return !!textNodes.length;
}

function isColumnContentChange(entry) {
  if (!entry.position || !entry.position.parent.is('column')) {
    return false;
  }

  return (entry.type === 'insert' && entry.name === '$text') || entry.type === 'remove';
}
