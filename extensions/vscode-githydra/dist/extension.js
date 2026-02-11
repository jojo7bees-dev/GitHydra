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
const child_process_1 = require("child_process");
function activate(context) {
    console.log('GitHydra extension is now active!');
    const githydraProvider = new GitHydraProvider();
    vscode.window.registerTreeDataProvider('githydra-commands', githydraProvider);
    // Register Commands
    context.subscriptions.push(vscode.commands.registerCommand('githydra.openDashboard', () => {
        GitHydraDashboardPanel.createOrShow(context.extensionUri);
    }), vscode.commands.registerCommand('githydra.status', () => {
        runGitHydraCommand(['status']);
    }), vscode.commands.registerCommand('githydra.sync', () => {
        runGitHydraCommand(['sync']);
    }), vscode.commands.registerCommand('githydra.commit', async () => {
        const message = await vscode.window.showInputBox({ prompt: 'Enter commit message | أدخل رسالة الالتزام' });
        if (message) {
            runGitHydraCommand(['commit', '-m', message]);
        }
    }), vscode.commands.registerCommand('githydra.branch', () => {
        runGitHydraCommand(['branch']);
    }), vscode.commands.registerCommand('githydra.log', () => {
        runGitHydraCommand(['log', '--graph']);
    }), vscode.commands.registerCommand('githydra.statistics', () => {
        runGitHydraCommand(['statistics', 'overview']);
    }), vscode.commands.registerCommand('githydra.ai', () => {
        runGitHydraCommand(['ai', 'chat']);
    }), vscode.commands.registerCommand('githydra.web', () => {
        runGitHydraCommand(['web']);
    }), vscode.commands.registerCommand('githydra.stash', () => {
        runGitHydraCommand(['stash', 'list']);
    }), vscode.commands.registerCommand('githydra.tag', () => {
        runGitHydraCommand(['tag', 'list']);
    }), vscode.commands.registerCommand('githydra.runCustom', (args) => {
        runGitHydraCommand(args);
    }));
}
async function runGitHydraCommand(args) {
    let cwd = vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders[0].uri.fsPath : undefined;
    // Check if githydra is available
    (0, child_process_1.exec)('githydra --version', (error) => {
        const command = error ? 'python3 -m githydra' : 'githydra';
        const fullArgs = args.map(arg => `"${arg.replace(/"/g, '\\"')}"`).join(' ');
        executeInTerminal(`${command} ${fullArgs}`, cwd);
    });
}
function executeInTerminal(commandLine, cwd) {
    const terminal = vscode.window.terminals.find(t => t.name === 'GitHydra') || vscode.window.createTerminal({
        name: 'GitHydra',
        cwd: cwd
    });
    terminal.show();
    terminal.sendText(commandLine);
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
                new GitHydraItem('Repository Operations | عمليات المستودع', vscode.TreeItemCollapsibleState.Collapsed, 'repo', [
                    new GitHydraItem('Status | الحالة', vscode.TreeItemCollapsibleState.None, 'info', { command: 'githydra.status', title: 'View Status' }),
                    new GitHydraItem('Init | تهيئة', vscode.TreeItemCollapsibleState.None, 'initialize', { command: 'githydra.runCustom', title: 'Init', arguments: [['init']] }),
                    new GitHydraItem('Clone | استنساخ', vscode.TreeItemCollapsibleState.None, 'cloud-download', { command: 'githydra.runCustom', title: 'Clone', arguments: [['clone']] }),
                ]),
                new GitHydraItem('Commits & History | الالتزامات والتاريخ', vscode.TreeItemCollapsibleState.Collapsed, 'history', [
                    new GitHydraItem('Create Commit | إنشاء التزام', vscode.TreeItemCollapsibleState.None, 'git-commit', { command: 'githydra.commit', title: 'Create Commit' }),
                    new GitHydraItem('View History | عرض التاريخ', vscode.TreeItemCollapsibleState.None, 'graph', { command: 'githydra.log', title: 'View History' }),
                ]),
                new GitHydraItem('Branches | الفروع', vscode.TreeItemCollapsibleState.Collapsed, 'git-branch', [
                    new GitHydraItem('Manage Branches | إدارة الفروع', vscode.TreeItemCollapsibleState.None, 'list-unordered', { command: 'githydra.branch', title: 'Manage Branches' }),
                ]),
                new GitHydraItem('Remote & Sync | البعيد والمزامنة', vscode.TreeItemCollapsibleState.Collapsed, 'sync', [
                    new GitHydraItem('Sync (Push/Pull) | المزامنة', vscode.TreeItemCollapsibleState.None, 'refresh', { command: 'githydra.sync', title: 'Sync' }),
                    new GitHydraItem('Manage Remotes | المستودعات البعيدة', vscode.TreeItemCollapsibleState.None, 'remote', { command: 'githydra.runCustom', title: 'Remotes', arguments: [['remote', 'list']] }),
                ]),
                new GitHydraItem('Advanced Operations | عمليات متقدمة', vscode.TreeItemCollapsibleState.Collapsed, 'tools', [
                    new GitHydraItem('Stash | التخزين المؤقت', vscode.TreeItemCollapsibleState.None, 'archive', { command: 'githydra.stash', title: 'Stash' }),
                    new GitHydraItem('Tags | الوسوم', vscode.TreeItemCollapsibleState.None, 'tag', { command: 'githydra.tag', title: 'Tags' }),
                    new GitHydraItem('Reset/Revert | إعادة التعيين', vscode.TreeItemCollapsibleState.None, 'discard', { command: 'githydra.runCustom', title: 'Reset', arguments: [['reset', '--help']] }),
                ]),
                new GitHydraItem('Analysis & AI | التحليل والذكاء', vscode.TreeItemCollapsibleState.Collapsed, 'beaker', [
                    new GitHydraItem('Statistics | الإحصائيات', vscode.TreeItemCollapsibleState.None, 'graph-line', { command: 'githydra.statistics', title: 'Statistics' }),
                    new GitHydraItem('AI Tools | أدوات الذكاء', vscode.TreeItemCollapsibleState.None, 'sparkle', { command: 'githydra.ai', title: 'AI Tools' }),
                ]),
                new GitHydraItem('Advanced Tools | أدوات متقدمة', vscode.TreeItemCollapsibleState.Collapsed, 'tools', [
                    new GitHydraItem('Submodules | وحدات فرعية', vscode.TreeItemCollapsibleState.None, 'extensions', { command: 'githydra.runCustom', title: 'Submodules', arguments: [['submodule', 'status']] }),
                    new GitHydraItem('Worktrees | أشجار العمل', vscode.TreeItemCollapsibleState.None, 'folder-opened', { command: 'githydra.runCustom', title: 'Worktrees', arguments: [['worktree', 'list']] }),
                    new GitHydraItem('Conflicts | التعارضات', vscode.TreeItemCollapsibleState.None, 'warning', { command: 'githydra.runCustom', title: 'Conflicts', arguments: [['conflicts', 'list']] }),
                    new GitHydraItem('Config | التكوين', vscode.TreeItemCollapsibleState.None, 'settings-gear', { command: 'githydra.runCustom', title: 'Config', arguments: [['config', 'list']] }),
                ])
            ]);
        }
    }
}
class GitHydraItem extends vscode.TreeItem {
    constructor(label, collapsibleState, iconName, command, children) {
        super(label, collapsibleState);
        this.label = label;
        this.collapsibleState = collapsibleState;
        this.iconName = iconName;
        this.command = command;
        this.children = children;
        if (iconName) {
            this.iconPath = new vscode.ThemeIcon(iconName);
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
        :root {
            --bg-color: #1e1e1e;
            --card-bg: #2d2d2d;
            --text-color: #e0e0e0;
            --accent-color: #007acc;
            --hover-bg: #3d3d3d;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            padding: 40px;
            text-align: center;
            background-color: var(--bg-color);
            color: var(--text-color);
            margin: 0;
        }
        .container { max-width: 1000px; margin: 0 auto; }
        .logo { width: 180px; margin-bottom: 30px; filter: drop-shadow(0 0 10px rgba(0,122,204,0.3)); }
        h1 { color: var(--accent-color); font-size: 2.5em; margin-bottom: 10px; }
        .subtitle { font-size: 1.2em; opacity: 0.8; margin-bottom: 50px; }

        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 25px;
            margin-top: 20px;
        }
        .card {
            background: var(--card-bg);
            padding: 30px;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
            border: 1px solid transparent;
            display: flex;
            flex-direction: column;
            align-items: center;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .card:hover {
            transform: translateY(-5px);
            background: var(--hover-bg);
            border-color: var(--accent-color);
            box-shadow: 0 10px 20px rgba(0,0,0,0.2);
        }
        .card h3 { margin: 15px 0 10px 0; color: var(--accent-color); }
        .card p { font-size: 0.9em; opacity: 0.7; margin: 0; }

        /* Arabic Support */
        [lang="ar"] { direction: rtl; }
        [lang="ar"] body { font-family: 'Segoe UI', 'Cairo', sans-serif; }

        .footer { margin-top: 60px; font-size: 0.8em; opacity: 0.5; }
    </style>
</head>
<body lang="en">
    <div class="container">
        <img src="${logoPath}" alt="GitHydra Logo" class="logo">
        <h1>GitHydra</h1>
        <p class="subtitle">Comprehensive Git Automation with Beautiful UI</p>

        <div class="grid">
            <div class="card" onclick="runCommand('status')">
                <h3>Status | الحالة</h3>
                <p>View repository status</p>
            </div>
            <div class="card" onclick="runCommand('log')">
                <h3>History | التاريخ</h3>
                <p>View interactive git log</p>
            </div>
            <div class="card" onclick="runCommand('sync')">
                <h3>Sync | المزامنة</h3>
                <p>Push/Pull changes</p>
            </div>
            <div class="card" onclick="runCommand('statistics')">
                <h3>Stats | الإحصائيات</h3>
                <p>Repository analytics</p>
            </div>
            <div class="card" onclick="runCommand('ai')">
                <h3>AI Tools | أدوات الذكاء</h3>
                <p>Smart git assistance</p>
            </div>
            <div class="card" onclick="runCommand('web')">
                <h3>Web UI | واجهة الويب</h3>
                <p>Launch Web Dashboard</p>
            </div>
            <div class="card" onclick="runCommand('stash')">
                <h3>Stash | التخزين</h3>
                <p>Manage stashed changes</p>
            </div>
            <div class="card" onclick="runCommand('tag')">
                <h3>Tags | الوسوم</h3>
                <p>Manage repository tags</p>
            </div>
        </div>

        <div class="footer">
            Made with ❤️ by Abdulaziz Alqudimi
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