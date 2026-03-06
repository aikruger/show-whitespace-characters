import { Plugin } from 'obsidian';
import { Extension } from '@codemirror/state';
import { EditorView, Decoration, DecorationSet, ViewPlugin, ViewUpdate, WidgetType } from '@codemirror/view';
import { DEFAULT_SETTINGS, WhitespacePluginSettings, WhitespaceSettingTab } from './settings';

// Custom widget for newline display
class NewlineWidget extends WidgetType {
	toDOM(): HTMLElement {
		const span = document.createElement('span');
		span.className = 'cm-whitespace-char cm-whitespace-newline';
		span.setAttribute('data-ws-type', 'newline');
		return span;
	}
}

export default class ShowWhitespacePlugin extends Plugin {
	settings: WhitespacePluginSettings;
	private editorExtension: Extension[] = [];

	async onload() {
		await this.loadSettings();

		// Register CodeMirror 6 editor extension
		this.editorExtension = this.createEditorExtension();
		this.registerEditorExtension(this.editorExtension);

		// Apply CSS classes to body
		this.updateBodyClasses();

		// Add command to toggle whitespace visibility
		this.addCommand({
			id: 'toggle-whitespace-visibility',
			name: 'Toggle whitespace visualization on/off',
			callback: () => {
				this.settings.enabled = !this.settings.enabled;
				void this.saveSettings();
			}
		});

		// Add settings tab
		this.addSettingTab(new WhitespaceSettingTab(this.app, this));
	}

	onunload() {
		// Clean up body classes
		document.body.classList.remove(
			'whitespace-plugin-enabled',
			'whitespace-hide-newline',
			'whitespace-hide-tab',
			'whitespace-hide-space',
			'whitespace-hide-single-space',
			'whitespace-hide-trailing-space',
			'whitespace-show-strict-line-break'
		);
	}

	createEditorExtension(): Extension[] {
		const getSettings = () => this.settings;

		// Create ViewPlugin that adds decorations for whitespace
		const whitespaceDecorator = ViewPlugin.fromClass(
			class {
				decorations: DecorationSet;

				constructor(view: EditorView) {
					this.decorations = this.buildDecorations(view);
				}

				update(update: ViewUpdate) {
					// Rebuild decorations when document changes or viewport scrolls
					if (update.docChanged || update.viewportChanged) {
						this.decorations = this.buildDecorations(update.view);
					}
				}

				buildDecorations(view: EditorView): DecorationSet {
					// Don't decorate if plugin disabled
					if (!getSettings().enabled) {
						return Decoration.none;
					}

					const decorations = [];
					const { from, to } = view.viewport;

					// Iterate through visible lines only
					for (let pos = from; pos <= to; ) {
						const line = view.state.doc.lineAt(pos);
						const lineText = line.text;

						// Process each character in line
						for (let i = 0; i < lineText.length; i++) {
							const char = lineText[i];
							const charPos = line.from + i;

							if (char === ' ') {
								// Count consecutive spaces
								let spaceCount = 1;
								while (i + spaceCount < lineText.length && lineText[i + spaceCount] === ' ') {
									spaceCount++;
								}

								// Determine space type
								const isTrailing = i + spaceCount === lineText.length;
								const isStrictLineBreak = isTrailing && spaceCount === 2;

								// Create decoration for each space
								for (let j = 0; j < spaceCount; j++) {
									const classes = ['cm-whitespace-char'];

									// Add count-specific class (capped at 16)
									if (spaceCount === 1) {
										classes.push('cm-whitespace-single');
									} else {
										classes.push(`cm-whitespace-multiple-${Math.min(spaceCount, 16)}`);
									}

									if (isTrailing) {
										classes.push('cm-whitespace-trailing');
									}

									if (isStrictLineBreak) {
										classes.push('cm-whitespace-strict-break');
									}

									decorations.push(
										Decoration.mark({
											class: classes.join(' '),
											attributes: { 'data-ws-type': 'space' }
										}).range(charPos + j, charPos + j + 1)
									);
								}

								// Skip already-processed spaces
								i += spaceCount - 1;

							} else if (char === '\t') {
								decorations.push(
									Decoration.mark({
										class: 'cm-whitespace-char cm-whitespace-tab',
										attributes: { 'data-ws-type': 'tab' }
									}).range(charPos, charPos + 1)
								);
							}
						}

						// Add newline marker at end of line (except final line)
						if (line.to < view.state.doc.length) {
							decorations.push(
								Decoration.widget({
									widget: new NewlineWidget(),
									side: 1
								}).range(line.to)
							);
						}

						pos = line.to + 1;
					}

					return Decoration.set(decorations, true);
				}
			},
			{
				decorations: (value) => value.decorations
			}
		);

		return [whitespaceDecorator];
	}

	updateBodyClasses() {
		const { enabled, showNewline, showSingleSpace, showSpace, showTab, showTrailingSpace, showStrictLineBreak } = this.settings;
		const classList = document.body.classList;

		classList.toggle('whitespace-plugin-enabled', enabled);
		classList.toggle('whitespace-hide-newline', !showNewline);
		classList.toggle('whitespace-hide-tab', !showTab);
		classList.toggle('whitespace-hide-space', !showSpace);
		classList.toggle('whitespace-hide-single-space', !showSingleSpace);
		classList.toggle('whitespace-hide-trailing-space', !showTrailingSpace);
		classList.toggle('whitespace-show-strict-line-break', showStrictLineBreak);
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData() as Partial<WhitespacePluginSettings>);
	}

	async saveSettings() {
		await this.saveData(this.settings);
		this.updateBodyClasses();
		// Trigger editor refresh
		this.app.workspace.updateOptions();
	}
}
