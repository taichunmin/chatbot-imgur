const _ = require('lodash')
const axios = require('axios')
const FormData = require('form-data')

const IMGUR_BASEURL = 'https://api.imgur.com/3/'

exports.headersMiddleware = async (ctx, next) => {
  ctx.imgurHeaders = {
    Authorization: `Client-ID ${_.get(ctx, 'req.query.imgurClientId', '2905383047408e6')}`,
  }
  return await next()
}

exports.uploadImageByStream = async ctx => {
  const formData = new FormData()
  formData.append('image', ctx.image)
  formData.append('type', 'file')
  return _.get(await axios.post(`${IMGUR_BASEURL}upload`, formData, {
    headers: {
      ...ctx.imgurHeaders,
      ...formData.getHeaders(),
    },
  }), 'data.data')
}

exports.uploadImageByUrl = async ctx => {
  try {
    const formData = new FormData()
    formData.append('image', ctx.image)
    formData.append('type', 'url')
    return _.get(await axios.post(`${IMGUR_BASEURL}upload`, formData, {
      headers: {
        ...ctx.imgurHeaders,
        ...formData.getHeaders(),
      },
    }), 'data.data')
  } catch (err) {
    _.set(err, 'data.imageUrl', ctx.image)
    throw err
  }
}

exports.uploadVideoByStream = async ctx => {
  const formData = new FormData()
  formData.append('video', ctx.video)
  formData.append('type', 'file')
  formData.append('disable_audio', '1')
  return _.get(await axios.post(`${IMGUR_BASEURL}upload`, formData, {
    headers: {
      ...ctx.imgurHeaders,
      ...formData.getHeaders(),
    },
  }), 'data.data')
}
