import { voiceModels } from '../config/voiceModels';
import { audioStorage } from './audioStorage';

class VoiceManager {
  constructor() {
    this.baseUrl = 'https://fast-horse-44.deno.dev/v1/audio/speech';
    this.headers = {
      'accept': '*/*',
      'accept-language': 'zh-CN,zh;q=0.9',
      'sec-ch-ua': '"Chromium";v="133", "Not(A:Brand";v="99"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"macOS"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'cross-site'
    };
  }

  // 生成语音文件的唯一键
  generateKey(model, word) {
    return `${model}_${word}`;
  }

  // 获取语音文件，优先从缓存读取
  async getVoice(model, word) {
    const key = this.generateKey(model, word);
    try {
      // 检查缓存
      const cachedAudio = await audioStorage.getAudio(key);
      if (cachedAudio) {
        console.log(`[VoiceManager] 从缓存获取语音: ${key}`);
        return cachedAudio;
      }

      // 从API获取
      console.log(`[VoiceManager] 从API获取语音: ${key}`);
      const audio = await this.fetchVoice(model, word);
      // 保存到缓存
      await audioStorage.saveAudio(key, audio);
      return audio;
    } catch (error) {
      console.error(`[VoiceManager] 获取语音失败: ${key}`, error);
      throw new Error(`获取语音失败: ${error.message}`);
    }
  }

  // 从API获取语音文件
  async fetchVoice(model, word) {
    const url = `${this.baseUrl}?model=${model}&input=${encodeURIComponent(word)}&voice=rate:0.00|pitch:0.00`;
    try {
      const response = await fetch(url, {
        headers: this.headers,
        method: 'GET',
        mode: 'cors',
        credentials: 'omit'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.blob();
    } catch (error) {
      throw new Error(`API请求失败: ${error.message}`);
    }
  }

  // 预加载单词列表的语音
  async preloadVoices(words, model) {
    console.log(`[VoiceManager] 开始预加载语音，单词数: ${words.length}`);
    const results = [];
    
    for (const word of words) {
      try {
        await this.getVoice(model, word);
        results.push({ word, success: true });
      } catch (error) {
        results.push({ word, success: false, error: error.message });
      }
    }

    const failures = results.filter(r => !r.success);
    if (failures.length > 0) {
      console.warn(`[VoiceManager] 部分语音加载失败:`, failures);
    }

    return results;
  }
}

export const voiceManager = new VoiceManager();