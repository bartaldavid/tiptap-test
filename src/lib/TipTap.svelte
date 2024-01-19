<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import jsPDF from 'jspdf';
	import { htmlBoilerPlate } from '$lib';
	import htmlToPdfmake from 'html-to-pdfmake';
	import pdfPrinter from 'pdfmake';
	// import wkhtmltopdf from 'wkhtmltopdf';

	let element: Element;
	let editor: Editor;
	let html = '<p>Hello World! </p>';

	onMount(() => {
		editor = new Editor({
			element: element,
			extensions: [StarterKit],
			content: html,
			onTransaction: () => {
				// force re-render so `editor.isActive` works as expected
				editor = editor;
			}
		});

		editor.on('update', () => (html = editor.getHTML()));
	});

	onDestroy(() => {
		if (editor) {
			editor.destroy();
		}
	});

	function replaceTemplateStrings(template: string, values: Record<string, string>) {
		return template.replace(/\{\{\s*(\w+)\s*\}\}/g, function (_, key) {
			return values[key] || '';
		});
	}

	const templateSnippets = [
		{
			label: 'Name',
			tag: '{{name}}'
		},
		{
			label: 'Address',
			tag: '{{address}}'
		}
	];

	async function createPdfClient(html: string) {
		const doc = new jsPDF();

		doc.html(htmlBoilerPlate(html), {
			callback: function (doc) {
				doc.save('a4.pdf');
			},
			margin: 15,
			autoPaging: 'text',
			windowWidth: 1000,
			width: 500,
			html2canvas: {
				scale: 0.5
			}
		});
	}

	// async function wkPdf(html: string) {
	// 	wkhtmltopdf(html, { output: 'a4.pdf' });
	// }

	async function createWithHtmlToPdfmake(html: string) {
		const content = htmlToPdfmake(html);
		pdfPrinter.fonts = {
			Roboto: {
				normal:
					'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
				bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
				italics:
					'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
				bolditalics:
					'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf'
			}
		};
		pdfPrinter
			.createPdf({
				content,
				footer: function (currentPage: any, pageCount: any) {
					return currentPage.toString() + ' of ' + pageCount;
				}
			})
			.open();
	}
</script>

{#if editor}
	<div>
		<button
			on:click={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
			class:active={editor.isActive('heading', { level: 1 })}
		>
			H1
		</button>
		<button
			on:click={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
			class:active={editor.isActive('heading', { level: 2 })}
		>
			H2
		</button>
		<button
			on:click={() => editor.chain().focus().setParagraph().run()}
			class:active={editor.isActive('paragraph')}
		>
			P
		</button>
	</div>
	<div>
		{#each templateSnippets as snippet}
			<button on:click={() => editor.chain().focus().insertContent(snippet.tag).run()}
				>{snippet.label}</button
			>
		{/each}
	</div>
{/if}

<div bind:this={element} class="prose border p-4" />

<form action="/pdf" method="post">
	<input type="hidden" name="html" value={html} />
	<button>Create pdf with puppeteer on the server</button>
	<button formaction="/pdfmake">Create on server with pdfMake</button>
</form>

<button on:click={() => window && window.print()}>Print</button>

<button on:click={() => createPdfClient(html)}>Create pdf with pdfJs</button>
<button on:click={() => createWithHtmlToPdfmake(html)}
	>Create pdf with htmlToPdfmake and pdfmake</button
>

<form action="?/pdfmake"></form>
<!-- <button on:click={() => wkPdf(html)}>Create pdf with wkhtml</button> -->

<div class="prose p-4 border">
	<h2>Preview</h2>
	{@html replaceTemplateStrings(html, { name: 'World', address: '123 Main St' })}
</div>

<style>
	button.active {
		background: black;
		color: white;
	}

	button {
		@apply border border-gray-400 rounded p-2;
	}
</style>
