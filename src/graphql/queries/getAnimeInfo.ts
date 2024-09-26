export const ANIME_INFO = (search: string, format: string, type: string) => `{
    Media(search: ${search}, format: ${format}, type: ${type}) {
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
  }
}`;
