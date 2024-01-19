import axios from 'axios';

export class DiscordDomain {
  constructor() {}

  async notify(webhookUrl: string, message: string) {
    try {
      await axios.post(webhookUrl, {
        content: message
      })
    } catch (err) {
      console.error(err)
      throw Error('Error sending message to Discord')
    }
  }
}