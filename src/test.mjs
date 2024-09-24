import axios from "axios";

export const fetchLatestAnime = async () => {
  const query = `{
    Page(page: 1, perPage: 15){
        airingSchedules(notYetAired: true, sort: TIME){
            episode
            airingAt
            media {
                title {
                    english
                    romaji
                }
                format
                siteUrl
            }
        }
    }
  }`;

  try {
    const response = await axios.post(
      "https://graphql.anilist.co/",
      { query },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("API Response:", response.data);
    return response.data.data.Page.airingSchedules;
  } catch (error) {
    if (error.response) {
      console.log("API Error Response:", error.response.data);
    } else {
      console.log("Error fetching Latest Anime Releasing from AniList", error);
    }
    throw new Error("Failed to fetch Releasing Anime");
  }
};

const response = await fetchLatestAnime();
try {
  const airingTime = response.map((anime) => {
    return {
      format: anime.media.format,
      title: anime.media.title.english,
      episode: anime.episode,
      url: anime.media.siteUrl,
      airingAt: new Date(anime.airingAt * 1000).toLocaleString(),
    };
  });

  for (const anime of airingTime) {
    const date = "2024-09-24";

    const animeDate = anime.airingAt.slice(0, 10);
    const animeTime = anime.airingAt.slice(12, 25);

    if (anime.format === "TV" && date === animeDate) {
      console.log(
        `${anime.title} will be airing on ${animeDate} at ${animeTime} \nLink: ${anime.url} `
      );
    }
  }
} catch (error) {
  console.log(error);
}
