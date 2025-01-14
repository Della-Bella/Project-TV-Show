let currentEpisodes = [];
let showCache = {};
let allShows = [];
let showsFetched = false; //flag to check if all shows are fetched

function getClassByRate(vote) {
   if (vote >= 8) {
      return "green";
   } else if (vote >= 5) {
      return "orange";
   } else {
      return "red";
   }
}

window.onload = setup;

function setup() {
  fetchAndDisplayShows();
   handleSearch();
  handleShowSelection();
  handleShowSearch();
  setupNavigation();
   // Hide search show input
 document.getElementById("show-search-box").style.display = "none";
 document.getElementById("shows-list").style.display = "none";
 document.getElementById("root").style.display = "none";
 }

async function fetchAndDisplayShows() {
  if (showsFetched) {
    displayShows(allShows);
    return;
  }

  const apiUrl = "https://api.tvmaze.com/shows";

  try {
    const response = await fetch(apiUrl);
    const shows = await response.json();
    shows.sort((a, b) =>
      a.name.toLowerCase().localeCompare(b.name.toLowerCase())
    );
    allShows = shows;
    populateShowDropdown(shows);
    displayShows(shows);
    showsFetched = true;
  } catch (error) {
    console.error("Error fetching shows:", error);
    displayErrorMessage("Error fetching shows. Please try again later.");
  }
}

function displayShows(shows) {
  document.getElementById("shows-list").style.display = ''; // Show shows list
  document.getElementById("root").style.display = 'none'; // Hide episodes list
  document.getElementById("show-search-box").style.display = 'none';
  document.getElementById("search-box").style.display = 'flex';
  document.getElementById("show-list-btn").style.display = 'none';
    const showsContainer = document.getElementById("shows-list");
  showsContainer.innerHTML = "";

  const template = document.getElementById("film-card");

  shows.forEach((show) => {
      const episodeCard = template.content.cloneNode(true);

      episodeCard.querySelector(".name").textContent = show.name;
      episodeCard.querySelector(".season").textContent = "";
      episodeCard.querySelector(".image-medium").src =
        show.image?.medium || "placeholder.jpg";
      episodeCard.querySelector(".image-medium").alt = `Image of ${show.name}`;
      episodeCard.querySelector(".url").href = "#"; // Link to trigger episode fetching
      episodeCard.querySelector(".url").onclick = (event) => {
        event.preventDefault();
        fetchAndDisplayEpisodes(show.id, show);
    };
    episodeCard.querySelector(".summary").innerHTML =
        show.summary || "No description available.";
        episodeCard.querySelector(".show-genres").textContent =
        show.genres.join(", ");
        episodeCard.querySelector(".show-status").textContent = show.status;
      episodeCard.querySelector(".show-rating").textContent =
        show.rating.average || "N/A";
      episodeCard.querySelector(".show-runtime").textContent =
        show.runtime || "N/A";

    showsContainer.appendChild(episodeCard);
  });
}

async function fetchAndDisplayEpisodes(showId, show) {
    document.getElementById("shows-list").style.display = 'none';
  document.getElementById("root").style.display = 'grid';
    document.getElementById("show-search-box").style.display = 'flex';
  document.getElementById("search-box").style.display = 'flex';
 document.getElementById("show-list-btn").style.display = 'inline-block';
   if (showCache[showId]) {
    currentEpisodes = showCache[showId];
    displayEpisodes(showCache[showId], show);
    populateEpisodeDropdown(showCache[showId]);
    updateEpisodeCount(showCache[showId].length, showCache[showId].length);
    return;
  }

  const apiUrl = `https://api.tvmaze.com/shows/${showId}/episodes`;

  try {
    const response = await fetch(apiUrl);
    const episodes = await response.json();
    currentEpisodes = episodes;
    showCache[showId] = episodes;
    displayEpisodes(episodes, show);
    updateEpisodeCount(episodes.length, episodes.length);
    populateEpisodeDropdown(episodes);
  } catch (error) {
    console.error("Error fetching episodes:", error);
    displayErrorMessage("Error fetching episodes. Please try again later.");
  }
}

function populateShowDropdown(shows) {
  const showDropdown = document.getElementById("show-dropdown");
  shows.forEach((show) => {
    const option = document.createElement("option");
    option.value = show.id;
    option.textContent = show.name;
    showDropdown.appendChild(option);
  });
}

function handleShowSelection() {
  const showDropdown = document.getElementById("show-dropdown");

  showDropdown.addEventListener("change", async (event) => {
    const selectedShowId = event.target.value;
    if (selectedShowId === "default") return;
    const selectedShow = allShows.find(
      (show) => String(show.id) === selectedShowId
    );
    fetchAndDisplayEpisodes(selectedShowId, selectedShow);
  });
}

