import { get } from "http";

const Client = require("waifu.it");
require("dotenv").config();

const token = process.env.WAIFU_API_TOKEN;

if (!token) {
  console.error("Authentication token is missing. Please set WAIFU_API_TOKEN.");
  process.exit(1); // Exit if token is missing
}

export interface Waifu {
  name: {
    full: string;
  };
  image: {
    large: string;
  };
  siteUrl: string;
}
const api = new Client(token);

async function getRandomWaifu() {
  try {
    const waifu = await api.getWaifu(); // Fetch a random waifu

    const waifuData: Waifu = {
      name: waifu.name.full,
      image: waifu.image.large,
      siteUrl: waifu.siteUrl,
    };

    return waifuData;
  } catch (error) {
    console.error("Error fetching waifu:", error); // Log the error message
  }
}

export default getRandomWaifu;
