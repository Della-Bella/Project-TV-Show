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

      // Set content forcard element
      episodeCard.querySelector(".name").textContent = episode.name;
      episodeCard.querySelector(".season").textContent =
         `S${String(episode.season).padStart(2, "0")}E${String(episode.number).padStart(2, "0")}`;
      episodeCard.querySelector(".image-medium").src = episode.image.medium;
      episodeCard.querySelector(".image-medium").alt =
         `Image of ${episode.name}`;
      episodeCard.querySelector(".image-medium").alt =
         `Image of ${episode.name}`;
      // episodeCard.querySelector(".url")
    episodeCard.querySelector(".url").href = episode.url;

      episodeCard.querySelector(".summary").innerHTML = episode.summary;
   
      // Append the episode card to the container
  
       episodesContainer.appendChild(episodeCard);
   });
}

// Function to filter and display episodes based on search input
function filterEpisodes(episodes, searchTerm) {
   const filteredEpisodes = episodes.filter((episode) => {
      const lowerCaseTerm = searchTerm.toLowerCase();
      return (
         episode.name.toLowerCase().includes(lowerCaseTerm) ||
         episode.summary.toLowerCase().includes(lowerCaseTerm)
      );
   });
   return filteredEpisodes;
}

// Function to update the episode count
function updateEpisodeCount(filteredCount, totalCount) {
   const countElement = document.getElementById("episode-count");
   countElement.textContent = `Displaying ${filteredCount}/${totalCount} episodes.`;
}

// Function to populate the dropdown with episodes
function populateEpisodeDropdown(episodes) {
   const dropdown = document.getElementById("episode-dropdown");
   dropdown.innerHTML = "";

   // Add a default "Show All Episodes" option
   const defaultOption = document.createElement("option");
   defaultOption.value = "all";
   defaultOption.textContent = "Show All Episodes";
   dropdown.appendChild(defaultOption);

   // Add an option for each episode
   episodes.forEach((episode) => {
      const option = document.createElement("option");
      option.value = episode.id;
      option.textContent = `S${String(episode.season).padStart(2, "0")}E${String(episode.number).padStart(2, "0")} - ${episode.name}`;
      dropdown.appendChild(option);
   });
}

// Function to handle dropdown selection
function handleDropdownSelection(episodes) {
   const dropdown = document.getElementById("episode-dropdown");

   dropdown.addEventListener("change", (event) => {
      const selectedValue = event.target.value;

      if (selectedValue === "all") {
         // Show all episodes if "Show All Episodes" is selected
         displayEpisodes(episodes);
         updateEpisodeCount(episodes.length, episodes.length);
      } else {
         // Filter and show only the selected episode
         const selectedEpisode = episodes.find((episode) => String(episode.id) === selectedValue);
         displayEpisodes([selectedEpisode]);
         updateEpisodeCount(1, episodes.length);
      }
   });
}

// Example of how you could fetch or get the episodes
document.addEventListener("DOMContentLoaded", () => {
   const episodes = getAllEpisodes(); //  getAllEpisodes() to show the  data
   displayEpisodes(episodes); // Call the function

   // Initialize search input for user interaction
   const searchInput = document.getElementById("search-box");
   updateEpisodeCount(episodes.length, episodes.length);

   // Populate dropdown
   populateEpisodeDropdown(episodes);

    // Add event listener for the search input
   searchInput.addEventListener("input", (event) => {
      const searchTerm = event.target.value;
      const filteredEpisodes = filterEpisodes(episodes, searchTerm);

      // Update display and count
      displayEpisodes(filteredEpisodes);
      updateEpisodeCount(filteredEpisodes.length, episodes.length);
   });

   // Add event listener for dropdown selection
   handleDropdownSelection(episodes);

});
