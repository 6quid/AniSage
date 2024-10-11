import { ANIME } from "@consumet/extensions";
import { MOVIES } from "@consumet/extensions";

export const zoro = new ANIME.Zoro();

export async function zoroAnimeInfo(anime: string) {
  const result = (await zoro.search(anime)).results;

  const lowerCaseAnime = anime.toLowerCase();
  //filtering the results for same anime and TV format
  const filteredResults = result.filter((animeResult) => {
    return (
      animeResult.type === "TV" &&
      animeResult.title.toString().toLowerCase().includes(lowerCaseAnime)
    );
  });

  if (filteredResults.length > 0) {
    const matchedAnime = filteredResults[0];
    return {
      title: matchedAnime.title,
      url: matchedAnime.url,
    };
  }
  return { title: "No Title Found", url: "No Url Found" };
}

export async function zoroAnimeTitleAutoComplete(anime: string) {
  const result = (await zoro.search(anime)).results;

  // Filtering the results to only get anime titles for autocomplete
  const filteredTitles = result
    .filter((animeResult) => animeResult.type === "TV")
    .map((animeResult) => animeResult.title.toString());

  // Return array of titles
  return filteredTitles;
}



