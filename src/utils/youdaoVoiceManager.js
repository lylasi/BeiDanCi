class YoudaoVoiceManager {
  constructor() {
    this.baseUrl = 'http://dict.youdao.com/dictvoice';
  }

  // 获取英音音频URL
  getBritishVoiceUrl(word) {
    return `${this.baseUrl}?type=1&audio=${encodeURIComponent(word)}`;
  }

  // 获取美音音频URL
  getAmericanVoiceUrl(word) {
    return `${this.baseUrl}?type=0&audio=${encodeURIComponent(word)}`;
  }

  // 播放音频
  async playVoice(url) {
    try {
      const audio = new Audio(url);
      await audio.play();
      return new Promise((resolve) => {
        audio.onended = () => resolve(true);
        audio.onerror = () => {
          console.error('播放音频失败:', url);
          resolve(false);
        };
      });
    } catch (error) {
      console.error('播放音频失败:', error);
      return false;
    }
  }

  // 播放英音
  async playBritishVoice(word) {
    const url = this.getBritishVoiceUrl(word);
    return await this.playVoice(url);
  }

  // 播放美音
  async playAmericanVoice(word) {
    const url = this.getAmericanVoiceUrl(word);
    return await this.playVoice(url);
  }
}

export const youdaoVoiceManager = new YoudaoVoiceManager();