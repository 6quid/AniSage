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
import { getFormattedDate } from "../utils/dateUtil";
import { logErrorToChannel } from "../utils/logErrors";
import { generateErrorMessage } from "../utils/errorMessage";

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
    throw new Error(
      generateErrorMessage(
        "fetchTrendingAnime",
        { SortOption: sortOption },
        error
      )
    );
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

    return response.data.data.Page.airingSchedules;
  } catch (error) {
    throw new Error(generateErrorMessage("fetchLatestAnime", {}, error));
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
    throw new Error(
      generateErrorMessage(
        "fetchAnimeInfo()",
        { Search: search, Format: format },
        error
      )
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
        type  
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
        if (anime.type === "ANIME" || anime.type === "MANGA") {
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
    const errorDetails = `
    **❌ Error Fetching AutoComplete Anime Titles**
    **Function:** \`fetchAnimeTitles()\`
    **Input:** \`${anime}\`
    **Date:** \`${getFormattedDate()}\`
    **Trace:** 
    \`\`\`
    ${(error as any).stack || error}
    \`\`\`
    `;
    await logErrorToChannel(errorDetails); // Log to your error log channel
    return []; // Return an empty array as fallback
  }
};
