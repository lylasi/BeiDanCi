我要设计一个网站，用来背单词，单词列表可以由我自己输入，由英文单词或者短语加上中文意思，每行一个，单词可以循环播放

- 要求可以播放单词和短语

- 可以选择是否播放中文意思

- 可设置循环播放几次

- 可设置播放完停几秒

- 按单词列表循环播放列表

- 可选择英音或者美音

- 可以输入单词列表开始，或者导入单词列表（txt,md，doc格式等）
  
- 请求api来生成语音文件，api只能修改input的内容，不能修改其他内容，如下

fetch("https://fast-horse-44.deno.dev/v1/audio/speech?model=zh-HK-HiuMaanNeural&input=play%20with%20%E7%82%B3%E5%AE%8F&voice=rate%3A-0.43%7Cpitch%3A-0.01", {
  "headers": {
    "accept": "*/*",
    "accept-language": "zh-CN,zh;q=0.9",
    "priority": "u=1, i",
    "sec-ch-ua": "\"Chromium\";v=\"133\", \"Not(A:Brand\";v=\"99\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"macOS\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "cross-site",
    "Referer": "https://video.happyapi.me/",
    "Referrer-Policy": "strict-origin-when-cross-origin"
  },
  "body": null,
  "method": "GET"
});

-导入单词后，先通过api生成音频，音频保存到本地文件夹里面，播放的时候调用本地音频播放