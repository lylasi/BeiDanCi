import React, { useState, useEffect } from 'react';
import { Button, Select, InputNumber, Switch, message } from 'antd';
import { PlayCircleOutlined, PauseCircleOutlined } from '@ant-design/icons';
import { voiceModels, voiceTypes } from '../config/voiceModels';
import { voiceManager } from '../utils/voiceManager';

const WordListen = ({ wordBooks }) => {
  const [selectedWordBook, setSelectedWordBook] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [playCount, setPlayCount] = useState(1);
  const [currentLoop, setCurrentLoop] = useState(0);
  const [intervalSeconds, setIntervalSeconds] = useState(2);
  const [playChineseMeaning, setPlayChineseMeaning] = useState(true);
  const [selectedVoiceModel, setSelectedVoiceModel] = useState('zh-CN-XiaoxiaoNeural');
  const [wordPlayCount, setWordPlayCount] = useState(1);
  const [currentWordPlayCount, setCurrentWordPlayCount] = useState(0);

  const playWord = async (word) => {
    try {
      const audio = await voiceManager.getVoice(selectedVoiceModel, word);
      const audioUrl = URL.createObjectURL(audio);
      const audioElement = new Audio(audioUrl);
      
      return new Promise((resolve, reject) => {
        audioElement.onended = () => {
          URL.revokeObjectURL(audioUrl);
          resolve(true);
        };
        
        audioElement.onerror = (error) => {
          URL.revokeObjectURL(audioUrl);
          console.error('播放音频失败:', error);
          message.error(`播放"${word}"失败`);
          reject(error);
        };
        
        audioElement.play().catch(reject);
      });
    } catch (error) {
      console.error('获取音频失败:', error);
      message.error(`获取"${word}"音频失败: ${error.message}`);
      return false;
    }
  };

  const playCurrentWord = async () => {
    const currentWord = getCurrentWord();
    if (!currentWord) return;
  
    try {
      // 先检查英文是否为空
      if (!currentWord.english.trim()) {
        return true;
      }
  
      // 播放英文
      const englishSuccess = await playWord(currentWord.english);
      
      // 如果英文播放成功且需要播放中文，且中文不为空，则播放中文
      if (playChineseMeaning && englishSuccess && currentWord.chinese.trim()) {
        await playWord(currentWord.chinese);
      }
  
      // 更新当前单词播放次数
      setCurrentWordPlayCount(prevCount => {
        const newCount = prevCount + 1;
        // 如果达到设定的播放次数，返回设定值（这样可以触发useEffect）
        return newCount >= wordPlayCount ? wordPlayCount : newCount;
      });
      
      // 如果当前单词播放次数达到设定值，重置计数并返回true以进入下一个单词
      return currentWordPlayCount >= wordPlayCount;
    } catch (error) {
      console.error('播放单词失败:', error);
      return false;
    }
  };

  useEffect(() => {
    let timer;
    if (isPlaying && selectedWordBook) {
      const playAndScheduleNext = async () => {
        const shouldMoveToNext = await playCurrentWord();
        if (shouldMoveToNext) {
          timer = setTimeout(() => {
            if (currentWordPlayCount >= wordPlayCount) {
              playNextWord();
            }
          }, intervalSeconds * 1000);
        }
      };
      playAndScheduleNext();
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentWordIndex, currentLoop, selectedWordBook, currentWordPlayCount]);

  const playNextWord = () => {
    if (!selectedWordBook) return;
  
    // 如果当前单词还未播放完设定次数，不进入下一个单词
    if (currentWordPlayCount < wordPlayCount) {
      return;
    }
  
    // 重置当前单词播放次数
    setCurrentWordPlayCount(0);
  
    const words = selectedWordBook.words;
    if (currentWordIndex >= words.length - 1) {
      if (currentLoop >= playCount - 1) {
        setIsPlaying(false);
        setCurrentWordIndex(0);
        setCurrentLoop(0);
        setCurrentWordPlayCount(0);
        message.success('播放完成');
        return;
      }
      setCurrentLoop(currentLoop + 1);
      setCurrentWordIndex(0);
    } else {
      setCurrentWordIndex(currentWordIndex + 1);
    }
  };

  const handlePlay = () => {
    if (!selectedWordBook) {
      message.error('请先选择单词本');
      return;
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentWordIndex(0);
    setCurrentLoop(0);
    setCurrentWordPlayCount(0);
  };

  const getCurrentWord = () => {
    if (!selectedWordBook || !selectedWordBook.words.length) return null;
    return selectedWordBook.words[currentWordIndex];
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <Select
          style={{ width: 200, marginRight: '10px' }}
          placeholder="选择单词本"
          onChange={(value) => {
            const wordBook = wordBooks.find(wb => wb.id === value);
            setSelectedWordBook(wordBook);
            handleReset();
          }}
          value={selectedWordBook?.id}
        >
          {wordBooks.map(wb => (
            <Select.Option key={wb.id} value={wb.id}>{wb.name}</Select.Option>
          ))}
        </Select>

        <Select
          style={{ width: 200, marginRight: '10px' }}
          placeholder="选择语音模型"
          value={selectedVoiceModel}
          onChange={setSelectedVoiceModel}
        >
          {voiceModels.map(model => (
            <Select.Option key={model.id} value={model.id}>{model.name}</Select.Option>
          ))}
        </Select>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <span style={{ marginRight: '10px' }}>单词播放次数：</span>
        <InputNumber
          min={1}
          value={wordPlayCount}
          onChange={setWordPlayCount}
          style={{ marginRight: '20px' }}
        />

        <span style={{ marginRight: '10px' }}>循环次数：</span>
        <InputNumber
          min={1}
          value={playCount}
          onChange={setPlayCount}
          style={{ marginRight: '20px' }}
        />

        <span style={{ marginRight: '10px' }}>间隔时间（秒）：</span>
        <InputNumber
          min={1}
          value={intervalSeconds}
          onChange={setIntervalSeconds}
          style={{ marginRight: '20px' }}
        />

        <span style={{ marginRight: '10px' }}>播放中文：</span>
        <Switch
          checked={playChineseMeaning}
          onChange={setPlayChineseMeaning}
          style={{ marginRight: '20px' }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        {isPlaying ? (
          <Button
            type="primary"
            icon={<PauseCircleOutlined />}
            onClick={handlePause}
            style={{ marginRight: '10px' }}
          >
            暂停
          </Button>
        ) : (
          <Button
            type="primary"
            icon={<PlayCircleOutlined />}
            onClick={handlePlay}
            style={{ marginRight: '10px' }}
          >
            播放
          </Button>
        )}

        <Button onClick={handleReset} style={{ marginRight: '10px' }}>
          重置
        </Button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>当前播放：</h3>
        {getCurrentWord() && (
          <div>
            <p>英文：{getCurrentWord().english}</p>
            <p>中文：{getCurrentWord().chinese}</p>
            <p>进度：{currentWordIndex + 1}/{selectedWordBook?.words.length} (第{currentLoop + 1}轮)</p>
            <p>当前单词播放次数：{currentWordPlayCount + 1}/{wordPlayCount}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WordListen;