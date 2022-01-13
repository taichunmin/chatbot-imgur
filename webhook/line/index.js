const _ = require('lodash')
const { middlewareCompose, base64urlToBase64 } = require('../../libs/helper')
const Line = require('@line/bot-sdk').Client

const middlewares = middlewareCompose([
  require('./event-init'),
  require('./imgur-upload'),
  require('./tutorial'),
])

module.exports = async (ctx, next) => {
  try {
    if (_.get(ctx, 'req.path') !== '/webhook/line') return await next()

    // 處理 access token
    ctx.lineToken = base64urlToBase64(_.get(ctx, 'req.query.lineToken', ''))
    if (!/^[a-zA-Z0-9+/=]+$/.test(ctx.lineToken)) throw new Error('invalid lineToken')
    ctx.line = new Line({ channelAccessToken: ctx.lineToken })

    const events = _.get(ctx, 'req.body.events', [])
    await Promise.all(_.map(events, event => middlewares({ ...ctx, event })))
  } catch (err) {
    ctx.log('ERROR', err)
  }
}
