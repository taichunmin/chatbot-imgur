const { log, middlewareCompose } = require('./libs/helper')

const middlewares = middlewareCompose([
  require('./libs/imgur').headersMiddleware,
  require('./webhook/line'),
  require('./webhook/telegram'),
])

exports.main = async (req, res) => {
  try {
    await middlewares({ req })
    res.status(200).send('OK')
  } catch (err) {
    log('ERROR', err)
    res.status(err.status || 500).send(err.message)
  }
}
