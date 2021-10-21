const _ = require('lodash')
const { encodeBase64url } = require('../../../libs/helper')
const JSON5 = require('json5')

const escapeMd2 = str => str.replace(/[_*[()~`>#+=|{}.!\]-]/g, c => `\\${c}`)

function formatSize (size) {
  const units = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  for (let i = 0; i < units.length; i++) {
    if (size < 1024) return `${_.round(size, 2)} ${units[i]}`
    size /= 1024
  }
  return '錯誤'
}

module.exports = imgur => ({
  disable_web_page_preview: true,
  parse_mode: 'MarkdownV2',
  text: `圖片網址:
\`${imgur.link}\`

Markdown:
\`![](${imgur.link})\`

HTML:
\`<img src="${imgur.link}">\`

圖片比例: \`${imgur.width}:${imgur.height}\`,
圖片大小: ${escapeMd2(formatSize(imgur.size))}`,
  reply_markup: {
    inline_keyboard: [[
      {
        text: '上傳結果網頁',
        url: `https://taichunmin.idv.tw/pug/chatbot-imgur.html?imgur=${encodeBase64url(JSON5.stringify(imgur))}`,
      },
    ]],
  },
})
