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
  description: string;
  siteUrl: string;
  media: {
    nodes: [
      {
        bannerImage: string;
        title: {
          romaji: string;
        };
        type: string;
        format: string;
      }
    ];
  };
}
const api = new Client(token);

async function getRandomWaifu(): Promise<Waifu | undefined> {
  try {
    const waifu = await api.getWaifu(); // Fetch a random waifu

    return waifu;
  } catch (error) {
    console.error("Error fetching waifu:", error); // Log the error message
  }
}

export default getRandomWaifu;
