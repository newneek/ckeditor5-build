import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import Command from '@ckeditor/ckeditor5-core/src/command';
import { toWidget, findOptimalInsertionPosition } from '@ckeditor/ckeditor5-widget/src/utils';

// 이미지 위 여러 영역에 링크를 거는 "이미지 핫스팟" 블록.
//
// 핫스팟 코드(퍼블리 이미지 핫스팟 메이커 출력)는 영역 위치를 style(position/left/top/...)로,
// 링크를 글자 없는 <a></a>로 표현한다. CKEditor5 v20은 스키마에 없는 style 속성과 빈 <a>를
// 버리고 <img>는 <figure class="image">로 바꾸기 때문에, 일반 변환을 타면 구조가 다 깨진다.
// 그래서 핫스팟 구조 전체를 하나의 위젯(모델 요소 1개 + 값 1개)으로 받아 두고, 저장할 때
// 메이커와 같은 HTML을 다시 만들어 낸다. 에디터는 위젯 안쪽을 건드리지 않으므로
// 임시 저장·다시 열기·발행을 거쳐도 구조가 바뀌지 않는다.
//
// 뷰어(membership-web)가 일반 이미지/링크 처리와 구분할 수 있도록 바깥 div에
// data-hotspot 속성을 붙인다.
export default class ImageHotspotEditing extends Plugin {
  static get pluginName() {
    return 'ImageHotspotEditing';
  }

  init() {
    const editor = this.editor;
    const conversion = editor.conversion;

    editor.commands.add('imageHotspot', new ImageHotspotCommand(editor));

    editor.model.schema.register('imageHotspot', {
      allowWhere: '$block',
      isObject: true,
      isBlock: true,
      allowAttributes: ['hotspot'],
    });

    // Div 플러그인의 일반 div 변환보다 먼저 가로채서, div와 그 안의 img·a를 통째로 소비한다.
    conversion.for('upcast').add(dispatcher => {
      dispatcher.on('element:div', (evt, data, conversionApi) => {
        const { consumable, writer } = conversionApi;
        const hotspot = parseHotspot(data.viewItem);

        if (!hotspot || !consumable.test(data.viewItem, { name: true })) {
          return;
        }

        const modelElement = writer.createElement('imageHotspot', { hotspot });
        const splitResult = conversionApi.splitToAllowedParent(modelElement, data.modelCursor);

        if (!splitResult) {
          return;
        }

        writer.insert(modelElement, splitResult.position);
        consumable.consume(data.viewItem, { name: true });
        for (const child of data.viewItem.getChildren()) {
          if (child.is('element')) {
            consumable.consume(child, { name: true });
          }
        }

        data.modelRange = writer.createRangeOn(modelElement);
        data.modelCursor = splitResult.cursorParent
          ? writer.createPositionAt(splitResult.cursorParent, 0)
          : data.modelRange.end;
      }, { priority: 'high' });
    });

    conversion.for('dataDowncast').elementToElement({
      model: 'imageHotspot',
      view: (modelElement, writer) => createHotspotView(modelElement.getAttribute('hotspot'), writer, false),
    });

    // 편집 화면에서는 링크가 실수로 열리지 않도록 <a> 대신 테두리 있는 <span>으로 영역만 보여준다.
    conversion.for('editingDowncast').elementToElement({
      model: 'imageHotspot',
      view: (modelElement, writer) =>
        toWidget(createHotspotView(modelElement.getAttribute('hotspot'), writer, true), writer, { label: '이미지 핫스팟' }),
    });
  }
}

class ImageHotspotCommand extends Command {
  refresh() {
    const model = this.editor.model;
    const selected = model.document.selection.getSelectedElement();

    // 선택된 핫스팟 요소(없으면 null). 코드 문자열은 getSelectedHtml()로 필요할 때만 만든다.
    this.value = selected && selected.is('imageHotspot') ? selected : null;

    const position = findOptimalInsertionPosition(model.document.selection, model);
    this.isEnabled = model.schema.checkChild(position.parent, 'imageHotspot');
  }

