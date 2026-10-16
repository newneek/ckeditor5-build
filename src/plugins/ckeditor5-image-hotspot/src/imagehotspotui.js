import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

import imageHotspotIcon from '../theme/icons/imagehotspot.svg';

// 툴바 버튼 → 핫스팟 코드를 붙여넣는 창. 메이커의 "HTML 복사" 결과는 클립보드에 텍스트로만
// 담겨서 본문에 바로 붙여넣으면 코드 글자가 그대로 들어가므로, 별도 입력창으로 받는다.
// 핫스팟을 선택한 채로 누르면 현재 코드가 채워져 있어 링크만 고쳐 다시 넣을 수 있다.
// ponytail: CKEditor UI 대신 단순 DOM 모달. 여러 곳에서 쓰게 되면 ui의 View로 옮긴다.
export default class ImageHotspotUI extends Plugin {
  init() {
    const editor = this.editor;

    editor.ui.componentFactory.add('imageHotspot', locale => {
      const command = editor.commands.get('imageHotspot');
      const buttonView = new ButtonView(locale);

      buttonView.set({
        label: '이미지 핫스팟',
        icon: imageHotspotIcon,
        tooltip: true,
      });

      buttonView.bind('isEnabled').to(command, 'isEnabled');

      this.listenTo(buttonView, 'execute', () => openDialog(command, () => editor.editing.view.focus()));

      return buttonView;
    });
  }
}

function openDialog(command, onClose) {
  const overlay = document.createElement('div');
  overlay.setAttribute('style', 'position:fixed;inset:0;z-index:10000;background:rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center;padding:16px;');
  overlay.innerHTML = `
    <div role="dialog" aria-modal="true" aria-labelledby="ck-hotspot-title" style="background:#fff;border-radius:8px;padding:20px;width:100%;max-width:640px;box-shadow:0 8px 24px rgba(0,0,0,.2);font-size:14px;line-height:1.5;">
      <h2 id="ck-hotspot-title" style="margin:0 0 4px;font-size:16px;">이미지 핫스팟</h2>
      <p style="margin:0 0 12px;color:#666;">이미지 핫스팟 메이커에서 복사한 HTML 코드를 붙여 넣으세요.</p>
      <textarea style="width:100%;height:240px;box-sizing:border-box;font-family:monospace;font-size:12px;padding:8px;border:1px solid #ccc;border-radius:4px;"></textarea>
      <p class="ck-hotspot-error" role="alert" style="margin:8px 0 0;color:#d93025;display:none;">
        핫스팟 코드를 찾지 못했어요. 메이커에서 복사한 코드를 그대로 붙여 넣었는지, 이미지 주소와 링크가 http(s)로 시작하는지 확인해 주세요.
      </p>
      <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:12px;">
        <button type="button" data-action="cancel" class="btn">취소</button>
        <button type="button" data-action="insert" class="btn btn-primary">${command.value ? '수정' : '넣기'}</button>
      </div>
    </div>`;

  const textarea = overlay.querySelector('textarea');
  const error = overlay.querySelector('.ck-hotspot-error');
  textarea.value = command.getSelectedHtml();

  const close = () => {
    overlay.remove();
    onClose();
  };

  overlay.addEventListener('click', e => {
    const action = e.target.getAttribute('data-action');
    if (e.target === overlay || action === 'cancel') {
      close();
    } else if (action === 'insert') {
      if (command.execute(textarea.value)) {
        close();
      } else {
        error.style.display = 'block';
      }
    }
  });
  overlay.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      close();
    }
  });

  document.body.appendChild(overlay);
  textarea.focus();
}
