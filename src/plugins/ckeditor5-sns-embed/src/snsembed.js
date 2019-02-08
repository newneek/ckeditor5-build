
/**
 * @module media-embed/mediaembed
 */
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import snsIcon from '../theme/icons/sns.svg';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

export default class SnsEmbed extends Plugin {
	init() {
		const editor = this.editor;

		editor.ui.componentFactory.add( 'sns', locale => {
			const view = new ButtonView( locale );

			view.set( {
				label: 'embed twitter or instagram',
				icon: snsIcon,
				tooltip: true
			} );

			// Callback executed once the image is clicked.
			view.on( 'execute', () => {
				const snsCode = prompt( "트위터 또는 인스타그램 게시물 코드를 삽입하세요" );
				console.log(snsCode);

				editor.model.change( writer => {
					let parser = new DOMParser();
					let doc = parser.parseFromString(snsCode, "text/html");
					let scriptElements = doc.documentElement.getElementsByTagName("script");
					if (typeof scriptElements !== "undefined") {
						for (let scriptElement of scriptElements) {
							scriptElement.remove();
						}
					}

					let instagramElements = doc.documentElement.getElementsByClassName("instagram-media");
					let twitterElements = doc.documentElement.getElementsByClassName("twitter-tweet");

					if (instagramElements === undefined && twitterElements ===undefined) {
						alert("트위터 또는 인스타그램 게시물 코드를 삽입하세요");
					}
					let snsCodeWithoutScriptTag = new XMLSerializer().serializeToString(doc.documentElement);
					console.log(snsCodeWithoutScriptTag);
					const viewFragment = editor.data.processor.toView( snsCodeWithoutScriptTag );
					const modelFragment = editor.data.toModel( viewFragment );

					editor.model.insertContent(modelFragment, editor.model.document.selection );
				} );
				/**
				 * @module media-embed/mediaembed
				 */
				import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
				import snsIcon from '../theme/icons/sns.svg';
				import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

				export default class SnsEmbed extends Plugin {
					init() {
						const editor = this.editor;

						editor.ui.componentFactory.add( 'sns', locale => {
							const view = new ButtonView( locale );

							view.set( {
								label: 'embed twitter or instagram',
								icon: snsIcon,
								tooltip: true
							} );

							// Callback executed once the image is clicked.
							view.on( 'execute', () => {
								const snsCode = prompt( "트위터 또는 인스타그램 게시물 코드를 삽입하세요" );
								console.log(snsCode);

								editor.model.change( writer => {
									let parser = new DOMParser();
									let doc = parser.parseFromString(snsCode, "text/html");
									let scriptElements = doc.documentElement.getElementsByTagName("script");
									if (typeof scriptElements !== "undefined") {
										for (let scriptElement of scriptElements) {
											scriptElement.remove();
										}
									}

									let instagramElements = doc.documentElement.getElementsByClassName("instagram-media");
									let twitterElements = doc.documentElement.getElementsByClassName("twitter-tweet");

									if (instagramElements === undefined && twitterElements ===undefined) {
										alert("트위터 또는 인스타그램 게시물 코드를 삽입하세요");
									}
									let snsCodeWithoutScriptTag = new XMLSerializer().serializeToString(doc.documentElement);
									console.log(snsCodeWithoutScriptTag);
									const viewFragment = editor.data.processor.toView( snsCodeWithoutScriptTag );
									const modelFragment = editor.data.toModel( viewFragment );

									editor.model.insertContent(modelFragment, editor.model.document.selection );
								} );
							} );
							return view;
						} );
					}
				}

			} );
			return view;
		} );
	}
}
