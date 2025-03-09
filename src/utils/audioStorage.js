// IndexedDB音频存储工具类
class AudioStorage {
  constructor() {
    this.dbName = 'audioCache';
    this.storeName = 'audioFiles';
    this.db = null;
    this.initDB();
  }

  // 初始化数据库
  async initDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onerror = () => {
        console.error('数据库打开失败');
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName);
        }
      };
    });
  }

  // 保存音频数据
  async saveAudio(key, blob) {
    if (!this.db) await this.initDB();
    console.log(`[AudioStorage] 尝试保存音频: ${key}`);
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.put(blob, key);

      request.onsuccess = () => {
        console.log(`[AudioStorage] 音频保存成功: ${key}`);
        resolve();
      };
      request.onerror = () => {
        console.error(`[AudioStorage] 音频保存失败: ${key}`, request.error);
        reject(request.error);
      };
    });
  }

  // 获取音频数据
  async getAudio(key) {
    if (!this.db) await this.initDB();
    console.log(`[AudioStorage] 尝试获取音频: ${key}`);
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(key);

      request.onsuccess = () => {
        const result = request.result;
        console.log(`[AudioStorage] 音频获取${result ? '成功' : '失败'}: ${key}`);
        resolve(result);
      };
      request.onerror = () => {
        console.error(`[AudioStorage] 音频获取失败: ${key}`, request.error);
        reject(request.error);
      };
    });
  }

  // 检查音频是否存在
  async hasAudio(key) {
    try {
      const audio = await this.getAudio(key);
      return !!audio;
    } catch {
      return false;
    }
  }

  // 删除音频数据
  async deleteAudio(key) {
    if (!this.db) await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // 清空所有音频数据
  async clearAll() {
    if (!this.db) await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

export const audioStorage = new AudioStorage();