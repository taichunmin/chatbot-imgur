/**
 * @see https://apidocs.imgur.com/
 */
const _ = require('lodash')
const Imgur = require('../../libs/imgur')
const msgImgur = require('./msg/imgur')

const MAX_FILESIZE = 10 * 1024 * 1024 // 10 MB

module.exports = async (ctx, next) => {
  const { message, telegram, update } = ctx
  const callback = update?.callback_query
  if (callback) { // callback
    if (callback?.data !== 'image') return await next()
    ctx.imageUrl = new URL(message?.reply_to_message?.text).href
  } else { // upload
    if (message?.sticker?.is_animated) return await next() // is_animated is null or false
    if (message.sticker) ctx.imageObj = message.sticker
    if (message?.photo) ctx.imageObj = _.maxBy(message?.photo, 'file_size')
    if (_.startsWith(message?.document?.mime_type, 'image/')) ctx.imageObj = message?.document
    if (!ctx.imageObj) return await next()
    if (ctx.imageObj.file_size > MAX_FILESIZE) return await next()
    ctx.imageUrl = await telegram.getFileDownloadLink(ctx.imageObj.file_id)
  }

  if (!ctx.imageUrl) return await next()
  await ctx.sendChatAction({ action: 'upload_photo' }) // 顯示正在上傳照片
  ctx.imgur = await Imgur.uploadImageByUrl(ctx)
  const msg = msgImgur(ctx.imgur)

  if (!callback) return await ctx.replyMessage(msg) // upload
  await telegram.editMessageText({ // callback
    chat_id: message?.chat?.id,
    message_id: message?.message_id, // callback 是 message_id
    ...msg,
  })
}
