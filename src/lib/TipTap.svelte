<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';

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
</script>

{#if editor}
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
{/if}

<div bind:this={element} class="prose" />

<form action="/pdf" method="post">
	<input type="hidden" name="html" value={html} />
	<button>Create pdf</button>
</form>

<style>
	button.active {
		background: black;
		color: white;
	}
</style>
