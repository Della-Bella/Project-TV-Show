/*Fetchinf a Jason file:
fetch('.movies.json')
.then((response) => response.json())
.then ((data) => console.log(data));*/

/*Fetching a text file
fetch('./test.text')
.then((response) => responese.text())
.rhen((data) => console.log (data));*/

/* fetching from API
fetch('https://api.disneyapi.dev/character')
.then((response) => response.json())
.then((data) => (document.querySelector('h1').textContent = data.
login));*/

function fetchUser(){
fetch('https://api.disneyapi.dev/character')
.then((res) => res.json())
.then((data) => {
    console.log(data);
});
}

function displayDisney(){
    const movieDisney= document.querySelector (#film-card)

    userdisplay.innerHtml=
    <h2 class="name"> ${user.name}</h2>
      <h3 class="season">season</h3> ${user.tvShows}
      <img class="image-medium" src="" alt="Episode Image"> ${user.imageUrl}
      <p class="summary">Description</p>





}

document.querySelector('#generate').addEventListener(click', fetchUser)

fetchUser();