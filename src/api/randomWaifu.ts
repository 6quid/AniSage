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

    console.log("Waifu Name: ", waifu.name.full); // Log the waifu name
    console.log("Waifu Description: ", waifu.description); // Log the waifu description
    console.log("Waifu Image: ", waifu.image.large); // Log the waifu image URL
    console.log("Waifu Site URL: ", waifu.siteUrl); // Log the waifu site URL
    console.log("Waifu Media: ", waifu.media.nodes[0].title.romaji); // Log the waifu media title
    console.log("Waifu Media Type: ", waifu.media.nodes[0].type); // Log the waifu media type
    console.log("Waifu Media Format: ", waifu.media.nodes[0].format); // Log the waifu media format

    return waifu;
  } catch (error) {
    console.error("Error fetching waifu:", error); // Log the error message
  }
}

export default getRandomWaifu;
