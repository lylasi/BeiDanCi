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

## 核心功能模块
### 单词本管理模块
- 创建/编辑包含中英文对照的单词本
- 支持TXT文件导入导出（多种分隔符兼容）
- 批量操作与数据校验机制
- 默认单词本保护机制

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

## 技术栈
**前端框架**  
- React 19 + Vite 6  
- Ant Design 5 组件库  
- Axios 网络请求  

**语音合成**  
- 微软神经网络语音合成  
- Web Audio API  
- 浏览器本地缓存机制

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

## 使用指南
### 基础操作流程
1. 创建单词本 ➡️ 导入/输入单词数据
2. 进入听练模式 ➡️ 配置播放参数
3. 开始训练 ➡️ 实时监控进度
4. 导出学习记录 ➡️ 分析学习效果

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
