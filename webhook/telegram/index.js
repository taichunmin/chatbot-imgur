const _ = require('lodash')
const { errToPlainObj, log, middlewareCompose } = require('../../libs/helper')
const Telegram = require('../../libs/telegram').Client
const msgJson5 = require('./msg/json5')

const middlewares = middlewareCompose([
  require('./imgur-upload-image'),
  require('./imgur-upload-video'),
  require('./tutorial'),
])

module.exports = async (ctx, next) => {
  try {
    if (_.get(ctx, 'req.path') !== '/webhook/telegram') return await next()

    // 取得 token
    ctx.telegramToken = _.get(ctx, 'req.query.telegramToken', '')
    if (!/^\d+:[A-Za-z0-9_-]+$/.test(ctx.telegramToken)) throw new Error('invalid telegramToken')
    ctx.telegram = new Telegram({ token: ctx.telegramToken })

    // 紀錄 update
    ctx.log = log
    const update = ctx.update = ctx.req?.body // https://core.telegram.org/bots/api#update
    log({ message: `Telegram: update from ${JSON.stringify(ctx.update.from)}`, update: ctx.update })

    // 宣告可用函式
    // https://core.telegram.org/bots/api#sendmessage
    ctx.sendMessage = async args => {
      if (_.isString(args)) args = { text: args }
      const message = update?.message ?? update?.edited_message
      await ctx.telegram.sendMessage({
        chat_id: message?.chat?.id,
        ...args,
      })
    }

    // https://core.telegram.org/bots/api#sendmessage
    ctx.replyMessage = async args => {
      if (_.isString(args)) args = { text: args }
      const message = update?.message ?? update?.edited_message
      await ctx.telegram.sendMessage({
        allow_sending_without_reply: true,
        chat_id: message?.chat?.id,
        reply_to_message_id: message?.message_id,
        ...args,
      })
    }

    await middlewares(ctx)
  } catch (err) {
    if (ctx.replyMessage) await ctx.replyMessage(msgJson5(_.omit(errToPlainObj(err), ['stack'])))
    // 避免錯誤拋到外層
    err.message = `telegramWebhook: ${err.message}`
    log('ERROR', err)
  }
}
