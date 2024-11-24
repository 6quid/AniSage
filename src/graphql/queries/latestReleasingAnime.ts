export const LATEST_ANIME_RELEASING = `{
    Page(page: 1, perPage: 20){
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
                coverImage {
                        medium
                }
                bannerImage
            }
        }
    }
}`;
