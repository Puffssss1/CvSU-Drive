"use client"
import { useState, useEffect, useRef, useMemo } from 'react';
import React from 'react';
import { CKEditor, useCKEditorCloud } from '@ckeditor/ckeditor5-react';


const LICENSE_KEY =
	'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3MzY3MjYzOTksImp0aSI6Ijk2ZDE5ZGI2LWJmMmEtNDg5Yy1hNDcxLWRhMDQ5NDZhNGZlNCIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6IjQ4MzY5YjkwIn0.D6OZrIIyY4j0ei4y6fQkThuxl6oHzXwnp66WbRQFbZi-A5l4uss65kxCPdULQFkiCccHxzly21swpnowE444lg';

const CLOUD_SERVICES_TOKEN_URL =
	'https://sqlq79td7m6b.cke-cs.com/token/dev/0e43fc2d47319cc2255fc3a7106067072ddff9b335ce93562b3740114730?limit=10';

	const handleSave = async () => {
		try {
			const response = await fetch('/api/save-document', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ content: editorContent }),
			});
			if (response.ok) {
				console.log('Document saved successfully');
			} else {
				console.error('Failed to save document');
			}
		} catch (error) {
			console.error('Error saving document:', error);
		}
	};

export default function App() {
	const editorContainerRef = useRef(null);
	const editorMenuBarRef = useRef(null);
	const editorToolbarRef = useRef(null);
	const editorRef = useRef(null);
	const [isLayoutReady, setIsLayoutReady] = useState(false);
	const cloud = useCKEditorCloud({ version: '44.1.0', premium: true, ckbox: { version: '2.6.1' } });

	useEffect(() => {
		setIsLayoutReady(true);

		return () => setIsLayoutReady(false);
	}, []);

	const { DecoupledEditor, editorConfig } = useMemo(() => {
		if (cloud.status !== 'success' || !isLayoutReady) {
			return {};
		}

		const {
			DecoupledEditor,
			AutoImage,
			Autosave,
			Bold,
			CKBox,
			CKBoxImageEdit,
			CloudServices,
			Code,
			Essentials,
			FontBackgroundColor,
			FontColor,
			FontFamily,
			FontSize,
			GeneralHtmlSupport,
			ImageBlock,
			ImageCaption,
			ImageInline,
			ImageInsert,
			ImageInsertViaUrl,
			ImageResize,
			ImageStyle,
			ImageTextAlternative,
			ImageToolbar,
			ImageUpload,
			Italic,
			Link,
			List,
			ListProperties,
			Markdown,
			MediaEmbed,
			PageBreak,
			Paragraph,
			PasteFromMarkdownExperimental,
			PasteFromOffice,
			PictureEditing,
			RemoveFormat,
			SpecialCharacters,
			Strikethrough,
			Subscript,
			Superscript,
			Table,
			TableCaption,
			TableCellProperties,
			TableColumnResize,
			TableProperties,
			TableToolbar,
			TodoList,
			Underline
		} = cloud.CKEditor;
		const { ExportPdf, ExportWord, ImportWord, MultiLevelList, Pagination } = cloud.CKEditorPremiumFeatures;

		return {
			DecoupledEditor,
			editorConfig: {
				toolbar: {
					items: [
						'previousPage',
						'nextPage',
						'|',
						'fontSize',
						'fontFamily',
						'fontColor',
						'fontBackgroundColor',
						'|',
						'bold',
						'italic',
						'underline',
						'|',
						'link',
						'insertImage',
						'insertTable',
						'|',
						'bulletedList',
						'numberedList',
						'multiLevelList',
						'todoList'
					],
					shouldNotGroupWhenFull: false
				},
				plugins: [
					AutoImage,
					Autosave,
					Bold,
					CKBox,
					CKBoxImageEdit,
					CloudServices,
					Code,
					Essentials,
					ExportPdf,
					ExportWord,
					FontBackgroundColor,
					FontColor,
					FontFamily,
					FontSize,
					GeneralHtmlSupport,
					ImageBlock,
					ImageCaption,
					ImageInline,
					ImageInsert,
					ImageInsertViaUrl,
					ImageResize,
					ImageStyle,
					ImageTextAlternative,
					ImageToolbar,
					ImageUpload,
					ImportWord,
					Italic,
					Link,
					List,
					ListProperties,
					Markdown,
					MediaEmbed,
					MultiLevelList,
					PageBreak,
					Pagination,
					Paragraph,
					PasteFromMarkdownExperimental,
					PasteFromOffice,
					PictureEditing,
					RemoveFormat,
					SpecialCharacters,
					Strikethrough,
					Subscript,
					Superscript,
					Table,
					TableCaption,
					TableCellProperties,
					TableColumnResize,
					TableProperties,
					TableToolbar,
					TodoList,
					Underline,
				],
				cloudServices: {
					tokenUrl: CLOUD_SERVICES_TOKEN_URL,
					uploadUrl: 'localhost:3000/api/textEditor',
				},
				exportPdf: {
					stylesheets: [
						/* This path should point to application stylesheets. */
						/* See: https://ckeditor.com/docs/ckeditor5/latest/features/converters/export-pdf.html */
						'./App.css',
						/* Export PDF needs access to stylesheets that style the content. */
						'https://cdn.ckeditor.com/ckeditor5/44.1.0/ckeditor5.css',
						'https://cdn.ckeditor.com/ckeditor5-premium-features/44.1.0/ckeditor5-premium-features.css'
					],
					fileName: 'export-pdf-demo.pdf',
					converterOptions: {
						format: 'A4',
						margin_top: '20mm',
						margin_bottom: '20mm',
						margin_right: '12mm',
						margin_left: '12mm',
						page_orientation: 'portrait'
					}
				},
				exportWord: {
					stylesheets: [
						/* This path should point to application stylesheets. */
						/* See: https://ckeditor.com/docs/ckeditor5/latest/features/converters/export-word.html */
						'./App.css',
						/* Export Word needs access to stylesheets that style the content. */
						'https://cdn.ckeditor.com/ckeditor5/44.1.0/ckeditor5.css',
						'https://cdn.ckeditor.com/ckeditor5-premium-features/44.1.0/ckeditor5-premium-features.css'
					],
					fileName: 'export-word-demo.docx',
					converterOptions: {
						document: {
							orientation: 'portrait',
							size: 'A4',
							margins: {
								top: '20mm',
								bottom: '20mm',
								right: '12mm',
								left: '12mm'
							}
						}
					}
				},
				fontFamily: {
					supportAllValues: true
				},
				fontSize: {
					options: [10, 12, 14, 'default', 18, 20, 22],
					supportAllValues: true
				},
				htmlSupport: {
					allow: [
						{
							name: /^.*$/,
							styles: true,
							attributes: true,
							classes: true
						}
					]
				},
				image: {
					toolbar: [
						'toggleImageCaption',
						'imageTextAlternative',
						'|',
						'imageStyle:inline',
						'imageStyle:wrapText',
						'imageStyle:breakText',
						'|',
						'resizeImage',
						'|',
						'ckboxImageEdit'
					]
				},
				initialData:
					'<h2>Congratulations on setting up CKEditor 5! 🎉</h2>\n<p>\n\tYou\'ve successfully created a CKEditor 5 project. This powerful text editor\n\twill enhance your application, enabling rich text editing capabilities that\n\tare customizable and easy to use.\n</p>\n<h3>What\'s next?</h3>\n<ol>\n\t<li>\n\t\t<strong>Integrate into your app</strong>: time to bring the editing into\n\t\tyour application. Take the code you created and add to your application.\n\t</li>\n\t<li>\n\t\t<strong>Explore features:</strong> Experiment with different plugins and\n\t\ttoolbar options to discover what works best for your needs.\n\t</li>\n\t<li>\n\t\t<strong>Customize your editor:</strong> Tailor the editor\'s\n\t\tconfiguration to match your application\'s style and requirements. Or\n\t\teven write your plugin!\n\t</li>\n</ol>\n<p>\n\tKeep experimenting, and don\'t hesitate to push the boundaries of what you\n\tcan achieve with CKEditor 5. Your feedback is invaluable to us as we strive\n\tto improve and evolve. Happy editing!\n</p>\n<h3>Helpful resources</h3>\n<ul>\n\t<li>📝 <a href="https://portal.ckeditor.com/checkout?plan=free">Trial sign up</a>,</li>\n\t<li>📕 <a href="https://ckeditor.com/docs/ckeditor5/latest/installation/index.html">Documentation</a>,</li>\n\t<li>⭐️ <a href="https://github.com/ckeditor/ckeditor5">GitHub</a> (star us if you can!),</li>\n\t<li>🏠 <a href="https://ckeditor.com">CKEditor Homepage</a>,</li>\n\t<li>🧑‍💻 <a href="https://ckeditor.com/ckeditor-5/demo/">CKEditor 5 Demos</a>,</li>\n</ul>\n<h3>Need help?</h3>\n<p>\n\tSee this text, but the editor is not starting up? Check the browser\'s\n\tconsole for clues and guidance. It may be related to an incorrect license\n\tkey if you use premium features or another feature-related requirement. If\n\tyou cannot make it work, file a GitHub issue, and we will help as soon as\n\tpossible!\n</p>\n',
				licenseKey: LICENSE_KEY,
				link: {
					addTargetToExternalLinks: true,
					defaultProtocol: 'https://',
					decorators: {
						toggleDownloadable: {
							mode: 'manual',
							label: 'Downloadable',
							attributes: {
								download: 'file'
							}
						}
					}
				},
				list: {
					properties: {
						styles: true,
						startIndex: true,
						reversed: true
					}
				},
				menuBar: {
					isVisible: true
				},
				pagination: {
					pageWidth: '21cm',
					pageHeight: '29.7cm',
					pageMargins: {
						top: '20mm',
						bottom: '20mm',
						right: '12mm',
						left: '12mm'
					}
				},
				placeholder: 'Type or paste your content here!',
				table: {
					contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties']
				}
			}
		};
	}, [cloud, isLayoutReady]);

	useEffect(() => {
		if (editorConfig) {
			// configUpdateAlert(editorConfig);
		}
	}, [editorConfig]);

	return (
		<div className="main-container">
			<div className="editor-container editor-container_document-editor editor-container_include-pagination" ref={editorContainerRef}>
				<div className="editor-container__menu-bar" ref={editorMenuBarRef}></div>
				<div className="editor-container__toolbar" ref={editorToolbarRef}></div>
				<div className="editor-container__editor-wrapper">
					<div className="editor-container__editor">
						<div ref={editorRef}>
							{DecoupledEditor && editorConfig && (
								<CKEditor
									onReady={editor => {
										editorToolbarRef.current.appendChild(editor.ui.view.toolbar.element);
										editorMenuBarRef.current.appendChild(editor.ui.view.menuBarView.element);
										
										// Add custom logic on editor initialization
    									console.log('Editor is ready!', editor);	
									}}
									onChange={(event, editor) => {
										const data = editor.getData();
										console.log('Editor data changed:', data); // Log editor data on change
									}}
									onAfterDestroy={() => {
										Array.from(editorToolbarRef.current.children).forEach(child => child.remove());
										Array.from(editorMenuBarRef.current.children).forEach(child => child.remove());
									}}
									editor={DecoupledEditor}
									config={editorConfig}
								/>
							)}
						</div>
					</div>
				</div>
			</div>
			<button onClick={handleSave}>Save Document</button>
		</div>
	);
}


