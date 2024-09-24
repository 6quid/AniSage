"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET_TRENDING_ANIME = void 0;
const GET_TRENDING_ANIME = (sortOption) => `{
  Page(page: 1, perPage: 10) {
    media(sort: ${sortOption}, type: ANIME) {
      title {
        english
      }
      coverImage {
        medium
      }
      siteUrl
    }
  }
}`;
exports.GET_TRENDING_ANIME = GET_TRENDING_ANIME;
