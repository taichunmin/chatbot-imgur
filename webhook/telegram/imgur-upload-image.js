/**
 * @see https://apidocs.imgur.com/
 */
const _ = require('lodash')
const Imgur = require('../../libs/imgur')
const msgImgur = require('./msg/imgur')

const MAX_FILESIZE = 10 * 1024 * 1024 // 10 MB

module.exports = async (ctx, next) => {
  const { telegram, update } = ctx
  const message = update?.message ?? update?.edited_message
  if (message?.photo) ctx.imageObj = _.maxBy(message?.photo, 'file_size')
  if (_.startsWith(message?.document?.mime_type, 'image/')) ctx.imageObj = message?.document
  if (!ctx.imageObj) return await next()
  if (ctx.imageObj.file_size > MAX_FILESIZE) return await next()
  ctx.image = await telegram.getFileDownloadLink(ctx.imageObj.file_id)
  ctx.imgur = await Imgur.uploadImageByUrl(ctx)
  delete ctx.image
  await ctx.replyMessage(msgImgur(ctx.imgur))
}
