import * as vscode from 'vscode'
import { intl } from 'ext-intl'
import * as fs from 'fs'
import * as path from 'path'
import * as prettier from 'prettier'

export interface IConfig {
  outputPath: string
  rootPath: string
  template: boolean
  extractOnly: boolean
  whiteList: string[]
  mode?: 'sample' | 'depth' // 模式类型 简单模式/深层次导出
  prefix?: string[]
  // 用于处理模板字符串的配置
  templateString?: {
    funcName: string
  }
}

function resolvePath(pathName: string) {
  return path.resolve(vscode.workspace.rootPath!, pathName)
}

export const INIT_CONFIG: IConfig = {
  outputPath: resolvePath('./intl'),
  rootPath: resolvePath('./src'),
  template: false,
  extractOnly: true,
  whiteList: ['.ts', '.tsx', '.js', '.jsx'],
  mode: 'depth',
  prefix: [],
  templateString: {
    funcName: 'intl.get',
  },
}

function checkConfig(dir: string = '', fileName: string) {
  return new Promise((resolve, reject) => {
    if (!dir) {
      reject('当前不存在`workspace`，请先打开工作空间后再运行')
    }
    const configPath = path.resolve(dir, fileName)
    fs.readFile(configPath, { encoding: 'utf-8' }, (err, data) => {
      if (err) {
        reject(err.message)
      }
      const config = JSON.parse(data)
      resolve(config)
    })
  })
}

function initConfig(configPath: string) {
  if (!fs.existsSync(configPath)) {
    fs.writeFileSync(
      configPath,
      prettier.format(JSON.stringify(INIT_CONFIG), { parser: 'json' })
    )
  }
}

function generateStatusBar(text: string, command: string) {
  const btn = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left)
  btn.text = text
  btn.command = command
  btn.show()
}

const CONFIG_FILE_NAME = '.extintl.json'

export function activate(context: vscode.ExtensionContext) {
  generateStatusBar('init', 'ext-intl:init')
  generateStatusBar('generate', 'ext-intl:generate')

  let disposable = vscode.commands.registerCommand('ext-intl:generate', () => {
    checkConfig(vscode.workspace.rootPath, CONFIG_FILE_NAME)
      .then((config) => {
        intl(config as any)
      })
      .catch((err) => {
        vscode.window.showErrorMessage(err)
      })
  })
  const init = vscode.commands.registerCommand('ext-intl:init', () => {
    if (!vscode.workspace.rootPath) {
      vscode.window.showErrorMessage(
        '当前不存在`workspace`，请先打开工作空间后再运行'
      )
      return
    }
    initConfig(resolvePath(CONFIG_FILE_NAME))
    vscode.window.showInformationMessage('初始化成功')
  })
  context.subscriptions.push(disposable, init)
}

// this method is called when your extension is deactivated
export function deactivate() {}
