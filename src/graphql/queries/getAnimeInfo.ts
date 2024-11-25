export const ANIME_INFO = (search: string, format: string) => `{
  Media(search: "${search}", type: ${format} , sort: POPULARITY_DESC) {
    type
    format
    title {
      romaji
      native
    }
    description
    startDate {
      year
      month
      day
    }
    genres
    source(version: 3)
    chapters
    volumes 
    episodes
    nextAiringEpisode {
      id
      airingAt
      episode
    }
    status
    averageScore
    coverImage {
      large
    }
    staff {
      edges {
        role
        node {
          name {
            full
          }
        }
      }
    }
    siteUrl
    bannerImage
  }
}`;
