export const GET_TRENDING_ANIME = (sortOption: string) => `{
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
