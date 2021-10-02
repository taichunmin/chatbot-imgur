const _ = require('lodash')

module.exports = async (ctx, next) => {
  if (!_.includes(['follow', 'join'], _.get(ctx, 'event.type'))) return await next()
  await ctx.replyMessage({
    type: 'text',
    text: '請上傳圖片，機器人就會幫你上傳到 Imgur 喔！',
    quickReply: {
      items: [
        {
          type: 'action',
          action: {
            type: 'cameraRoll',
            label: '相簿上傳',
          },
        },
        {
          type: 'action',
          action: {
            type: 'camera',
            label: '拍照上傳',
          },
        },
      ],
    },
  })
}
