const _ = require('lodash')
const axios = require('axios')

const API_BASEURL = 'https://api.telegram.org/bot'

class Client {
  constructor ({ token }) {
    this.token = token
  }

  async _apiPost ({ path, body = {} }) {
    try {
      const url = `${API_BASEURL}${this.token}/${path}`
      return _.get(await axios.post(url, body), 'data.result')
    } catch (err) {
      err.status = err.response?.status ?? err.status ?? 500
      err.message = err.response?.data?.description ?? err.message
      _.set(err, 'data.path', path)
      _.set(err, 'data.body', body)
      throw err
    }
  }

  async getMe () {
    return await this._apiPost({
      path: 'getMe',
    })
  }

  // https://core.telegram.org/bots/api#sendmessage
  async sendMessage (body) {
    return await this._apiPost({
      path: 'sendMessage',
      body,
    })
  }

  async getFile (fileId) {
    return await this._apiPost({
      path: 'getFile',
      body: { file_id: fileId },
    })
  }

  async getFileDownloadLink (fileId) {
    const file = await this.getFile(fileId)
    return `https://api.telegram.org/file/bot${this.token}/${file.file_path}`
  }
}

exports.Client = Client
