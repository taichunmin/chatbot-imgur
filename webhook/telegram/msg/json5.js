const JSON5 = require('json5')

const TEXT_MAXLEN = 4096

const objToMarkdownV2 = obj => {
  let str = '```json5\n' + JSON5.stringify(obj, null, 2) + '\n```'
  if (str.length > TEXT_MAXLEN) str = '```json5\n' + JSON5.stringify(obj, null, 1) + '\n```'
  if (str.length > TEXT_MAXLEN) str = '```json5\n' + JSON5.stringify(obj) + '\n```'
  return str
}

module.exports = obj => ({
  disable_web_page_preview: true,
  parse_mode: 'MarkdownV2',
  text: objToMarkdownV2(obj),
})
