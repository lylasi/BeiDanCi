# 北单词 - 智能化英语学习平台

[![Vite](https://img.shields.io/badge/vite-6.2.0-blue)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/react-19.0.0-blue)](https://react.dev/)
[![Ant Design](https://img.shields.io/badge/antd-5.24.3-blue)](https://ant.design/)

## 项目概述
北单词是一个基于React构建的智能化英语学习Web应用，集单词本管理与听力训练于一体。核心功能包括：

- 📚 **多维度单词本管理**  
  支持创建/编辑/导入/导出单词本，智能解析多种格式文本
- 🎧 **智能听练模式**  
  可配置播放次数、间隔时间、中英文切换的听力训练系统
- 🗣 **多语音引擎支持**  
  集成微软神经网络语音合成技术，支持多种发音模型
- ⚙ **个性化配置**  
  提供播放参数设置、语音模型选择等定制化功能
- 📝 **音标支持**  
  支持显示和导入带音标的单词，增强发音学习体验
- 💾 **本地存储**  
  用户创建的单词本自动保存到本地，刷新页面后不会丢失

## 核心功能模块
### 单词本管理模块
- 创建/编辑包含中英文对照的单词本
- 支持TXT文件导入导出（多种分隔符兼容）
- 批量操作与数据校验机制
- 默认单词本保护机制
- 用户创建的单词本优先显示在列表顶部
- 支持音标信息的导入与导出（使用@符号分隔）
- 本地存储功能，保证数据持久化

### 听力训练模块
- 可配置播放参数：
  - 🔁 单词重复次数（1-10次）
  - ⏱ 播放间隔时间（1-60秒）
  - 🔂 列表循环次数（1-99次）
- 智能播放控制：
  - ▶️ 播放/暂停/重置
  - 📶 实时进度显示
  - ⏭ 手动跳词功能
- 语音合成功能：
  - 🌐 多语言发音模型选择
  - 🎚 语音播放优先级设置
- 音标显示功能，辅助正确发音学习

## 技术栈
**前端框架**  
- React 19 + Vite 6  
- Ant Design 5 组件库  
- Axios 网络请求  

**语音合成**  
- 微软神经网络语音合成  
- Web Audio API  
- 浏览器本地缓存机制

**数据存储**
- localStorage 本地持久化存储
- 模块化单词本管理

**工程化**  
- ESLint 代码规范  
- Vite 构建优化  
- 响应式布局设计

## 快速开始
### 环境要求
- Node.js ≥18.x
- npm ≥9.x

### 安装步骤
```bash
# 克隆仓库
git clone https://github.com/your-repo/beidanci.git

# 安装依赖
cd beidanci && npm install

# 启动开发服务器
npm run dev
```

### 配置说明
1. 在`src/config/voiceModels.js`中配置语音模型参数
2. 通过环境变量设置API端点（如需连接后端服务）
3. 修改`vite.config.js`调整开发服务器配置
4. 单词本模块化配置：
   - 在`src/wordBookList/books/`目录下可添加自定义单词本文件
   - 使用`src/utils/wordBookGenerator.js`工具可批量生成单词本
5. 本地存储配置：
   - 用户数据存储在浏览器的localStorage中
   - 可通过浏览器开发工具查看和管理存储的数据

## 使用指南
### 基础操作流程
1. 创建单词本 ➡️ 导入/输入单词数据
2. 进入听练模式 ➡️ 配置播放参数
3. 开始训练 ➡️ 实时监控进度
4. 导出学习记录 ➡️ 分析学习效果

### 单词本格式说明
支持以下格式导入单词：
- `英文#中文@音标`
- `英文,中文@音标`
- `英文|中文@音标`

每行一个单词或短语，音标部分可选。例如：
```plaintext
apple#苹果@/ˈæpl/
banana,香蕉@/bəˈnɑːnə/
orange|橙子

```
### 单词本管理技巧
1. **批量导入**：准备好TXT格式的单词列表，点击"导入文件"一键导入
2. **音标添加**：在导入或编辑时使用@符号后跟音标
3. **单词本排序**：用户创建的单词本会自动显示在列表顶部
4. **数据备份**：定期导出重要单词本，防止数据丢失
5. **默认单词本**：系统预置单词本不可删除，但可以导出后修改

### 注意事项
- 首次使用建议从默认单词本开始
- 中文语音需选择zh-CN开头的语音模型
- 长时间训练建议设置间隔时间≥3秒
- 浏览器需启用AudioContext权限
- 用户创建的单词本会自动保存到浏览器本地存储
- 清除浏览器缓存可能导致自定义单词本丢失，请提前导出备份
- 单词本数据较大时，建议分批导入以提高性能


### 注意事项
- 首次使用建议从默认单词本开始
- 中文语音需选择zh-CN开头的语音模型
- 长时间训练建议设置间隔时间≥3秒
- 浏览器需启用AudioContext权限

---

## Vite原始文档结构
（保留原有Vite项目说明）

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

### 预装插件
- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md)  
  使用Babel实现快速刷新
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc)  
  使用SWC实现快速刷新（需Node.js ≥18）

### 扩展ESLint配置
当开发生产环境应用时，我们推荐：
1. 启用TypeScript支持
2. 集成[typescript-eslint](https://typescript-eslint.io)
3. 参考[Vite TS模板](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts)


## 开发者指南

### 单词本生成工具

项目提供了单词本生成工具，可以从文本文件批量生成单词本 JS 文件。

#### 工具文件说明

1. **wordBookGenerator.js**：核心工具类，位于 `src/utils/wordBookGenerator.js`
   - 提供从文本文件生成单词本的功能
   - 支持批量处理多个文本文件
   - 自动生成索引文件

2. **generateWordBooks.js**：执行脚本，位于 `scripts/generateWordBooks.js`
   - 调用 wordBookGenerator 中的方法执行批量生成
   - 简化命令行操作

#### 使用方法

1. 准备单词本文本文件，放在 `src/wordBookList` 目录下
2. 文本文件格式要求：
   - 每行一个单词条目
   - 格式为：`英文#中文@音标`
   - 可选：第一行以 `###` 开头作为单词本标题
3. 运行生成脚本：

```bash
node scripts/generateWordBooks.js
```
4. 生成的单词本文件将保存在 `src/wordBookList/books` 目录下
5. 同时会生成 `defaultWordBooks.js` 索引文件

#### 文本文件示例
```plaintext
### 四年级英语单词
apple#苹果@/ˈæpl/
banana#香蕉@/bəˈnɑːnə/
orange#橙子@/ˈɒrɪndʒ/
```

#### 自定义生成

如需自定义生成过程，可以修改 scripts/generateWordBooks.js 文件中的参数：

```javascript
import { batchGenerateWordBooks } from '../src/utils/wordBookGenerator.js';

// 参数1: 文本文件目录路径
// 参数2: 输出目录路径
batchGenerateWordBooks('./src/wordBookList', './src/wordBookList/books');
```
