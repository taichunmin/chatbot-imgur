const { encodeBase64url } = require('../../../libs/helper')
const JSON5 = require('json5')

module.exports = imgur => ({
  type: 'flex',
  altText: '圖片上傳成功，請點此取得網址。',
  contents: {
    size: 'nano',
    type: 'bubble',
    body: {
      layout: 'vertical',
      paddingAll: '0px',
      type: 'box',
      action: {
        type: 'uri',
        uri: `https://taichunmin.idv.tw/pug/chatbot-imgur.html?imgur=${encodeBase64url(JSON5.stringify(imgur))}`,
      },
      contents: [
        {
          animated: true,
          aspectMode: 'cover',
          aspectRatio: `${imgur.width}:${imgur.height}`,
          size: 'full',
          type: 'image',
          url: imgur.link,
        },
        {
          layout: 'vertical',
          paddingAll: '5px',
          type: 'box',
          contents: [
            {
              align: 'center',
              color: '#0000ff',
              gravity: 'center',
              size: 'xxs',
              text: '點此取得網址',
              type: 'text',
            },
          ],
        },
      ],
    },
  },
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
