/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

// The editor creator to use.
import InlineEditorBase from '@ckeditor/ckeditor5-editor-inline/src/inlineeditor';

import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import UploadAdapter from '@ckeditor/ckeditor5-adapter-ckfinder/src/uploadadapter';
import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import CKFinder from '@ckeditor/ckeditor5-ckfinder/src/ckfinder';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import List from '@ckeditor/ckeditor5-list/src/list';
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice';
import Quotes from './plugins/ckeditor5-quotes/src/quotes';
import Comment from './plugins/ckeditor5-comment/src/comment';
import MediaEmbed from './plugins/ckeditor5-media-embed/src/mediaembed';
import Link from './plugins/ckeditor5-link/src/link';
import Paste from './plugins/ckeditor5-paste/src/paste';
import Big from './plugins/ckeditor5-big/src/big';
import Sns from './plugins/ckeditor5-sns-embed/src/sns';
import BlockQuote from './plugins/ckeditor5-block-quote/src/blockquote';
import Div from './plugins/ckeditor5-div/src/div';
import Image from './plugins/ckeditor5-image/src/image';
import ImageCaption from './plugins/ckeditor5-image/src/imagecaption';
import ImageStyle from './plugins/ckeditor5-image/src/imagestyle';
import ImageToolbar from './plugins/ckeditor5-image/src/imagetoolbar';
import ImageUpload from './plugins/ckeditor5-image/src/imageupload';

export default class InlineEditor extends InlineEditorBase {}

// Plugins to include in the build.
InlineEditor.builtinPlugins = [
	Paste,
	Essentials,
	UploadAdapter,
	Autoformat,
	Bold,
	Italic,
	BlockQuote,
	CKFinder,
	Image,
	ImageCaption,
	ImageStyle,
	ImageToolbar,
	ImageUpload,
	Link,
	List,
	MediaEmbed,
	PasteFromOffice,
	Comment,
	Quotes,
	Big,
	Heading,
	Sns,
	Div,
];

// Editor configuration.
InlineEditor.defaultConfig = {
	toolbar: {
		viewportTopOffset : 60,
		items: [
			'heading',
			'bold',
			'big',
			'blockQuote',
			'quotes',
			'comment',
			'bulletedList',
			'link',
			'imageUpload',
			'mediaEmbed',
			'sns',
		]
	},
	heading: {
		options: [
			{ model: 'paragraph', title: '일반', class: 'ck-heading_paragraph' },
			{ model: 'heading3', view: 'h3', title: '소제목', class: 'ck-heading_heading3' },
		]
	},
	language: 'en'
};
