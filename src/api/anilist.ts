import axios from "axios";
import { GET_TRENDING_ANIME } from "../graphql/queries/getTrendingAnime";
import { AiringSchedule, AnimeResponse } from "..";
import { LATEST_ANIME_RELEASING } from "../graphql/queries/latestReleasingAnime";

const API_URL = "https://graphql.anilist.co/";

export const fetchTrendingAnime = async (sortOption: string) => {
  const query = GET_TRENDING_ANIME(sortOption);
  try {
    const response = await axios.post<AnimeResponse>(API_URL, {
      query,
    });

    return response.data.data.Page.media;
  } catch (error) {
    console.log("Error fetching data from AniList:", error);
    throw new Error("Failed to fetch data");
  }
};

export const fetchLatestAnime = async () => {
  const query = LATEST_ANIME_RELEASING;
  try {
    const response = await axios.post<AiringSchedule>(API_URL, {
      query,
    });

    return response.data.data.Page.airingSchedules;
  } catch (error) {
    console.log("Error fetching Latest Anime Releasing from AniList", error);
    throw new Error("Failed to fetch Releasing Anime");
  }
};