function displayEpisodes(episodes, show) {
    const episodesContainer = document.getElementById("root");
  episodesContainer.innerHTML = "";
  const template = document.getElementById("film-card");

  episodes.forEach((episode) => {
    const episodeCard = template.content.cloneNode(true);

    episodeCard.querySelector(".name").textContent = episode.name;
    episodeCard.querySelector(".season").textContent =
      `S${String(episode.season).padStart(2, "0")}E${String(episode.number).padStart(2, "0")}`;
      episodeCard.querySelector(".image-medium").src =
        episode.image?.medium || "placeholder.jpg";
    episodeCard.querySelector(".image-medium").alt =
      `Image of ${episode.name}`;
      episodeCard.querySelector(".url").href = episode.url;
      episodeCard.querySelector(".summary").innerHTML =
        episode.summary || "No description available.";

        // Update show information using the show details
    if (show) {
        episodeCard.querySelector(".show-genres").textContent =
        show.genres.join(", ");
        episodeCard.querySelector(".show-status").textContent = show.status;
        episodeCard.querySelector(".show-rating").textContent = 
        show.rating.average || "N/A";
        episodeCard.querySelector(".show-runtime").textContent =
        show.runtime || "N/A";
    }
    episodesContainer.appendChild(episodeCard);
  });
}

function filterEpisodes(episodes, searchTerm) {
    const lowerCaseTerm = searchTerm.toLowerCase();
  return episodes.filter((episode) => {
    return (
        episode.name.toLowerCase().includes(lowerCaseTerm) ||
        (episode.summary &&
          episode.summary.toLowerCase().includes(lowerCaseTerm))
    );
  });
}
function filterShows(shows, searchTerm) {
    const lowerCaseTerm = searchTerm.toLowerCase();
  return shows.filter((show) => {
    return (
        show.name.toLowerCase().includes(lowerCaseTerm) ||
        show.genres.some((genre) =>
          genre.toLowerCase().includes(lowerCaseTerm)
        ) ||
        (show.summary && show.summary.toLowerCase().includes(lowerCaseTerm))
    );
  });
}

function handleSearch() {
  const searchInput = document.getElementById("search-box");
    searchInput.addEventListener("input", (event) => {
        const searchTerm = event.target.value;
        const filteredEpisodes = filterEpisodes(currentEpisodes, searchTerm);
        displayEpisodes(filteredEpisodes);
    updateEpisodeCount(filteredEpisodes.length, currentEpisodes.length);
  });
}

function handleShowSearch() {
  const showSearchInput = document.getElementById("show-search-box");
  showSearchInput.addEventListener("input", (event) => {
      const searchTerm = event.target.value;
      const filteredShows = filterShows(allShows, searchTerm);
      displayShows(filteredShows);
  });
}

function updateEpisodeCount(filteredCount, totalCount) {
  const countElement = document.getElementById("episode-count");
  countElement.textContent = `Displaying ${filteredCount}/${totalCount} episodes.`;
}

function populateEpisodeDropdown(episodes) {
  const dropdown = document.getElementById("episode-dropdown");
  dropdown.innerHTML = `<option value="all">Show All Episodes</option>`;

  const defaultOption = document.createElement("option");
    defaultOption.value = "all";
    defaultOption.textContent = "Show All Episodes";
    dropdown.appendChild(defaultOption);

  episodes.forEach((episode) => {
    const option = document.createElement("option");
    option.value = episode.id;
    option.textContent = `S${String(episode.season).padStart(2, "0")}E${String(episode.number).padStart(2, "0")} - ${episode.name}`;
    dropdown.appendChild(option);
  });
  handleDropdownSelection(episodes);
}

function handleDropdownSelection(episodes) {
    const dropdown = document.getElementById("episode-dropdown");
  dropdown.addEventListener("change", (event) => {
    const selectedValue = event.target.value;

    if (selectedValue === "all") {
      displayEpisodes(episodes);
     updateEpisodeCount(episodes.length, episodes.length);
    } else {
      const selectedEpisode = episodes.find(
        (episode) => String(episode.id) === selectedValue
      );
      if (selectedEpisode) {
        displayEpisodes([selectedEpisode]);
         updateEpisodeCount(1, episodes.length);
      }
    }
  });
}
function setupNavigation() {
    const showListButton = document.getElementById("show-list-btn");
    showListButton.addEventListener("click", () => {
      displayShows(allShows);
  });
}
function displayErrorMessage(message) {
  const errorDiv = document.createElement("div");
  errorDiv.textContent = message;
    errorDiv.style.color = "red";
    document.body.insertBefore(errorDiv, document.querySelector("main"));
}