//REFACTORING THE CODE!!

   let currentEpisodes = []; // Store the currently selected episodes globally

   document.addEventListener("DOMContentLoaded", () => {
      fetchAndDisplayShows(); // Fetch and populate the TV show dropdown
      handleShowSelection(); // Handle the user's TV show selection

      //search
      const searchInput = document.getElementById("search-box");
      searchInput.addEventListener("input", (event) => {
         const searchTerm = event.target.value;
         const filteredEpisodes = filterEpisodes(currentEpisodes, searchTerm);
         displayEpisodes(filteredEpisodes);
         updateEpisodeCount(filteredEpisodes.length, currentEpisodes.length);
      });
   });
  
   // Fetch all TV shows and populate the show dropdown
   function fetchAndDisplayShows() {
   const apiUrl = "https://api.tvmaze.com/shows";

   fetch(apiUrl)
      .then((response) => response.json())
      .then((shows) => {
         shows.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
         populateShowDropdown(shows);
      })
      .catch((error) => {
         console.error("Error fetching shows:", error);
      });
   }

   // Populate the TV show dropdown with fetched data
   function populateShowDropdown(shows) {
      const showDropdown = document.getElementById("show-dropdown");
      shows.forEach((show) => {
         const option = document.createElement("option");
         option.value = show.id;
         option.textContent = show.name;
         showDropdown.appendChild(option);
      });
   }

   // Handle TV show selection and fetch episodes for the selected show
   function handleShowSelection() {
      const showDropdown = document.getElementById("show-dropdown");

      showDropdown.addEventListener("change", (event) => {
         const selectedShowId = event.target.value;
         if (selectedShowId === "default") return;

         const apiUrl = `https://api.tvmaze.com/shows/${selectedShowId}/episodes`;

         fetch(apiUrl)
            .then((response) => response.json())
            .then((episodes) => {
               currentEpisodes = episodes; // Store the fetched episodes globally
               displayEpisodes(episodes);
               updateEpisodeCount(episodes.length, episodes.length);
               populateEpisodeDropdown(episodes);
            })
            .catch((error) => {
               console.error("Error fetching episodes:", error);
            });
      });
   }

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
      dropdown.innerHTML = `<option value="all">Show All Episodes</option>`;

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

      handleDropdownSelection(episodes);
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
