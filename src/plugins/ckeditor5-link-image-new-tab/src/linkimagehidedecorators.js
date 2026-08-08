import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import LinkUI from '@ckeditor/ckeditor5-link/src/linkui';
import ContextualBalloon from '@ckeditor/ckeditor5-ui/src/panel/balloon/contextualballoon';
import { isImageWidget } from '@ckeditor/ckeditor5-image/src/image/utils';

// 이미지 링크는 LinkImageOpenInNewTab이 새 창 열기를 무조건 적용하므로,
// 텍스트 링크에만 의미 있는 "새 창에서 열기" 등 수동 데코레이터 체크박스 목록을
// 이미지 링크 편집 폼에서는 숨긴다.
//
// LinkUI와 LinkImageUI는 같은 LinkFormView 인스턴스를 공유해서 체크박스를
// 조건부로 아예 안 만들 수는 없다. 대신 ContextualBalloon#visibleView가
// formView로 바뀔 때마다(폼이 실제로 화면에 뜰 때마다) 현재 선택이 이미지인지
// 확인해서 체크박스 목록의 표시 여부를 토글한다.
export default class LinkImageHideDecorators extends Plugin {
  static get requires() {
    return [LinkUI, ContextualBalloon];
  }

  static get pluginName() {
    return 'LinkImageHideDecorators';
  }

  init() {
    const editor = this.editor;
    const linkUI = editor.plugins.get(LinkUI);
    const balloon = editor.plugins.get(ContextualBalloon);

    balloon.on('change:visibleView', () => {
      const formView = linkUI.formView;

      if (!formView || !formView.element || balloon.visibleView !== formView) {
        return;
      }

      const decoratorsList = formView.element.querySelector('.ck-list');

      if (!decoratorsList) {
        return;
      }

      const selectedElement = editor.editing.view.document.selection.getSelectedElement();
      const isImageSelected = !!(selectedElement && isImageWidget(selectedElement));

      decoratorsList.style.display = isImageSelected ? 'none' : '';
    });
  }
}
