import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import UploadAdapter from '@ckeditor/ckeditor5-adapter-ckfinder/src/uploadadapter';
import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline';
import Strikethrough from '@ckeditor/ckeditor5-basic-styles/src/strikethrough';
import Subscript from '@ckeditor/ckeditor5-basic-styles/src/subscript';
import Superscript from '@ckeditor/ckeditor5-basic-styles/src/superscript';
import CKFinder from '@ckeditor/ckeditor5-ckfinder/src/ckfinder';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import List from '@ckeditor/ckeditor5-list/src/list';
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice';
import MediaEmbed from '@ckeditor/ckeditor5-media-embed/src/mediaembed';
import Link from '@ckeditor/ckeditor5-link/src/link';
import LinkImage from '@ckeditor/ckeditor5-link/src/linkimage';
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote';
import CodeBlock from '@ckeditor/ckeditor5-code-block/src/codeblock';
import Image from '@ckeditor/ckeditor5-image/src/image';
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption';
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle';
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar';
import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload';
import Font from '@ckeditor/ckeditor5-font/src/font';
import HorizontalLine from '@ckeditor/ckeditor5-horizontal-line/src/horizontalline';
import Table from '@ckeditor/ckeditor5-table/src/table';
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar';
import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment';
import RemoveFormat from '@ckeditor/ckeditor5-remove-format/src/removeformat';
import SpecialCharacters from '@ckeditor/ckeditor5-special-characters/src/specialcharacters';
import SpecialCharactersEssentials from '@ckeditor/ckeditor5-special-characters/src/specialcharactersessentials';

import Big from './plugins/ckeditor5-big/src/big';
import Quote from './plugins/ckeditor5-quote/src/quote';
import Div from './plugins/ckeditor5-div/src/div';
import Details from './plugins/ckeditor5-details/src/details';
import Columns from './plugins/ckeditor5-columns/src/columns';
import LinkImageOpenInNewTab from './plugins/ckeditor5-link-image-new-tab/src/linkimageopeninnewtab';
import LinkImageHideDecorators from './plugins/ckeditor5-link-image-new-tab/src/linkimagehidedecorators';

// InlineEditor(ckeditor.js)와 ClassicEditor(ckeditor-classic.js) 빌드가 공유하는
// 기능 플러그인 목록. 에디터 창작자(base) 클래스만 다르고 기능은 동일해야 하므로
// 목록을 한 곳에서 관리한다.
export default [
  Essentials,
  UploadAdapter,
  Autoformat,
  Bold,
  Underline,
  Strikethrough,
  Subscript,
  Superscript,
  BlockQuote,
  CKFinder,
  CodeBlock,
  HorizontalLine,
  Image,
  ImageCaption,
  ImageStyle,
  ImageToolbar,
  ImageUpload,
  Link,
  LinkImage,
  LinkImageOpenInNewTab,
  LinkImageHideDecorators,
  List,
  MediaEmbed,
  PasteFromOffice,
  Heading,
  Big,
  Quote,
  Div,
  Details,
  Columns,
  Font,
  Table,
  TableToolbar,
  Alignment,
  RemoveFormat,
  SpecialCharacters,
  SpecialCharactersEssentials,
];
