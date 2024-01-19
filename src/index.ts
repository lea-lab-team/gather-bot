import 'dotenv/config'

import { Game } from "@gathertown/gather-game-client";
import { DiscordDomain } from './domains/discord.domain';

global.WebSocket = require("isomorphic-ws");

const GATHER_API_KEY = process.env.GATHER_API_KEY || "";
const GATHER_SPACE_ID = process.env.GATHER_SPACE_ID || "";
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL || "";

const discordDomain = new DiscordDomain()

const gather = new Game(GATHER_SPACE_ID, () =>
  Promise.resolve({ apiKey: GATHER_API_KEY })
);
gather.connect();

gather.subscribeToConnection((connected) => {
  console.log({ connected });

  gather.subscribeToEvent('playerMoves', async (data, context) => {

    await discordDomain.notify(DISCORD_WEBHOOK_URL, `Player ${context.player?.name} moved to ${context.player?.x}, ${context.player?.y}`)
  })
});
