/**
 * Phoca Joomla MVC Jump
 * One-click navigation between the view, model, controller and tmpl layout
 * of a Joomla 4/5 component.
 *
 * Copyright (C) 2026 Jan Pavelka - Phoca
 * https://github.com/PhocaCz/PhocaCodeJoomlaMvcJump
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 2 only,
 * as published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * SPDX-License-Identifier: GPL-2.0-only
 */
const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

/**
 * Recognized file locations inside a component (com_*).
 * The captured name is compared case-insensitively.
 */
const PATTERNS = [
  /^(.*\/com_[^/]+)\/tmpl\/([^/]+)\/[^/]+\.php$/,
  /^(.*\/com_[^/]+)\/src\/View\/([^/]+)\/[^/]+\.php$/,
  /^(.*\/com_[^/]+)\/src\/Model\/([^/]+?)Model\.php$/,
  /^(.*\/com_[^/]+)\/src\/Controller\/([^/]+?)Controller\.php$/
];

/**
 * Finds the component root and the view name for the given file.
 * @param {string} file
 * @returns {{root: string, name: string}|null}
 */
function parse(file) {
  const p = file.replace(/\\/g, '/');
  for (const re of PATTERNS) {
    const m = p.match(re);
    if (m) {
      return { root: m[1], name: m[2].toLowerCase() };
    }
  }
  return null;
}

function list(dir) {
  try {
    return fs.readdirSync(dir);
  } catch (e) {
    return [];
  }
}

/**
 * Returns all existing files of the requested kind.
 * @param {'view'|'model'|'controller'|'tmpl'} kind
 * @param {{root: string, name: string}} info
 * @returns {string[]}
 */
function targets(kind, info) {
  const { root, name } = info;

  switch (kind) {
    case 'view':
      return list(path.join(root, 'src', 'View'))
        .filter((d) => d.toLowerCase() === name)
        .map((d) => path.join(root, 'src', 'View', d, 'HtmlView.php'));

    case 'model':
      return list(path.join(root, 'src', 'Model'))
        .filter((f) => f.toLowerCase() === name + 'model.php')
        .map((f) => path.join(root, 'src', 'Model', f));

    case 'controller':
      return list(path.join(root, 'src', 'Controller'))
        .filter((f) => f.toLowerCase() === name + 'controller.php')
        .map((f) => path.join(root, 'src', 'Controller', f));

    case 'tmpl':
      return list(path.join(root, 'tmpl'))
        .filter((d) => d.toLowerCase() === name)
        .flatMap((d) =>
          list(path.join(root, 'tmpl', d))
            .filter((f) => f.endsWith('.php'))
            .map((f) => path.join(root, 'tmpl', d, f))
        );
  }

  return [];
}

/**
 * Opens the requested file; asks which one if there are several (tmpl).
 * @param {'view'|'model'|'controller'|'tmpl'} kind
 */
async function jump(kind) {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }

  const current = editor.document.uri.fsPath;
  const info = parse(current);
  if (!info) {
    vscode.window.showWarningMessage(
      'Joomla MVC: the file is not part of a component (com_*/tmpl or com_*/src/View|Model|Controller).'
    );
    return;
  }

  const files = targets(kind, info).filter((f) => fs.existsSync(f));
  if (!files.length) {
    vscode.window.showWarningMessage('Joomla MVC: no ' + kind + ' found for "' + info.name + '".');
    return;
  }

  let file = files[0];
  if (files.length > 1) {
    const items = files.map((f) => ({
      label: path.basename(f),
      description: path.relative(info.root, path.dirname(f)),
      file: f
    }));
    const pick = await vscode.window.showQuickPick(items, { placeHolder: 'Select file' });
    if (!pick) {
      return;
    }
    file = pick.file;
  }

  const doc = await vscode.workspace.openTextDocument(vscode.Uri.file(file));
  await vscode.window.showTextDocument(doc, { preview: false });
}

function activate(context) {
  for (const kind of ['view', 'model', 'controller', 'tmpl']) {
    context.subscriptions.push(
      vscode.commands.registerCommand('joomlaMvc.' + kind, () => jump(kind))
    );
  }
}

function deactivate() {}

module.exports = { activate, deactivate };
