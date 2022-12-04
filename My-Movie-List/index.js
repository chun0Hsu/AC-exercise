const BASE_URL = "https://movie-list.alphacamp.io";
const INDEX_URL = BASE_URL + "/api/v1/movies/";
const POSTER_URL = BASE_URL + "/posters/";
const MOVIES_PER_PAGE = 12
const movies = [];
const favoriteMovies = JSON.parse(localStorage.getItem("favoriteMovies")) || [];
let filteredMovies = [];

const dataPanel = document.querySelector("#data-panel");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const paginator = document.querySelector('#paginator')

dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".btn-show-movie")) {
    showMovieModal(Number(event.target.id));
  } else if (event.target.matches(".btn-add-favorite")) {
    addToFavorite(Number(event.target.id))
    event.target.textContent = "-"
  }
});

paginator.addEventListener('click', (event) => {
  if (event.target.tagName !== 'A') return

  const page = Number(event.target.dataset.page)
  renderMovieList(getMoviesByPage(page))
})

searchForm.addEventListener("submit", function onSearchFormSubmitted(event) {
  event.preventDefault();
  const keyword = searchInput.value.trim().toLowerCase();

  if (!keyword.length) {
    searchInput.value = "";
    return alert("Invalid input!");
  }

  filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(keyword)
  );

  if (filteredMovies.length === 0) {
    searchInput.value = "";
    return alert("Can not find movies with keyword");
  }
  renderPaginator(filteredMovies.length)
  renderMovieList(getMoviesByPage(1));
});

axios
  .get(INDEX_URL)
  .then((response) => {
    movies.push(...response.data.results);
    renderPaginator(movies.length)
    renderMovieList(getMoviesByPage(1));
  })
  .catch((err) => {
    console.log(err);
  });


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
          <button class="btn btn-info btn-add-favorite" id="${item.id}">${favoriteMovies.some((ele) => ele.id === item.id) ? "-" : "+"
      }</button>
        </div>
      </div>
    </div>
    `;
  });
  dataPanel.innerHTML = rawHTML;
}

function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE)

  let rawHTML = ''

  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `
    <li class="page-item"><a class="page-link" href="#" data-page=${page}>${page}</a></li>
    `
  }
  paginator.innerHTML = rawHTML
}

function getMoviesByPage(page) {
  const data = filteredMovies.length ? filteredMovies : movies
  const startIndex = (page - 1) * MOVIES_PER_PAGE
  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE)
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

function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem("favoriteMovies")) || []
  const movie = movies.find(movie => movie.id === id)
  if (list.some(movie => movie.id === id)) {
    return alert('已收藏！')
  }
  list.push(movie)
  localStorage.setItem("favoriteMovies", JSON.stringify(list))
}


