const _ = require('lodash')
const { ImgurClient } = require('imgur')

exports.headersMiddleware = async (ctx, next) => {
  ctx.imgurClientId = _.get(ctx, 'req.query.imgurClientId', '2905383047408e6')
  ctx.imgurClient = new ImgurClient({ clientId: ctx.imgurClientId })
  return await next()
}

exports.uploadImageByStream = async ctx => {
  const response = await ctx.imgurClient.upload({
    image: ctx.image,
    type: 'stream',
  })
  return {
    clientId: ctx.imgurClientId,
    ...response?.data,
  }
}

exports.uploadImageByUrl = async ctx => {
  try {
    if (/\.webp$/.test(ctx.imageUrl)) throw new Error('Imgur 不支援 webp 圖片')
    const response = await ctx.imgurClient.upload({
      image: ctx.imageUrl,
    })
    return {
      clientId: ctx.imgurClientId,
      ...response?.data,
    }
  } catch (err) {
    _.set(err, 'data.imageUrl', ctx.imageUrl.replace(/bot\d+:[^/]+/g, '***'))
    throw err
  }
}

exports.uploadVideoByStream = async ctx => {
  const response = await ctx.imgurClient.upload({
    image: ctx.video,
    type: 'stream',
  })
  return {
    clientId: ctx.imgurClientId,
    ...response?.data,
  }
}
