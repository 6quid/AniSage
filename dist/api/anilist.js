"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchLatestAnime = exports.fetchTrendingAnime = void 0;
const axios_1 = __importDefault(require("axios"));
const getTrendingAnime_1 = require("../graphql/queries/getTrendingAnime");
const latestReleasingAnime_1 = require("../graphql/queries/latestReleasingAnime");
const API_URL = "https://graphql.anilist.co/";
const fetchTrendingAnime = async (sortOption) => {
    const query = (0, getTrendingAnime_1.GET_TRENDING_ANIME)(sortOption);
    try {
        const response = await axios_1.default.post(API_URL, {
            query,
        });
        return response.data.data.Page.media;
    }
    catch (error) {
        console.log("Error fetching data from AniList:", error);
        throw new Error("Failed to fetch data");
    }
};
exports.fetchTrendingAnime = fetchTrendingAnime;
const fetchLatestAnime = async () => {
    const query = latestReleasingAnime_1.LATEST_ANIME_RELEASING;
    try {
        const response = await axios_1.default.post(API_URL, {
            query,
        });
        return response.data.data.Page.airingSchedules;
    }
    catch (error) {
        console.log("Error fetching Latest Anime Releasing from AniList", error);
        throw new Error("Failed to fetch Releasing Anime");
    }
};
exports.fetchLatestAnime = fetchLatestAnime;
