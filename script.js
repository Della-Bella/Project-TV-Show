//REFACTORING THE CODE!!

// Function to display episodes
/*function displayEpisodes(episodes) {
   const episodesContainer = document.getElementById("root"); // The div where episodes will be displayed
   episodesContainer.innerHTML = ""; // Clear any previous content*/

   document.addEventListener("DOMContentLoaded", () => {
      const apiUrl = "https://api.tvmaze.com/shows/82/episodes";

      // Fetch episodes from the API
      fetch(apiUrl)
         .then((response) => {
            if (!response.ok) {
               throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
         })
         .then((episodes) => {
            // Display all episodes
            displayEpisodes(episodes);

            // Update episode count
            updateEpisodeCount(episodes.length, episodes.length);

            // dropdown
            populateEpisodeDropdown(episodes);

            //search
            const searchInput = document.getElementById("search-box");
            searchInput.addEventListener("input", (event) => {
               const searchTerm = event.target.value;
               const filteredEpisodes = filterEpisodes(episodes, searchTerm);
               displayEpisodes(filteredEpisodes);
               updateEpisodeCount(filteredEpisodes.length, episodes.length);
            });

            // dropdown 
            handleDropdownSelection(episodes);
         })
         .catch((error) => {
            console.error("Error fetching episodes:", error);
         });
   });

   function displayEpisodes(episodes) {
      const episodesContainer = document.getElementById("root"); 
      episodesContainer.innerHTML = ""; 

      //  template episode card
      const template = document.getElementById("film-card");

      // create a card
      episodes.forEach((episode) => {
         // create a new episode card
         const episodeCard = template.content.cloneNode(true);

         // card elements
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

         // Create episode card to the container
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

   function updateEpisodeCount(filteredCount, totalCount) {
      const countElement = document.getElementById("episode-count");
      countElement.textContent = `Displaying ${filteredCount}/${totalCount} episodes.`;
   }

   function populateEpisodeDropdown(episodes) {
      const dropdown = document.getElementById("episode-dropdown");
      dropdown.innerHTML = "";

      //  "Show All Episodes" 
      const defaultOption = document.createElement("option");
      defaultOption.value = "all";
      defaultOption.textContent = "Show All Episodes";
      dropdown.appendChild(defaultOption);

      //  episode
      episodes.forEach((episode) => {
         const option = document.createElement("option");
         option.value = episode.id;
         option.textContent = `S${String(episode.season).padStart(2, "0")}E${String(episode.number).padStart(2, "0")} - ${episode.name}`;
         dropdown.appendChild(option);
      });
   }

   function handleDropdownSelection(episodes) {
      const dropdown = document.getElementById("episode-dropdown");
      dropdown.addEventListener("change", (event) => {
         const selectedValue = event.target.value;

         if (selectedValue === "all") {
            // Show all episodes
            displayEpisodes(episodes);
            updateEpisodeCount(episodes.length, episodes.length);
         } else {
            // Filter episode
            const selectedEpisode = episodes.find(
               (episode) => String(episode.id) === selectedValue
            );
            displayEpisodes([selectedEpisode]);
            updateEpisodeCount(1, episodes.length);
         }
      });
   }
