//You can edit ALL of the code here
/*function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.textContent = `Got ${episodeList.length} episode(s)`;
}

window.onload = setup;*/

// Function to display episodes
function displayEpisodes(episodes) {
  const episodesContainer = document.getElementById("episodes"); // place for episodes "div"

  // Clear initial content
  episodesContainer.innerHTML = ""; // clear content of the div episodes

  // Loop through each episode and create a card
  episodes.forEach((episode) => {
    // Create a container for the episode card
    const episodeCard = document.createElement("div");
    episodeCard.classList.add("episodes-card");

    // Create title
    const title = document.createElement("h2");
    title.textContent = `${episode.name} (S0${episode.season}E0${episode.number})`;

    // Create the image
    const img = document.createElement("img");
    img.src = episode.image.medium;
    img.alt = episode.name;

    // Create the description
    const description = document.createElement("p");
    description.textContent = episode.summary.replace(/<[^>]+>/g, ""); // Removes HTML tags from the summary

    // Append elements to the episode card
    episodeCard.appendChild(img);
    episodeCard.appendChild(title);
    episodeCard.appendChild(description);

    // Append the episode card to the episodes container
    episodesContainer.appendChild(episodeCard);
  });
}

// Call the provided getAllEpisodes() function to get the episodes
const episodes = getAllEpisodes(); //function in `episodes.js`

// Display the episodes
displayEpisodes(episodes);
