import axios from "axios";

export const fetchLatestAnime = async () => {
  const query = `{
    Page(page: 1, perPage: 15){
        airingSchedules(notYetAired: true, sort: TIME){
            episode
            airingAt
            media{
                title{
                    english
                    romaji
                }
                nextAiringEpisode {
                    id
                }
                duration
                status
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

fetchLatestAnime()
  .then((anime) => console.log("ANIME: ", anime))
  .catch((error) => console.log(error));
