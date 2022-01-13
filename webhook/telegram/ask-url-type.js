const _ = require('lodash')

const msgAskUrlType = () => ({
  disable_web_page_preview: true,
  parse_mode: 'MarkdownV2',
  text: '請問這個網址是什麼類型？',
  reply_markup: {
    inline_keyboard: [[
      {
        text: '靜態圖片',
        callback_data: 'image',
      },
      {
        text: '動態圖片',
        callback_data: 'video',
      },
    ]],
  },
})

module.exports = async (ctx, next) => {
  const { message } = ctx
  if (!message) return await next()
  try {
    ctx.url = new URL(_.trim(message.text)).href // 詢問網址是靜態還是動態
  } catch (err) {}
  if (!ctx.url) return await next()
  await ctx.replyMessage(msgAskUrlType())
}
