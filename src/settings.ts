import { App, PluginSettingTab, Setting } from 'obsidian';
import type ShowWhitespacePlugin from './main';

export interface WhitespacePluginSettings {
	enabled: boolean;
	showNewline: boolean;
	showTab: boolean;
	showSpace: boolean;
	showSingleSpace: boolean;
	showTrailingSpace: boolean;
	showStrictLineBreak: boolean;
}

export const DEFAULT_SETTINGS: WhitespacePluginSettings = {
	enabled: true,
	showNewline: true,
	showTab: true,
	showSpace: true,
	showSingleSpace: true,
	showTrailingSpace: true,
	showStrictLineBreak: false
};

export class WhitespaceSettingTab extends PluginSettingTab {
	plugin: ShowWhitespacePlugin;

	constructor(app: App, plugin: ShowWhitespacePlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		const { settings } = this.plugin;

		containerEl.empty();
		containerEl.classList.add('whitespace-plugin-settings');

		// Main toggle
		new Setting(containerEl)
			.setName('Enable whitespace visualization')
			.setDesc('Toggle whitespace characters display globally')
			.addToggle((toggle) =>
				toggle.setValue(settings.enabled).onChange(async (value) => {
					this.plugin.settings.enabled = value;
					await this.plugin.saveSettings();
				})
			);

		// Spaces section
		new Setting(containerEl)
			.setName('Space characters')
			.setHeading();

		new Setting(containerEl)
			.setName('Show space characters')
			.setDesc('Display middle dot (·) for space characters. Disabling this also hides single spaces.')
			.addToggle((toggle) =>
				toggle.setValue(settings.showSpace).onChange(async (value) => {
					this.plugin.settings.showSpace = value;
					// Auto-disable single space if all spaces disabled
					if (!value) {
						this.plugin.settings.showSingleSpace = false;
					}
					await this.plugin.saveSettings();
					this.display(); // Refresh to update disabled state
				})
			);

		const singleSpaceSetting = new Setting(containerEl)
			.setName('Show single space characters')
			.setDesc('Display single spaces between words (subset of space characters)')
			.addToggle((toggle) =>
				toggle.setValue(settings.showSingleSpace).onChange(async (value) => {
					this.plugin.settings.showSingleSpace = value;
					await this.plugin.saveSettings();
				})
			);

		if (!settings.showSpace) {
			singleSpaceSetting.setClass('whitespace-setting-disabled');
		}

		new Setting(containerEl)
			.setName('Show trailing spaces')
			.setDesc('Highlight spaces at the end of lines (shown in red)')
			.addToggle((toggle) =>
				toggle.setValue(settings.showTrailingSpace).onChange(async (value) => {
					this.plugin.settings.showTrailingSpace = value;
					await this.plugin.saveSettings();
				})
			);

		// Other whitespace section
		new Setting(containerEl)
			.setName('Other whitespace characters')
			.setHeading();

		new Setting(containerEl)
			.setName('Show newline characters')
			.setDesc('Display return symbol (↵) at the end of lines')
			.addToggle((toggle) =>
				toggle.setValue(settings.showNewline).onChange(async (value) => {
					this.plugin.settings.showNewline = value;
					await this.plugin.saveSettings();
				})
			);

		new Setting(containerEl)
			.setName('Show strict line breaks')
			.setDesc('Display special symbol (⏎) for Markdown strict line breaks (two spaces + newline)')
			.addToggle((toggle) =>
				toggle.setValue(settings.showStrictLineBreak).onChange(async (value) => {
					this.plugin.settings.showStrictLineBreak = value;
					await this.plugin.saveSettings();
				})
			);

		new Setting(containerEl)
			.setName('Show tab characters')
			.setDesc('Display right arrow (→) for tab characters')
			.addToggle((toggle) =>
				toggle.setValue(settings.showTab).onChange(async (value) => {
					this.plugin.settings.showTab = value;
					await this.plugin.saveSettings();
				})
			);
	}
}
