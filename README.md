# Show Whitespace Characters

An Obsidian plugin that visualizes invisible whitespace characters (spaces, tabs, newlines, and pilcrows) in the editor.

## Features

- 🔹 **Space visualization**: Display middle dots (·) for space characters
- ➡️ **Tab markers**: Show right arrows (→) for tab characters
- ↵ **Newline indicators**: Display return symbols (↵) at line ends
- ⚠️ **Trailing space detection**: Highlight trailing spaces in red
- ⏎ **Strict line break support**: Special symbol for Markdown two-space line breaks
- ⚙️ **Granular control**: Individual toggles for each whitespace type
- 🎨 **Theme compatible**: Works with light and dark themes

## Installation

### From Obsidian Community Plugins (Coming Soon)

1. Open Settings > Community Plugins
2. Search for "Show Whitespace Characters"
3. Click Install
4. Enable the plugin

### Manual Installation

1. Download `main.js`, `manifest.json`, and `styles.css` from the latest release
2. Create folder `YOUR_VAULT/.obsidian/plugins/show-whitespace-characters/`
3. Copy the three files into that folder
4. Reload Obsidian
5. Enable the plugin in Settings > Community Plugins

## Usage

### Quick Toggle

Use the command palette (Ctrl/Cmd+P) and search for:
- "Toggle whitespace visualization on/off"

### Settings

Navigate to Settings > Show Whitespace Characters to customize:

**Space Characters:**
- Toggle all space characters on/off
- Show/hide single spaces between words
- Highlight trailing spaces at line ends

**Other Whitespace:**
- Show/hide newline characters
- Enable special symbol for strict line breaks (two spaces + newline)
- Show/hide tab characters

## Whitespace Character Reference

| Character | Symbol | Description |
|-----------|--------|-------------|
| Space | · | Middle dot for regular spaces |
| Tab | → | Right arrow for tab characters |
| Newline | ↵ | Return symbol at line ends |
| Strict Break | ⏎ | Two spaces before newline (Markdown) |
| Trailing Space | · (red) | Spaces at end of lines |

## Compatibility

- **Obsidian Version**: 1.0.0+ required (CodeMirror 6)
- **Mobile**: Fully supported on iOS and Android
- **Modes**: Works in both Source and Live Preview modes

## Development

Built with:
- TypeScript
- CodeMirror 6 ViewPlugin API
- Obsidian Plugin API
- esbuild

## License

MIT License - see LICENSE file for details

## Support

Report issues or request features at: https://github.com/aikruger/show-whitespace-characters/issues

