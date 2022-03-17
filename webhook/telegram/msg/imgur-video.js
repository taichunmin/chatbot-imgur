const { encodeBase64url } = require('../../../libs/helper')
const JSON5 = require('json5')

module.exports = imgur => ({
  disable_web_page_preview: true,
  parse_mode: 'MarkdownV2',
  text: `影片網址:
\`${imgur.link}\`
HTML:
\`<video src="${imgur.link}"></video>\``,
  reply_markup: {
    inline_keyboard: [[
      {
        text: '上傳結果網頁',
        url: `https://taichunmin.idv.tw/pug/chatbot-imgur.html?imgur=${encodeBase64url(JSON5.stringify(imgur))}`,
      },
    ]],
  },
})
