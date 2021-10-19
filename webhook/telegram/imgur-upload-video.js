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
  const { telegram, update } = ctx
  const message = update?.message ?? update?.edited_message
  ctx.videoObj = message?.animation ?? message?.video
  if (!ctx.videoObj) return await next()
  if (ctx.videoObj.file_size > MAX_FILESIZE) return await next()
  const link = await telegram.getFileDownloadLink(ctx.videoObj.file_id)
  ctx.video = await getFileDownloadStream(link)
  ctx.imgur = await Imgur.uploadVideoByStream(ctx)
  delete ctx.video
  await ctx.replyMessage(msgImgur(ctx.imgur))
}
