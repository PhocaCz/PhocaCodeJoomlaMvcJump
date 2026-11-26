# Phoca Joomla MVC Jump

Jump between the parts of a Joomla component with one click or one shortcut. You are in the model and want the controller, you are in a tmpl layout and want its view or model, and so on.

Four buttons appear in the editor title bar whenever the open file belongs to a component:

| Button | Target | Shortcut |
| --- | --- | --- |
| Layout icon | `tmpl/<name>/*.php` | `Ctrl+Alt+T` |
| Eye | `src/View/<Name>/HtmlView.php` | `Ctrl+Alt+V` |
| Database | `src/Model/<Name>Model.php` | `Ctrl+Alt+M` |
| Gear | `src/Controller/<Name>Controller.php` | `Ctrl+Alt+C` |

## How it works

The extension follows the standard Joomla 4/5 component structure and matches the files by name, ignoring letter case:

```
com_example/
├── tmpl/item/edit.php
├── src/View/Item/HtmlView.php
├── src/Model/ItemModel.php
└── src/Controller/ItemController.php
```

From any of these four files you can reach the other three. When the `tmpl/<name>/` folder contains more than one layout (`default.php`, `edit.php`, ...), a picker lets you choose which one to open.

List views are separate from the form views, as in Joomla itself: `Items` leads to `ItemsModel` and `ItemsController`, `Item` leads to `ItemModel` and `ItemController`.

## Usage

1. Open a file of a component, for example `administrator/components/com_example/tmpl/item/edit.php`.
2. Click one of the icons in the editor title bar, or press the shortcut.

The commands are also available from the Command Palette under **Joomla MVC**.

## Compatibility

Works with the Joomla 4/5 structure (`src/` and `tmpl/` in the component root), in both the administrator and the site part. Requires VS Code 1.80 or newer. The extension uses only the standard extension API, so it should also work in VS Code-based editors such as VSCodium.

## Links

- Source and issues: <https://github.com/PhocaCz/PhocaCodeJoomlaMvcJump>
- Phoca: <https://www.phoca.cz>

## License

Copyright (C) 2026 Jan Pavelka - Phoca

Licensed under the GNU General Public License version 2 only (GPL-2.0-only). See [LICENSE.txt](https://github.com/PhocaCz/PhocaCodeJoomlaMvcJump/blob/HEAD/LICENSE.txt).

Source: <https://github.com/PhocaCz/PhocaCodeJoomlaMvcJump>
