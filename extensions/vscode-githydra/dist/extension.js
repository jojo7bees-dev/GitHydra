"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
const vscode = __importStar(require("vscode"));
function activate(context) {
    console.log('GitHydra extension is now active!');
    const githydraProvider = new GitHydraProvider();
    vscode.window.registerTreeDataProvider('githydra-commands', githydraProvider);
    // Register Commands
    context.subscriptions.push(vscode.commands.registerCommand('githydra.openDashboard', () => {
        GitHydraDashboardPanel.createOrShow(context.extensionUri);
    }), vscode.commands.registerCommand('githydra.status', () => {
        runGitHydraCommand('status');
    }), vscode.commands.registerCommand('githydra.sync', () => {
        runGitHydraCommand('sync');
    }), vscode.commands.registerCommand('githydra.commit', async () => {
        const message = await vscode.window.showInputBox({ prompt: 'Enter commit message' });
        if (message) {
            runGitHydraCommand(`commit -m "${message}"`);
        }
    }), vscode.commands.registerCommand('githydra.branch', () => {
        runGitHydraCommand('branch');
    }), vscode.commands.registerCommand('githydra.log', () => {
        runGitHydraCommand('log --graph');
    }), vscode.commands.registerCommand('githydra.statistics', () => {
        runGitHydraCommand('statistics overview');
    }), vscode.commands.registerCommand('githydra.ai', () => {
        runGitHydraCommand('ai chat');
    }), vscode.commands.registerCommand('githydra.web', () => {
        runGitHydraCommand('web');
    }), vscode.commands.registerCommand('githydra.runCustom', (cmd) => {
        runGitHydraCommand(cmd);
    }));
}
function runGitHydraCommand(args) {
    let cwd = vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders[0].uri.fsPath : undefined;
    const terminal = vscode.window.terminals.find(t => t.name === 'GitHydra') || vscode.window.createTerminal({
        name: 'GitHydra',
        cwd: cwd
    });
    terminal.show();
    terminal.sendText(`githydra ${args}`);
}
class GitHydraProvider {
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
        if (element) {
            return Promise.resolve(element.children || []);
        }
        else {
            return Promise.resolve([
                new GitHydraItem('Repository Operations', vscode.TreeItemCollapsibleState.Collapsed, 'repo', [
                    new GitHydraItem('Status', vscode.TreeItemCollapsibleState.None, 'info', { command: 'githydra.status', title: 'View Status' }),
                    new GitHydraItem('Init', vscode.TreeItemCollapsibleState.None, 'initialize', { command: 'githydra.runCustom', title: 'Init', arguments: ['init'] }),
                    new GitHydraItem('Clone', vscode.TreeItemCollapsibleState.None, 'cloud-download', { command: 'githydra.runCustom', title: 'Clone', arguments: ['clone'] }),
                ]),
                new GitHydraItem('Commits & History', vscode.TreeItemCollapsibleState.Collapsed, 'history', [
                    new GitHydraItem('Create Commit', vscode.TreeItemCollapsibleState.None, 'git-commit', { command: 'githydra.commit', title: 'Create Commit' }),
                    new GitHydraItem('View History', vscode.TreeItemCollapsibleState.None, 'graph', { command: 'githydra.log', title: 'View History' }),
                ]),
                new GitHydraItem('Branches', vscode.TreeItemCollapsibleState.Collapsed, 'git-branch', [
                    new GitHydraItem('Manage Branches', vscode.TreeItemCollapsibleState.None, 'list-unordered', { command: 'githydra.branch', title: 'Manage Branches' }),
                ]),
                new GitHydraItem('Remote & Sync', vscode.TreeItemCollapsibleState.Collapsed, 'sync', [
                    new GitHydraItem('Sync (Push/Pull)', vscode.TreeItemCollapsibleState.None, 'refresh', { command: 'githydra.sync', title: 'Sync' }),
                    new GitHydraItem('Manage Remotes', vscode.TreeItemCollapsibleState.None, 'remote', { command: 'githydra.runCustom', title: 'Remotes', arguments: ['remote list'] }),
                ]),
                new GitHydraItem('Advanced Operations', vscode.TreeItemCollapsibleState.Collapsed, 'tools', [
                    new GitHydraItem('Stash', vscode.TreeItemCollapsibleState.None, 'archive', { command: 'githydra.runCustom', title: 'Stash', arguments: ['stash list'] }),
                    new GitHydraItem('Tags', vscode.TreeItemCollapsibleState.None, 'tag', { command: 'githydra.runCustom', title: 'Tags', arguments: ['tag list'] }),
                    new GitHydraItem('Reset/Revert', vscode.TreeItemCollapsibleState.None, 'discard', { command: 'githydra.runCustom', title: 'Reset', arguments: ['reset --help'] }),
                ]),
                new GitHydraItem('Analysis & AI', vscode.TreeItemCollapsibleState.Collapsed, 'beaker', [
                    new GitHydraItem('Statistics', vscode.TreeItemCollapsibleState.None, { command: 'githydra.statistics', title: 'Statistics' }),
                    new GitHydraItem('AI Tools', vscode.TreeItemCollapsibleState.None, 'sparkle', { command: 'githydra.ai', title: 'AI Tools' }),
                ]),
                new GitHydraItem('Maintenance', vscode.TreeItemCollapsibleState.Collapsed, 'settings-gear', [
                    new GitHydraItem('Archive', vscode.TreeItemCollapsibleState.None, 'file-zip', { command: 'githydra.runCustom', title: 'Archive', arguments: ['archive list'] }),
                    new GitHydraItem('Clean', vscode.TreeItemCollapsibleState.None, 'trash', { command: 'githydra.runCustom', title: 'Clean', arguments: ['clean'] }),
                ])
            ]);
        }
    }
}
class GitHydraItem extends vscode.TreeItem {
    constructor(label, collapsibleState, iconName, commandOrChildren) {
        super(label, collapsibleState);
        this.label = label;
        this.collapsibleState = collapsibleState;
        this.iconName = iconName;
        this.commandOrChildren = commandOrChildren;
        if (typeof iconName === 'string') {
            this.iconPath = new vscode.ThemeIcon(iconName);
        }
        if (commandOrChildren && !Array.isArray(commandOrChildren)) {
            this.command = commandOrChildren;
        }
        else if (Array.isArray(commandOrChildren)) {
            this.children = commandOrChildren;
        }
        // Handle the case where iconName might be the command (from old constructor signature)
        if (typeof iconName === 'object' && iconName !== null && 'command' in iconName) {
            this.command = iconName;
        }
    }
}
class GitHydraDashboardPanel {
    constructor(panel, extensionUri) {
        this._disposables = [];
        this._panel = panel;
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
        this._panel.webview.html = this._getHtmlForWebview(this._panel.webview, extensionUri);
        this._panel.webview.onDidReceiveMessage(message => {
            switch (message.command) {
                case 'run':
                    vscode.commands.executeCommand(`githydra.${message.value}`);
                    return;
            }
        }, null, this._disposables);
    }
    static createOrShow(extensionUri) {
        const column = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined;
        if (GitHydraDashboardPanel.currentPanel) {
            GitHydraDashboardPanel.currentPanel._panel.reveal(column);
            return;
        }
        const panel = vscode.window.createWebviewPanel('githydraDashboard', 'GitHydra Dashboard', column || vscode.ViewColumn.One, {
            enableScripts: true,
            localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'media')]
        });
        GitHydraDashboardPanel.currentPanel = new GitHydraDashboardPanel(panel, extensionUri);
    }
    _getHtmlForWebview(webview, extensionUri) {
        const logoPath = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'media', 'logo.png'));
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GitHydra Dashboard</title>
    <style>
        body { font-family: sans-serif; padding: 20px; text-align: center; background-color: #1e1e1e; color: white; }
        .container { max-width: 800px; margin: 0 auto; }
        img { width: 200px; margin-bottom: 20px; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 20px; margin-top: 40px; }
        .card { background: #333; padding: 20px; border-radius: 8px; cursor: pointer; transition: transform 0.2s; }
        .card:hover { transform: scale(1.05); background: #444; }
        h1 { color: #007acc; }
    </style>
</head>
<body>
    <div class="container">
        <img src="${logoPath}" alt="GitHydra Logo">
        <h1>GitHydra Dashboard</h1>
        <p>Welcome to the ultimate Git automation experience.</p>

        <div class="grid">
            <div class="card" onclick="runCommand('status')"><h3>Status</h3><p>View repo status</p></div>
            <div class="card" onclick="runCommand('log')"><h3>History</h3><p>View git log</p></div>
            <div class="card" onclick="runCommand('sync')"><h3>Sync</h3><p>Push/Pull changes</p></div>
            <div class="card" onclick="runCommand('statistics')"><h3>Stats</h3><p>Repo analytics</p></div>
            <div class="card" onclick="runCommand('ai')"><h3>AI Tools</h3><p>Smart git assistance</p></div>
            <div class="card" onclick="runCommand('web')"><h3>Web UI</h3><p>Launch Web Dashboard</p></div>
        </div>
    </div>
    <script>
        const vscode = acquireVsCodeApi();
        function runCommand(cmd) {
            vscode.postMessage({ command: 'run', value: cmd });
        }
    </script>
</body>
</html>`;
    }
    dispose() {
        GitHydraDashboardPanel.currentPanel = undefined;
        this._panel.dispose();
        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }
}
//# sourceMappingURL=extension.js.map