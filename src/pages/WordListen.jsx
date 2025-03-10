import React, { useState, useEffect } from 'react';
import { Button, Select, InputNumber, Switch, message } from 'antd';
import { PlayCircleOutlined, PauseCircleOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
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
  const [touchStart, setTouchStart] = useState(null);
  const [currentAudio, setCurrentAudio] = useState(null);

  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (!touchStart) return;
    
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    // 滑动距离大于50px时触发切换
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // 向左滑动，下一个单词
        handleChangeWord(1);
      } else {
        // 向右滑动，上一个单词
        handleChangeWord(-1);
      }
    }
    setTouchStart(null);
  };

  const handleChangeWord = (direction) => {
    if (!selectedWordBook) return;
    
    // 停止当前播放的音频
    if (currentAudio) {
      currentAudio.pause();
      URL.revokeObjectURL(currentAudio.src);
      setCurrentAudio(null);
    }
    
    const words = selectedWordBook.words;
    let newIndex = currentWordIndex + direction;
    
    // 循环切换
    if (newIndex < 0) {
      newIndex = words.length - 1;
    } else if (newIndex >= words.length) {
      newIndex = 0;
    }
    
    // 重置播放状态并立即开始新单词的播放
    setCurrentWordIndex(newIndex);
    setCurrentWordPlayCount(0);
    setIsPlaying(true); // 设置为播放状态，触发 useEffect 开始播放
  };

  const playWord = async (word) => {
    try {
      // 如果有正在播放的音频，先停止它
      if (currentAudio) {
        currentAudio.pause();
        URL.revokeObjectURL(currentAudio.src);
        setCurrentAudio(null);
      }

      const audio = await voiceManager.getVoice(selectedVoiceModel, word);
      const audioUrl = URL.createObjectURL(audio);
      const audioElement = new Audio(audioUrl);
      setCurrentAudio(audioElement);
      
      return new Promise((resolve, reject) => {
        audioElement.onended = () => {
          URL.revokeObjectURL(audioUrl);
          setCurrentAudio(null);
          resolve(true);
        };
        
        audioElement.onerror = (error) => {
          URL.revokeObjectURL(audioUrl);
          setCurrentAudio(null);
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
      if (!currentWord.english.trim()) {
        return true;
      }
  
      const englishSuccess = await playWord(currentWord.english);
      
      if (playChineseMeaning && englishSuccess && currentWord.chinese.trim()) {
        await playWord(currentWord.chinese);
      }
      
      return true; // 播放成功
    } catch (error) {
      console.error('播放单词失败:', error);
      return false;
    }
};

useEffect(() => {
    let timer;
    let isMounted = true; // 添加组件挂载状态标记

    if (isPlaying && selectedWordBook) {
      const playAndScheduleNext = async () => {
        if (!isMounted) return;

        const playSuccess = await playCurrentWord();
        
        if (!isMounted) return;
        
        if (playSuccess) {
          const nextCount = currentWordPlayCount + 1;
          
          if (nextCount >= wordPlayCount) {
            timer = setTimeout(() => {
              if (!isMounted) return;
              setCurrentWordPlayCount(0);
              playNextWord();
            }, intervalSeconds * 1000);
          } else {
            setCurrentWordPlayCount(nextCount);
            timer = setTimeout(playAndScheduleNext, intervalSeconds * 1000);
          }
        }
      };
      
      playAndScheduleNext();
    }
    
    return () => {
      isMounted = false;
      if (timer) {
        clearTimeout(timer);
      }
    };
}, [isPlaying, currentWordIndex, currentLoop, selectedWordBook, currentWordPlayCount, wordPlayCount]);

const playNextWord = () => {
    if (!selectedWordBook) return;
    
    console.log('切换到下一个单词');
    const words = selectedWordBook.words;
    
    if (currentWordIndex >= words.length - 1) {
      if (currentLoop >= playCount - 1) {
        console.log('播放完成所有循环');
        setIsPlaying(false);
        setCurrentWordIndex(0);
        setCurrentLoop(0);
        message.success('播放完成');
        return;
      }
      console.log('开始新的循环');
      setCurrentLoop(currentLoop + 1);
      setCurrentWordIndex(0);
    } else {
      console.log('移动到下一个单词');
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
          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            style={{ 
              position: 'relative',
              padding: '20px',
              border: '1px solid #e8e8e8',
              borderRadius: '4px',
              touchAction: 'pan-y pinch-zoom',
              backgroundColor: '#f0f8ff', // 添加背景色
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // 添加阴影
              transition: 'transform 0.2s', // 添加过渡效果
              ':hover': {
                transform: 'scale(1.05)' // 鼠标悬停时放大
              }
            }}
          >
            <Button 
              icon={<LeftOutlined />}
              style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)' }}
              onClick={() => handleChangeWord(-1)}
            />
            <div style={{ margin: '0 40px', textAlign: 'center' }}>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>{getCurrentWord().english}</p>
              <p style={{ fontSize: '20px', color: '#666' }}>{getCurrentWord().chinese}</p>
              <p>进度：{currentWordIndex + 1}/{selectedWordBook?.words.length} (第{currentLoop + 1}轮)</p>
              <p>当前单词播放次数：{currentWordPlayCount + 1}/{wordPlayCount}</p>
            </div>
            <Button 
              icon={<RightOutlined />}
              style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)' }}
              onClick={() => handleChangeWord(1)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default WordListen;