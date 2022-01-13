/**
 * @see https://apidocs.imgur.com/
 */
const axios = require('axios')
const _ = require('lodash')
const Imgur = require('../../libs/imgur')
const msgImgur = require('./msg/imgur')

const MAX_FILESIZE = 200 * 1024 * 1024 // 200 MB

async function getFileDownloadStream (url) {
  return _.get(await axios.get(url, {
    responseType: 'stream',
    transformResponse: [],
  }), 'data')
}

module.exports = async (ctx, next) => {
  const { message, telegram, update } = ctx
  const callback = update?.callback_query
  if (callback) { // callback
    if (callback?.data !== 'video') return await next()
    ctx.videoUrl = new URL(message?.reply_to_message?.text).href
  } else { // upload
    if (!(message?.sticker?.is_animated ?? true)) return await next() // is_animated is null or true
    ctx.videoObj = message.sticker ?? message?.animation ?? message?.video
    if (!ctx.videoObj) return await next()
    if (ctx.videoObj.file_size > MAX_FILESIZE) return await next()
    ctx.videoUrl = await telegram.getFileDownloadLink(ctx.videoObj.file_id)
  }

  if (!ctx.videoUrl) return await next()
  await ctx.sendChatAction({ action: 'upload_video' }) // 顯示正在上傳影片
  ctx.video = await getFileDownloadStream(ctx.videoUrl)
  ctx.imgur = await Imgur.uploadVideoByStream(ctx)
  delete ctx.video
  const msg = msgImgur(ctx.imgur)
  if (!callback) return await ctx.replyMessage(msg) // upload
  await telegram.editMessageText({ // callback
    chat_id: message?.chat?.id,
    message_id: message?.message_id, // callback 是 message_id
    ...msg,
  })
}
