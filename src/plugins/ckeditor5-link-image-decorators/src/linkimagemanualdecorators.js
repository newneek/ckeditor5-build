import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import { normalizeDecorators } from '@ckeditor/ckeditor5-link/src/utils';

// @ckeditor/ckeditor5-link@20 의 LinkImageEditing 은 image 엘리먼트에 linkHref 만
// 다운/업캐스트하고, config.link.decorators 로 등록한 수동 데코레이터(예: 새 창에서
// 열기)는 텍스트(inline attributeToElement)에만 변환기가 붙어 이미지 링크에는 전혀
// 반영되지 않는다(체크박스로 켜도 저장 데이터에 target/rel 이 안 나감). 이미지에도
// 같은 수동 데코레이터가 동작하도록 linkHref 다운/업캐스트와 동일한 방식으로
// <a> 래퍼에 속성을 직접 다운/업캐스트한다.
export default class LinkImageManualDecorators extends Plugin {
  static get pluginName() {
    return 'LinkImageManualDecorators';
  }

  init() {
    const editor = this.editor;
    const decorators = normalizeDecorators(editor.config.get('link.decorators')).filter(
      decorator => decorator.mode === 'manual'
    );

    if (!decorators.length) {
      return;
    }

    const schema = editor.model.schema;
    const conversion = editor.conversion;

    decorators.forEach(decorator => {
      schema.extend('image', { allowAttributes: decorator.id });

      conversion.for('downcast').add(downcastImageLinkManualDecorator(decorator));
      conversion.for('upcast').add(upcastImageLinkManualDecorator(decorator));
    });
  }
}

function downcastImageLinkManualDecorator(decorator) {
  const attributes = decorator.attributes || {};

  return dispatcher => {
    dispatcher.on(`attribute:${decorator.id}:image`, (evt, data, conversionApi) => {
      const viewFigure = conversionApi.mapper.toViewElement(data.item);
      const linkInImage = Array.from(viewFigure.getChildren()).find(child => child.name === 'a');

      if (!linkInImage) {
        return;
      }

      const writer = conversionApi.writer;

      Object.entries(attributes).forEach(([name, value]) => {
        if (data.attributeNewValue) {
          writer.setAttribute(name, value, linkInImage);
        } else {
          writer.removeAttribute(name, linkInImage);
        }
      });
    });
  };
}

function upcastImageLinkManualDecorator(decorator) {
  const attributes = decorator.attributes || {};
  const attributeEntries = Object.entries(attributes);

  return dispatcher => {
    // linkimageediting 의 linkHref 업캐스트(priority: high)가 image 모델 엘리먼트를
    // 먼저 만들어 둔 뒤에 실행되도록 기본 우선순위(그보다 낮음)로 등록한다.
    dispatcher.on('element:a', (evt, data, conversionApi) => {
      const viewLink = data.viewItem;
      const imageInLink = Array.from(viewLink.getChildren()).find(child => child.name === 'img');

      if (!imageInLink || !attributeEntries.length) {
        return;
      }

      const matchesDecorator = attributeEntries.every(([name, value]) => viewLink.getAttribute(name) === value);

      if (!matchesDecorator) {
        return;
      }

      const modelElement = data.modelCursor.nodeBefore;

      if (modelElement && modelElement.is('image')) {
        conversionApi.writer.setAttribute(decorator.id, true, modelElement);
      }
    });
  };
}
