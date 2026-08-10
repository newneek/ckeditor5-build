import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import priorities from '@ckeditor/ckeditor5-utils/src/priorities';
import { isArrowKeyCode, getLocalizedArrowKeyCodeDirection } from '@ckeditor/ckeditor5-utils/src/keyboard';

// 각 column은 독립된 contenteditable 영역(nested editable)이라, 옆 column으로
// 화살표 키가 넘어가는 걸 브라우저가 자동으로 해주지 않는다. table의 TableKeyboard가
// tableCell 사이 이동을 처리하는 것과 같은 이유로, column 사이 이동을 여기서 처리한다.
// (table과 달리 행/열 없이 1차원으로 나열된 구조라 훨씬 단순하다.)
export default class ColumnsKeyboard extends Plugin {
  static get pluginName() {
    return 'ColumnsKeyboard';
  }

  init() {
    const editor = this.editor;
    const viewDocument = editor.editing.view.document;

    // Widget의 기본 처리(priority: 'high')보다는 뒤에, fake-selection을 지키는
    // priority('high') - 20 보다는 앞에 둔다. TableKeyboard와 동일한 우선순위 규칙.
    this.listenTo(viewDocument, 'keydown', (evt, data) => this._onKeydown(evt, data), {
      priority: priorities.get('high') - 10,
    });
  }

  _onKeydown(eventInfo, domEventData) {
    const keyCode = domEventData.keyCode;

    if (!isArrowKeyCode(keyCode)) {
      return;
    }

    const direction = getLocalizedArrowKeyCodeDirection(keyCode, this.editor.locale.contentLanguageDirection);

    if (direction !== 'left' && direction !== 'right') {
      return;
    }

    const wasHandled = this._handleArrowKey(direction === 'right');

    if (wasHandled) {
      domEventData.preventDefault();
      domEventData.stopPropagation();
      eventInfo.stop();
    }
  }

  _handleArrowKey(isForward) {
    const model = this.editor.model;
    const schema = model.schema;
    const selection = model.document.selection;

    if (!selection.isCollapsed) {
      return false;
    }

    const limitElement = schema.getLimitElement(selection.focus);

    if (!limitElement.is('column')) {
      return false;
    }

    if (!this._isSelectionAtColumnEdge(selection, isForward)) {
      return false;
    }

    const column = limitElement;
    const columnsBlock = column.parent;
    const targetColumn = columnsBlock.getChild(columnsBlock.getChildIndex(column) + (isForward ? 1 : -1));

    if (!targetColumn) {
      // 첫/마지막 column 경계 - 여기서는 아무 것도 하지 않고 기본 동작(위젯 전체 선택 등)에 맡긴다.
      return false;
    }

    model.change(writer => {
      // postfixer가 column에 항상 최소 1개의 블록(paragraph)을 보장하므로,
      // 그 블록의 맨 앞(forward)/맨 끝(backward)으로 커서를 옮기면 된다.
      const targetBlock = isForward ? targetColumn.getChild(0) : targetColumn.getChild(targetColumn.childCount - 1);
      const position = isForward ? writer.createPositionAt(targetBlock, 0) : writer.createPositionAt(targetBlock, 'end');

      writer.setSelection(position);
    });

    return true;
  }

  // 선택이 column의 시작(backward)/끝(forward) 경계에 있는지 확인한다.
  // TableKeyboard._isSelectionAtCellEdge와 동일한 방식: 한 스텝 이동시켜보고
  // 위치가 그대로면 더 이상 이 column 안에서 이동할 곳이 없다는 뜻이다.
  _isSelectionAtColumnEdge(selection, isForward) {
    const model = this.editor.model;
    const schema = model.schema;
    const focus = isForward ? selection.getLastPosition() : selection.getFirstPosition();

    if (!schema.getLimitElement(focus).is('column')) {
      return false;
    }

    const probe = model.createSelection(focus);
    model.modifySelection(probe, { direction: isForward ? 'forward' : 'backward' });

    return focus.isEqual(probe.focus);
  }
}
