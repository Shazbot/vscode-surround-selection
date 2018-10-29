"use strict";
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

import { window, Selection } from "vscode";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand("extension.surroundSelection", async () => {
    // The code you place here will be executed every time your command is executed

    let editor = vscode.window.activeTextEditor;
    if (!editor) {
      return; // No open text editor
    }

    let surround_with = (await window.showInputBox()) as string;

    let surround_prefix = surround_with
      .replace(")", "(")
      .replace("}", "{")
      .replace("]", "[");

    let surround_postfix = surround_with
      .replace("(", ")")
      .replace("{", "}")
      .replace("[", "]");

    let original_selection = editor.selection;

    editor
      .edit(builder => {
        builder.insert(original_selection.active, surround_postfix);
        builder.insert(original_selection.anchor, surround_prefix);
      })
      .then(function() {
        let after_edit_selection = editor!.selection;
        if (original_selection.anchor.compareTo(original_selection.active) < 0) {
          editor!.selection = new Selection(
            after_edit_selection.anchor.translate(0, 0),
            after_edit_selection.active.translate(0, -surround_postfix.length)
          );
        } else {
          editor!.selection = new Selection(
            after_edit_selection.anchor.translate(0, -surround_prefix.length),
            after_edit_selection.active.translate(0, 0)
          );
        }
      });
  });

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
