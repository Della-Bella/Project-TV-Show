//REFACTORING THE CODE!!

// Function to display episodes
function displayEpisodes(episodes) {
  const episodesContainer = document.getElementById("root"); // The div where episodes will be displayed
  episodesContainer.innerHTML = ""; // Clear any previous content

  // Get the template for the episode card
  const template = document.getElementById("film-card");

  // Loop through each episode and create a card
  episodes.forEach((episode) => {
    // Clone the template to create a new episode card
    const episodeCard = template.content.cloneNode(true);

    // Set the content for each card element
    episodeCard.querySelector(".name").textContent = episode.name;
    episodeCard.querySelector(".season").textContent = `S0${episode.season}E0${episode.number}`;
    episodeCard.querySelector(".image-medium").src = episode.image.medium;
    episodeCard.querySelector(".image-medium").alt = `Image of ${episode.name}`;
    episodeCard.querySelector(".summary").innerHTML = episode.summary;
    

    // Append the episode card to the container
    episodesContainer.appendChild(episodeCard);
  });
}

// Example of how you could fetch or get the episodes
document.addEventListener("DOMContentLoaded", () => {
  const episodes = getAllEpisodes();  // Assuming getAllEpisodes() provides the data
  displayEpisodes(episodes); // Call the function to display episodes
});


