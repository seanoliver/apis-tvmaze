"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");
const defaultImg = "https://tinyurl.com/tv-missing";
const baseUrl = "http://api.tvmaze.com/";

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(searchTerm) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  const response = await axios.get(`${baseUrl}search/shows?`, {
    params: { q: searchTerm },
  });

  const showsArray = []; //TODO:use map method

  for (const showInfo of response.data) {
    const showId = showInfo.show.id;
    const showName = showInfo.show.name;
    const showSummary = showInfo.show.summary;

    const showImage =
      showInfo.show.image === null ? defaultImg : showInfo.show.image.original;

    showsArray.push({
      id: showId,
      name: showName,
      summary: showSummary,
      image: showImage,
    });
  }
  console.log("showsArray", showsArray);

  console.log("response:", response);

  return showsArray;
}

/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src="${show.image}"
              alt="${show.name}"
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>
      `
    );

    $showsList.append($show);
  }
  $(".Show").on("click", ".Show-getEpisodes", function () {
    let showId = $(this).closest(".Show").data("show-id");
    getEpisodesOfShow(showId);
  });
}

/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});

/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(showId) {
  const request = await axios.get(`${baseUrl}shows/${showId}/episodes`);
  console.log("episodesRequest:", request);
}

/** Write a clear docstring for this function... */

// function populateEpisodes(episodes) { }
