import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

// 이미지 링크는 선택 여지 없이 항상 새 창(target=_blank)으로 연다.
//
// 처음에는 텍스트 링크처럼 수동 데코레이터(체크박스)로 사용자가 켜고 끄게 했었는데,
// 이미지처럼 "객체 선택" 상태에서는 CKEditor5가 선택 속성을 텍스트 노드 기준으로만
// 읽는 알려진 제약(linkcommand.js의 "Currently the selection reads attributes from
// text nodes only" 주석 참고) 때문에 체크박스 상태가 실제로 반영되지 않는 문제가 있어
// 폐기했다. 대신 이미 정상 동작하는 linkHref 다운캐스트(LinkImageEditing)에 올라타
// <a> 래퍼가 만들어질 때마다 무조건 target/rel을 강제한다.
export default class LinkImageOpenInNewTab extends Plugin {
  static get pluginName() {
    return 'LinkImageOpenInNewTab';
  }

  init() {
    const editor = this.editor;

    editor.conversion.for('downcast').add(dispatcher => {
      // LinkImageEditing의 attribute:linkHref:image 핸들러(기본 우선순위)가 <a> 래퍼를
      // 먼저 만들어 둔 뒤에 실행되도록 낮은 우선순위로 등록한다.
      dispatcher.on(
        'attribute:linkHref:image',
        (evt, data, conversionApi) => {
          if (!data.attributeNewValue) {
            return;
          }

          const viewFigure = conversionApi.mapper.toViewElement(data.item);
          const linkInImage = Array.from(viewFigure.getChildren()).find(child => child.name === 'a');

          if (!linkInImage) {
            return;
          }

          const writer = conversionApi.writer;

          writer.setAttribute('target', '_blank', linkInImage);
          writer.setAttribute('rel', 'noopener noreferrer', linkInImage);
        },
        { priority: 'low' }
      );
    });
  }
}
