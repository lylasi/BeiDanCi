import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 从文本文件生成单词本 JS 文件
 * @param {string} txtFilePath 文本文件路径
 * @param {string} outputDir 输出目录
 */
function generateWordBookFromTxt(txtFilePath, outputDir) {
    // 读取文本文件
    const content = fs.readFileSync(txtFilePath, 'utf-8');
    const lines = content.split('\n').filter(line => line.trim());
    
    // 获取文件名（不含扩展名）
    const fileName = path.basename(txtFilePath, '.txt');
    
    // 解析标题（如果有）
    let title = fileName;
    if (lines[0].startsWith('###')) {
        title = lines[0].replace('###', '').trim();
        lines.shift(); // 移除标题行
    }
    
    // 解析单词
    const words = lines.map(line => {
        const parts = line.split('#');
        const phonetic = line.includes('@') ? line.split('@')[1].trim() : '';
        
        if (parts.length >= 2) {
            return {
                english: parts[0].trim(),
                chinese: parts[1].split('@')[0].trim(),
                phonetic: phonetic
            };
        }
        return null;
    }).filter(word => word !== null);
    
    // 创建单词本对象
    const wordBook = {
        id: fileName,
        name: title,
        isDefault: true,
        words
    };
    
    // 生成 JS 文件内容
    const jsContent = `export default ${JSON.stringify(wordBook, null, 4)};`;
    
    // 写入文件
    const outputPath = path.join(outputDir, `${fileName}.js`);
    fs.writeFileSync(outputPath, jsContent);
    
    console.log(`已生成单词本文件: ${outputPath}`);
}

/**
 * 批量处理文本文件
 * @param {string} txtDir 文本文件目录
 * @param {string} outputDir 输出目录
 */
function batchGenerateWordBooks(txtDir, outputDir) {
    // 确保输出目录存在
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // 读取目录中的所有 txt 文件
    const files = fs.readdirSync(txtDir)
        .filter(file => file.endsWith('.txt'));
    
    // 处理每个文件
    files.forEach(file => {
        const filePath = path.join(txtDir, file);
        generateWordBookFromTxt(filePath, outputDir);
    });
    
    // 生成索引文件
    generateIndexFile(files.map(file => path.basename(file, '.txt')), outputDir);
}

/**
 * 生成索引文件
 * @param {string[]} bookIds 单词本 ID 列表
 * @param {string} outputDir 输出目录
 */
function generateIndexFile(bookIds, outputDir) {
    // 生成导入语句，使用有效的变量名
    const imports = bookIds.map(id => {
        const safeId = `book_${id.replace(/\-/g, '_').replace(/\./g, '_')}`;
        return `import ${safeId} from './books/${id}.js';`;
    }).join('\n');
    
    // 生成导出数组
    const exports = `export const defaultWordBooks = [\n    ${bookIds.map(id => 
        `book_${id.replace(/\-/g, '_').replace(/\./g, '_')}`
    ).join(',\n    ')}\n];`;
    
    // 生成完整文件内容
    const content = `// 导入所有单词本\n${imports}\n\n// 导出所有单词本数组\n${exports}\n`;
    
    // 写入文件
    const outputPath = path.join(outputDir, '..', 'defaultWordBooks.js');
    fs.writeFileSync(outputPath, content);
    
    console.log(`已生成索引文件: ${outputPath}`);
}

// 使用示例
// batchGenerateWordBooks('./src/wordBookList', './src/wordBookList/books');

export {
    generateWordBookFromTxt,
    batchGenerateWordBooks
};