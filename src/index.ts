import 'dotenv/config'

import axios from 'axios';
import { Game } from "@gathertown/gather-game-client";

global.WebSocket = require("isomorphic-ws");

const GATHER_API_KEY = process.env.GATHER_API_KEY || "";
const GATHER_SPACE_ID = process.env.GATHER_SPACE_ID || "";
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL || "";

let initFlag = false

class DiscordDomain {
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

const discordDomain = new DiscordDomain()

const gather = new Game(GATHER_SPACE_ID, () =>
  Promise.resolve({ apiKey: GATHER_API_KEY })
);
gather.connect();

gather.subscribeToConnection((connected) => {
  console.log({ connected });

  gather.subscribeToEvent('playerJoins', async (_, { playerId }) => {
    if (!initFlag) {
      initFlag = true
      return
    }


    try {
     setTimeout(() => {
      const _player = gather.getPlayer(playerId!)
      discordDomain.notify(DISCORD_WEBHOOK_URL, `「${_player!.name}」さんが入室しました`).catch((err) => {
        console.log({ type: 'error', message: err.message })
      })
     }, 3000)

    } catch (err: any) {
      console.log({ type: 'error', message: err.message })
    }

    console.info({ event: 'join', playerId })
  })

  gather.subscribeToEvent('playerExits', async (_, { player, playerId }) => {
    try {
      await discordDomain.notify(DISCORD_WEBHOOK_URL, `「${player!.name}」さんが退出しました`)
    } catch (err: any) {
      console.log({ type: 'error', message: err.message })
    }

    console.info({ event: 'exit', playerId })
  })
});
