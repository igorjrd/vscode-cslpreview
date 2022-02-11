# CSL Preview for Visual Studio Code

A [Visual Studio Code](https://code.visualstudio.com/) extension that permits to easily check previews of how [Citation Style Language](https://citationstyles.org/) (CSL) code is structuring bibliographic data. It is strongly based in [Zotero](https://www.zotero.org/) preview, available at Zotero style code editor.

## Install method

**Install package tool**

```
npm install -g vsce
```

**Package vsix file**

```
npm install
vsce package
```

**Install in vscode**

1. from VSCode's main menu, select “Extensions”
2. click to open the three-dot menu at the top of the middle panel (see screenshot above)
3. select “Install from VSIX…” and follow the prompts.

## Features

### Show CSL Preview

**Show CSL Preview** command can be fired by Visual Studio Code Command Palette or pressing the icon placed in the right top of text editor. Once the command is run, the user should select which bibliographic data will be used at CSL Preview and then the preview window will be shown at right side of the active text editor.

![Show CSL Preview demo](media/cslpreview-ex1.gif)

Bibliographic data from standard extension data or from an user input DOI.

If the entried CSL code presents errors that turn it inappropriate to structure bibliographic data, an [CSL-validator](https://simonster.github.io/csl-validator.js/) output informing errors in the CSL code will be shown at the preview window.

When this command is fired with a text editor which already has an preview window it will turn the preview window active.

Please, notice that **Show CSL Command** is just available when editor language is set to XML. When a .csl file is open, the editor language is automatically changed to XML.

### Refresh CSL Preview

The CSL preview is not live time updated during code editing. However the preview can be quickly refreshed using the **Refresh CSL Preview** command, present in command palette, preview windows and text editor windows (when the active text editor has an active preview window).

![Refresh CSL Preview demo](media/cslpreview-ex2.gif)

## Known Issues

There is no know issues at the moment. If you experience trobles when using the extension, please report it on extension GitHub repository.

## Release Notes

### 1.0

- Support Chinese Styles
- Support customized local JSON Data
- Refresh automatically after json update and style update

### 0.1.0

Initial release of CSL Preview for Visual Studio Code

Initial features:

- Support to multiple CSL preview windows linked to different text editor windows
- Bibliographic data used at preview can be from extension standard bibliographic data or an user input DOI
- Show CSL Preview, Refresh CSL Preview and Show CSL Source icons placed in text editor and preview windows and also in Command Palette

**Enjoy!**
