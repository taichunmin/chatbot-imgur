/**
 * @see https://apidocs.imgur.com/
 */
const _ = require('lodash')
const Imgur = require('../../libs/imgur')
const msgImgur = require('./msg/imgur')

module.exports = async (ctx, next) => {
  if (_.get(ctx, 'event.message.type') !== 'image') return await next()
  const { line, event } = ctx

  const contentProvider = _.get(event, 'message.contentProvider.type')
  if (contentProvider === 'line') {
    ctx.image = await line.getMessageContent(_.get(event, 'message.id'))
    ctx.imgur = await Imgur.uploadByStream(ctx)
  } else {
    ctx.image = _.get(event, 'message.contentProvider.originalContentUrl')
    ctx.imgur = await Imgur.uploadByUrl(ctx)
  }
  delete ctx.image
  await ctx.replyMessage(msgImgur(ctx.imgur))
}
