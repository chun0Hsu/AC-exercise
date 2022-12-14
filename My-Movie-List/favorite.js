const BASE_URL = "https://movie-list.alphacamp.io";
const INDEX_URL = BASE_URL + "/api/v1/movies/";
const POSTER_URL = BASE_URL + "/posters/";
const movies = JSON.parse(localStorage.getItem('favoriteMovies')) || [];

const dataPanel = document.querySelector("#data-panel");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");


dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".btn-show-movie")) {
    showMovieModal(Number(event.target.id));
  } else if (event.target.matches(".btn-remove-favorite")) {
    removeFromFavorite(Number(event.target.id))
  }
});

renderMovieList(movies)


function renderMovieList(data) {
  let rawHTML = "";
  data.forEach((item) => {
    rawHTML += `
    <div class="col-sm-3">
      <div class="card">
        <img
          src="${POSTER_URL + item.image}"
          class="card-img-top" alt="..."/>
        <div class="card-body">
          <h5 class="card-title">${item.title}</h5>
        </div>
        <div class="card-footer">
          <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" id="${item.id
      }">More</button>
          <button class="btn btn-danger btn-remove-favorite" id="${item.id}">X</button>
        </div>
      </div>
    </div>
    `;
  });
  dataPanel.innerHTML = rawHTML;
}

function showMovieModal(id) {
  const modalTitle = document.querySelector("#movie-modal-title");
  const modalImage = document.querySelector("#movie-modal-image");
  const modalDate = document.querySelector("#movie-modal-date");
  const modalDescription = document.querySelector("#movie-modal-description");

  modalTitle.innerText = "";
  modalDate.innerText = "";
  modalDescription.innerText = "";
  modalImage.innerHTML = "";

  axios
    .get(INDEX_URL + id)
    .then((response) => {
      const data = response.data.results;
      modalTitle.innerText = data.title;
      modalDate.innerText = "Release Date: " + data.release_date;
      modalDescription.innerText = data.description;
      modalImage.innerHTML = `
    <img src="${POSTER_URL + data.image}" alt="..." class="img-fluid">
    `;
    })
    .catch((err) => {
      console.log(err);
    });
}

function removeFromFavorite(id) {
  const movieIndex = movies.findIndex(movie => movie.id === id)
  if (movieIndex === -1) return

  movies.splice(movieIndex, 1)
  localStorage.setItem("favoriteMovies", JSON.stringify(movies))
  renderMovieList(movies)
}




