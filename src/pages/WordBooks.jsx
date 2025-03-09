import React, { useState } from 'react';
import { Table, Button, Modal, Input, message, Upload } from 'antd';
import { UploadOutlined, DeleteOutlined, ExportOutlined } from '@ant-design/icons';

const WordBooks = ({ wordBooks, setWordBooks, onImportToListen }) => {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentWordBook, setCurrentWordBook] = useState(null);
  const [wordBookName, setWordBookName] = useState('');
  const [wordContent, setWordContent] = useState('');

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
          <Button 
            type="link" 
            danger 
            disabled={record.isDefault}
            onClick={() => handleDelete(record)}
          >
            删除
          </Button>
        </div>
      )
    }
  ];

  // 编辑单词本
  const handleEdit = (wordBook) => {
    setCurrentWordBook(wordBook);
    setWordBookName(wordBook.name);
    setWordContent(wordBook.words.map(word => `${word.english}#${word.chinese}`).join('\n'));
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
        let english = line.trim(), chinese = '';
        
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

        return { english, chinese };
      });

    try {
      if (currentWordBook) {
        // 编辑现有单词本
        const updatedWordBooks = wordBooks.map(wb =>
          wb.id === currentWordBook.id
            ? { ...wb, name: wordBookName, words }
            : wb
        );
        setWordBooks(updatedWordBooks);
      } else {
        // 创建新单词本
        const newWordBook = {
          id: Date.now().toString(),
          name: wordBookName,
          words,
          isDefault: false
        };
        setWordBooks([...wordBooks, newWordBook]);
      }

      setEditModalVisible(false);
      message.success(`${currentWordBook ? '更新' : '创建'}单词本成功`);
    } catch (error) {
      message.error(error.message);
    }
  };

  // 删除单词本
  const handleDelete = (wordBook) => {
    if (wordBook.isDefault) {
      message.error('默认单词本不能删除');
      return;
    }

    Modal.confirm({
      title: '确认删除',
      content: `确定要删除单词本「${wordBook.name}」吗？`,
      onOk: () => {
        const updatedWordBooks = wordBooks.filter(wb => wb.id !== wordBook.id);
        setWordBooks(updatedWordBooks);
        message.success('删除成功');
      }
    });
  };

  // 导出单词本
  const handleExport = (wordBook) => {
    const content = wordBook.words
      .map(word => `${word.english}#${word.chinese}`)
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
          placeholder="请输入单词列表，支持格式：\n英文#中文\n英文,中文\n英文|中文\n每行一个单词或短语"
          value={wordContent}
          onChange={e => setWordContent(e.target.value)}
          rows={10}
        />
      </Modal>
    </div>
  );
};

export default WordBooks;