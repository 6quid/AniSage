import axios from "axios";
import { GET_TRENDING_ANIME } from "../graphql/queries/getTrendingAnime";
import {
  AiringSchedule,
  AiringScheduleResponse,
  Anime,
  AnimeResponse,
  InfoMedia,
  MediaInfoResponse,
} from "../interfaces/interfcaes";
import { LATEST_ANIME_RELEASING } from "../graphql/queries/latestReleasingAnime";
import { ANIME_INFO } from "../graphql/queries/getAnimeInfo";
import Fuse from "fuse.js";

const API_URL = "https://graphql.anilist.co/";

// Fetch trending anime based on the specified sorting option
export const fetchTrendingAnime = async (
  sortOption: string // Sorting option for trending anime
): Promise<Anime[]> => {
  const query = GET_TRENDING_ANIME(sortOption);
  try {
    const response = await axios.post<AnimeResponse>(API_URL, {
      query,
    });

    // Extract and return trending anime list
    return response.data.data.Page.media;
  } catch (error) {
    console.log("Error fetching data from AniList:", error);
    throw new Error("Failed to fetch data");
  }
};

// Fetch the latest anime that is currently airing
export const fetchLatestAnime = async (): Promise<AiringSchedule[]> => {
  const query = LATEST_ANIME_RELEASING;
  try {
    const response = await axios.post<AiringScheduleResponse>(API_URL, {
      query,
    });

    // Return airing schedules
    console.log(response.data.data.Page.airingSchedules);
    
    return response.data.data.Page.airingSchedules;
  } catch (error) {
    console.log("Error fetching Latest Anime Releasing from AniList", error);
    throw new Error("Failed to fetch Releasing Anime");
  }
};

// Fetch detailed information about a specific anime
export const fetchAnimeInfo = async (
  search: string, // Anime name to search for
  format: string // Format of the anime (e.g., TV, OVA)
): Promise<InfoMedia | null> => {
  const query = ANIME_INFO(search, format);
  try {
    const response = await axios.post<MediaInfoResponse>(API_URL, {
      query,
    });

    // Return the Media data
    return response.data.data.Media;
  } catch (error) {
    console.log(`Error retrieving info about ${search}. \n${error}`);
    throw new Error(
      `Failed to retrieve Information about ${search} with format ${format}`
    );
  }
};

// Fetch The anime titles and store them in a string[] used for Auto Complete
export const fetchAnimeTitles = async (anime: string): Promise<string[]> => {
  let animeTitles: string[] = [];

  const query = `{
    Page(page: 1, perPage: 50) {
      media(search: "${anime}") {
        title {
          english
          romaji
        }
        format  
      }
    }
  }`;

  try {
    const response = await axios.post<AnimeResponse>(API_URL, {
      query,
    });

    const media: Anime[] = response.data.data.Page.media;
    if (media.length > 0) {
      media.forEach((anime) => {
        if (anime.format === "TV" || anime.format === "Manga") {
          animeTitles.push(anime.title.english ?? anime.title.romaji);
        }
      });
    }

    animeTitles = animeTitles.map((title) => title.toLowerCase());

    const fuse = new Fuse(animeTitles, {
      includeScore: true, // Include score for ranking
      threshold: 0.4, // Adjust to control fuzziness
    });

    // Perform fuzzy search on the fetched titles based on user input
    const normalizedInput = anime.trim().toLowerCase();
    const fuzzyResults = fuse.search(normalizedInput);

    return fuzzyResults.map((result) => result.item);
  } catch (error) {
    console.log("Error fetching anime titles:", error);
    return [];
  }
};
