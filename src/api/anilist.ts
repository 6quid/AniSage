import axios from "axios";
import { GET_TRENDING_ANIME } from "../graphql/queries/getTrendingAnime";
import {
  AiringSchedule,
  AiringScheduleResponse,
  Anime,
  AnimeResponse,
  InfoMedia,
  Media,
  MediaInfoResponse,
} from "..";
import { LATEST_ANIME_RELEASING } from "../graphql/queries/latestReleasingAnime";
import { ANIME_INFO } from "../graphql/queries/getAnimeInfo";

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
    return response.data.data.Page.airingSchedules;
  } catch (error) {
    console.log("Error fetching Latest Anime Releasing from AniList", error);
    throw new Error("Failed to fetch Releasing Anime");
  }
};

// Fetch detailed information about a specific anime
export const fetchAnimeInfo = async (
  search: string, // Anime name to search for
  format: string, // Format of the anime (e.g., TV, OVA)
  type: string // Type of media (e.g., ANIME, MANGA)
): Promise<InfoMedia[] | null> => {
  const query = ANIME_INFO(search, format, type);
  try {
    const response = await axios.post<MediaInfoResponse>(API_URL, {
      query,
    });

    // Return the Media data
    return response.data.data.Media;
  } catch (error) {
    console.log(`Error retrieving info about ${search}. \n${error}`);
    throw new Error(
      `Failed to retrieve Information about ${search} with format ${format} of type ${type}`
    );
  }
};
