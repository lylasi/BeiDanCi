import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Input, message, Upload, Popconfirm } from 'antd';
import { UploadOutlined, DeleteOutlined, ExportOutlined } from '@ant-design/icons';

const WordBooks = ({ wordBooks, setWordBooks, onImportToListen }) => {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentWordBook, setCurrentWordBook] = useState(null);
  const [wordBookName, setWordBookName] = useState('');
  const [wordContent, setWordContent] = useState('');

  // 初始化时从 localStorage 加载用户自定义单词本
  useEffect(() => {
    const savedWordBooks = localStorage.getItem('userWordBooks');
    if (savedWordBooks) {
      try {
        const userWordBooks = JSON.parse(savedWordBooks);
        // 合并默认单词本和用户单词本，避免重复
        const defaultIds = wordBooks.filter(wb => wb.isDefault).map(wb => wb.id);
        const filteredUserBooks = userWordBooks.filter(wb => !defaultIds.includes(wb.id));
        
        // 修改这里：将用户单词本放在前面，默认单词本放在后面
        setWordBooks([...filteredUserBooks, ...wordBooks.filter(wb => wb.isDefault)]);
      } catch (error) {
        console.error('加载保存的单词本失败:', error);
      }
    }
  }, []);

  // 保存单词本到 localStorage
  const saveToLocalStorage = (updatedWordBooks) => {
    try {
      // 只保存用户自定义的单词本
      const userWordBooks = updatedWordBooks.filter(wb => !wb.isDefault);
      localStorage.setItem('userWordBooks', JSON.stringify(userWordBooks));
    } catch (error) {
      console.error('保存单词本到本地存储失败:', error);
    }
  };

  // 表格列定义
  const columns = [
    {
      title: '单词本名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '单词数量',
      dataIndex: 'words',
      key: 'count',
      render: words => words.length
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <div>
          <Button type="link" onClick={() => handleEdit(record)}>编辑</Button>
          <Button type="link" onClick={() => handleExport(record)}>导出</Button>
          <Popconfirm
            title="确认删除"
            description={`确定要删除单词本「${record.name}」吗？`}
            // Popconfirm 中的删除操作也需要保持排序
            // 在 columns 定义中修改 onConfirm 回调
            // 修改第 53-55 行左右的代码
            onConfirm={() => {
              const userBooks = wordBooks.filter(wb => !wb.isDefault && wb.id !== record.id);
              const defaultBooks = wordBooks.filter(wb => wb.isDefault);
              const updatedWordBooks = [...userBooks, ...defaultBooks];
              setWordBooks(updatedWordBooks);
              saveToLocalStorage(updatedWordBooks);
              message.success('删除成功');
            }}
            okText="确定"
            cancelText="取消"
            disabled={record.isDefault}
          >
            <Button 
              type="link" 
              danger 
              disabled={record.isDefault}
            >
              删除
            </Button>
          </Popconfirm>
        </div>
      )
    }
  ];

  // 编辑单词本
  const handleEdit = (wordBook) => {
    setCurrentWordBook(wordBook);
    setWordBookName(wordBook.name);
    setWordContent(wordBook.words.map(word => {
      let line = `${word.english}#${word.chinese}`;
      if (word.phonetic) {
        line += `@${word.phonetic}`;
      }
      return line;
    }).join('\n'));
    setEditModalVisible(true);
  };

  // 创建新单词本
  const handleCreate = () => {
    setCurrentWordBook(null);
    setWordBookName('');
    setWordContent('');
    setEditModalVisible(true);
  };

  // 保存单词本
  const handleSave = () => {
    if (!wordBookName.trim()) {
      message.error('请输入单词本名称');
      return;
    }

    const words = wordContent.split('\n')
      .filter(line => line.trim())
      .map(line => {
        // 支持多种分隔符：#、,、|
        const separators = ['#', ',', '|'];
        let english = line.trim(), chinese = '', phonetic = '';
        
        // 检查是否有音标部分 (使用 @ 分隔)
        if (line.includes('@')) {
          const parts = line.split('@');
          line = parts[0]; // 取前半部分继续处理
          phonetic = parts[1].trim(); // 获取音标部分
        }
        
        for (const separator of separators) {
          if (line.includes(separator)) {
            const parts = line.split(separator).map(s => s.trim());
            if (parts.length >= 2 && parts[0] && parts[1]) {
              english = parts[0];
              chinese = parts[1];
              break;
            }
          }
        }

        return { english, chinese, phonetic };
      });

    try {
      let updatedWordBooks;
      
      if (currentWordBook) {
        // 编辑现有单词本
        updatedWordBooks = wordBooks.map(wb =>
          wb.id === currentWordBook.id
            ? { ...wb, name: wordBookName, words }
            : wb
        );
      } else {
        // 创建新单词本
        const newWordBook = {
          id: Date.now().toString(),
          name: wordBookName,
          words,
          isDefault: false
        };
        // 修改这里：将新单词本添加到列表前面
        const userBooks = wordBooks.filter(wb => !wb.isDefault);
        const defaultBooks = wordBooks.filter(wb => wb.isDefault);
        updatedWordBooks = [newWordBook, ...userBooks, ...defaultBooks];
      }
      
      setWordBooks(updatedWordBooks);
      saveToLocalStorage(updatedWordBooks); // 保存到 localStorage
      
      setEditModalVisible(false);
      message.success(`${currentWordBook ? '更新' : '创建'}单词本成功`);
    } catch (error) {
      message.error(error.message);
    }
  };

  // 导出单词本
  const handleExport = (wordBook) => {
    const content = wordBook.words
      .map(word => {
        let line = `${word.english}#${word.chinese}`;
        if (word.phonetic) {
          line += `@${word.phonetic}`;
        }
        return line;
      })
      .join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${wordBook.name}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 导入文件
  const handleFileUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setWordContent(e.target.result);
    };
    reader.readAsText(file);
    return false;
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <Button type="primary" onClick={handleCreate} style={{ marginRight: '10px' }}>
          新建单词本
        </Button>
      </div>

      <Table 
        columns={columns} 
        dataSource={wordBooks}
        rowKey="id"
      />

      <Modal
        title={currentWordBook ? '编辑单词本' : '新建单词本'}
        open={editModalVisible}
        onOk={handleSave}
        onCancel={() => setEditModalVisible(false)}
        width={800}
      >
        <div style={{ marginBottom: '16px' }}>
          <Input
            placeholder="单词本名称"
            value={wordBookName}
            onChange={e => setWordBookName(e.target.value)}
            style={{ marginBottom: '16px' }}
          />
          <Upload
            beforeUpload={handleFileUpload}
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />}>导入文件</Button>
          </Upload>
        </div>
        <Input.TextArea
          placeholder="请输入单词列表，支持格式：\n英文#中文@音标\n英文,中文@音标\n英文|中文@音标\n每行一个单词或短语"
          value={wordContent}
          onChange={e => setWordContent(e.target.value)}
          rows={10}
        />
      </Modal>
    </div>
  );
};

export default WordBooks;