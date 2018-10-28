"use strict";
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

import { window, Position, Selection } from "vscode";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand("extension.surroundWith", async () => {
    // The code you place here will be executed every time your command is executed

    let editor = vscode.window.activeTextEditor;
    if (!editor) {
      return; // No open text editor
    }

    let surround_with = (await window.showInputBox()) as string;

    let surround_with_prefix = surround_with
      .replace(")", "(")
      .replace("}", "{")
      .replace("]", "[");

    let surround_with_postfix = surround_with
      .replace("(", ")")
      .replace("{", "}")
      .replace("[", "]");

    let selection = editor.selection;
    editor.edit(builder => {
      let original_text = editor!.document.getText(selection);
      let new_text = surround_with_prefix + original_text + surround_with_postfix;
      builder.replace(selection, new_text);
    });
  });

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
