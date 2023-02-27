# Change Log

### 0.2.2

* Fixes [issue 12](https://github.com/igorjrd/vscode-cslpreview/issues/12)
* Update dependencies

### 0.2.1

New functionality: **Auto refresh preview**
* Updates automatically the preview window during document edition after a short delay (0.5 s)
* It should be activated on extension settings

## 0.2.0

New functionality additions:

* Option to choose a custom citables source JSON file
* Support to select the locale displayed in preview
* Added a status bar item showing the current locale displayed in preview
* Support to VSCode locales (currently supporting en-US and pt-BR)
* Extension configurations providing options do define default locale and citables source file

Bug fix:

* Command to refresh preview not more available after preview dispose

## 0.1.0

Initial release of CSL Preview for Visual Studio Code

Initial features:

* Support to multiple CSL preview windows linked to different text editor windows
* Bibliographic data used at preview can be from extension standard bibliographic data or an user input DOI
* Show CSL Preview, Refresh CSL Preview and Show CSL Source icons placed in text editor and preview windows as long as Command Palette