  // 선택된 핫스팟의 저장용 HTML. data.stringify(element)는 요소의 자식만 변환하므로
  // 선택 영역을 복사한 조각(fragment)째로 변환한다.
  getSelectedHtml() {
    const { data, model } = this.editor;
    return this.value ? data.stringify(model.getSelectedContent(model.document.selection)) : '';
  }

  // 핫스팟 코드를 받아 위젯으로 삽입한다(핫스팟이 선택돼 있으면 교체). 인식 못 하면 false.
  execute(html) {
    const editor = this.editor;
    const fragment = editor.data.toModel(editor.data.processor.toView(html));
    const hotspot = Array.from(fragment.getChildren()).find(child => child.is('imageHotspot'));

    if (!hotspot) {
      return false;
    }

    editor.model.change(writer => {
      const element = writer.createElement('imageHotspot', { hotspot: hotspot.getAttribute('hotspot') });
      editor.model.insertContent(element);
      writer.setSelection(element, 'on');
    });

    return true;
  }
}

const SAFE_URL = /^https?:\/\//i;

// <div><img><a style="position:absolute;...">...</div> 구조면 핫스팟 값으로, 아니면 null.
// 위치·크기는 % 숫자만, 주소는 http(s)만 받는다. 붙여넣은 style을 그대로 쓰지 않고
// 출력 시 다시 조립하므로 임의 CSS·스크립트가 섞여 들어오지 않는다.
export function parseHotspot(div) {
  const children = Array.from(div.getChildren()).filter(child => child.is('element'));
  const [img, ...anchors] = children;

  if (!img || !img.is('element', 'img') || !anchors.length) {
    return null;
  }
  if (!anchors.every(a => a.is('element', 'a') && a.getStyle('position') === 'absolute')) {
    return null;
  }

  const src = (img.getAttribute('src') || '').trim();
  if (!SAFE_URL.test(src)) {
    return null;
  }

  const links = [];
  for (const a of anchors) {
    const href = (a.getAttribute('href') || '').trim();
    const box = ['left', 'top', 'width', 'height'].map(prop => parsePercent(a.getStyle(prop)));

    if (!SAFE_URL.test(href) || box.includes(null)) {
      continue;
    }

    const [left, top, width, height] = box;
    links.push({
      href,
      label: (a.getAttribute('aria-label') || a.getAttribute('title') || '').trim().slice(0, 200) || `링크 ${links.length + 1}`,
      newTab: a.getAttribute('target') === '_blank',
      left,
      top,
      width,
      height,
    });
  }

  if (!links.length) {
    return null;
  }

  return { src, alt: (img.getAttribute('alt') || '').trim(), links };
}

function parsePercent(value) {
  const match = /^(-?\d+(?:\.\d+)?)%$/.exec((value || '').trim());
  return match ? Math.min(100, Math.max(0, Number(match[1]))) : null;
}

const pct = n => `${n}%`;

function createHotspotView({ src, alt, links }, writer, forEditing) {
  const div = writer.createContainerElement('div', {
    ...(forEditing ? { class: 'ck-image-hotspot' } : { 'data-hotspot': '1' }),
    style: 'position:relative;display:block;width:100%;max-width:100%;line-height:0;',
  });

  const children = [writer.createEmptyElement('img', { src, alt, style: 'display:block;width:100%;height:auto;border:0;' })];

  links.forEach(({ href, label, newTab, left, top, width, height }) => {
    const box = `position:absolute;display:block;left:${pct(left)};top:${pct(top)};width:${pct(width)};height:${pct(height)};z-index:1;`;

    if (forEditing) {
      children.push(writer.createEmptyElement('span', {
        title: label ? `${label} · ${href}` : href,
        style: `${box}box-sizing:border-box;border:2px dashed #1a73e8;background:rgba(26,115,232,.15);`,
      }));
      return;
    }

    // 메이커 출력과 같은 순서·속성. 빈 요소로 만들어야 데이터 출력 시 &nbsp;가 채워지지 않는다.
    children.push(writer.createEmptyElement('a', {
      href,
      ...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {}),
      'aria-label': label,
      title: label,
      style: box,
    }));
  });

  children.forEach(child => writer.insert(writer.createPositionAt(div, 'end'), child));

  return div;
}
