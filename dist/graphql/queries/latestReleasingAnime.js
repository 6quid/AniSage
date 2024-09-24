"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LATEST_ANIME_RELEASING = void 0;
exports.LATEST_ANIME_RELEASING = `{
    Page(page: 1, perPage: 15){
        airingSchedules(notYetAired: true, sort: TIME){
            episode
            airingAt
            media{
                format
                title{
                    english
                    romaji
                }
                siteUrl
            }
        }
    }
}`;
