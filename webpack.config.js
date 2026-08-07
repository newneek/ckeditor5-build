/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );


/* eslint-env node */

const path = require( 'path' );
const webpack = require( 'webpack' );
const { bundler, styles } = require( '@ckeditor/ckeditor5-dev-utils' );
const CKEditorWebpackPlugin = require( '@ckeditor/ckeditor5-dev-webpack-plugin' );
const UglifyJsWebpackPlugin = require( 'uglifyjs-webpack-plugin' );

function createConfig( { entryFile, library, jsFilename, cssFilename } ) {
	return {
		devtool: 'source-map',
		performance: { hints: false },

		entry: path.resolve( __dirname, 'src', entryFile ),

		output: {
			// The name under which the editor will be exported.
			library,

			path: path.resolve( __dirname, 'build' ),
			filename: jsFilename,
			libraryTarget: 'umd',
			libraryExport: 'default'
		},

		optimization: {
			minimizer: [
				new UglifyJsWebpackPlugin( {
					sourceMap: true,
					uglifyOptions: {
						output: {
							// Preserve CKEditor 5 license comments.
							comments: /^!/
						}
					}
				} )
			]
		},

		plugins: [
			new CKEditorWebpackPlugin( {
				// UI language. Language codes follow the https://en.wikipedia.org/wiki/ISO_639-1 format.
				// When changing the built-in language, remember to also change it in the editor's configuration (src/ckeditor.js).
				language: 'en',
				// additionalLanguages: 'all'
			} ),
			new webpack.BannerPlugin( {
				banner: bundler.getLicenseBanner(),
				raw: true
			} ),
			new MiniCssExtractPlugin( {
				filename: cssFilename
			} )
		],

		module: {
			rules: [
				{
					test: /\.svg$/,
					use: [ 'raw-loader' ]
				},
				{
					test: /\.css$/,
					use: [
						MiniCssExtractPlugin.loader,
						'css-loader',
						{
							loader: 'postcss-loader',
							options: styles.getPostCssConfig( {
								themeImporter: {
									themePath: require.resolve( '@ckeditor/ckeditor5-theme-lark' )
								},
								minify: true
							} )
						}
					]
				}
			]
		}
	};
}

// InlineEditor(/content/{contentId}/inline)와 ClassicEditor(/content/{contentId})가
// 같은 기능 플러그인(src/plugins-list.js)을 공유하지만 에디터 창작자(base) 클래스와
// UI 구조가 달라 별도 번들로 빌드한다.
module.exports = [
	createConfig( {
		entryFile: 'ckeditor.js',
		library: 'InlineEditor',
		jsFilename: 'ckeditor.js',
		cssFilename: 'styles.css'
	} ),
	createConfig( {
		entryFile: 'ckeditor-classic.js',
		library: 'ClassicEditor',
		jsFilename: 'ckeditor-classic.js',
		cssFilename: 'styles-classic.css'
	} )
];
