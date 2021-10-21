module.exports = async (ctx, next) => {
  await ctx.sendMessage('請上傳圖片，機器人就會幫你上傳到 Imgur 喔！')
}
