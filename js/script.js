const global = {
  currentPage: window.location.pathname,
  search: {
    term: '',
    type: '',
    page: 1,
    totalPages: 1,
    totalResults: 0,
  },
  api: {
    apiUrl: '/api/tmdb/',
  },
};

async function fetchAPIData(endpoint) {
  showSpinner();
  try {
    const response = await fetch(`${global.api.apiUrl}${endpoint}`);
    if (!response.ok) {
      throw new Error('Falha na requisição da API');
    }
    const data = await response.json();
    hideSpinner();
    return data;
  } catch (error) {
    hideSpinner();
    showAlert('Erro ao carregar dados: ' + error.message);
    return null;
  }
}

async function displayPopularMovies() {
  const { results } = await fetchAPIData('movie/popular');
  results.forEach((movie) => {
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = `
        <a href="movie-details.html?id=${movie.id}">
            ${movie.poster_path
        ? `<img
              src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
              class="card-img-top"
              alt="${movie.title}"
            />`
        : `<img
              src="../images/no-image.jpg"
              class="card-img-top"
              alt="${movie.title}"
            />`
      }
          </a>
          <div class="card-body">
            <h5 class="card-title">${movie.title}</h5>
            <p class="card-text">
              <small class="text-muted">Lançado em: ${new Date(
        movie.release_date
      ).toLocaleDateString('pt-BR')}</small>
            </p>
          </div>
          `;
    document.querySelector('#popular-movies').appendChild(div);
  });
}

async function displayPopularShows() {
  const { results } = await fetchAPIData('tv/popular');
  results.forEach((show) => {
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = `
        <a href="tv-details.html?id=${show.id}">
            ${show.poster_path
        ? `<img
              src="https://image.tmdb.org/t/p/w500${show.poster_path}"
              class="card-img-top"
              alt="${show.name}"
            />`
        : `<img
              src="../images/no-image.jpg"
              class="card-img-top"
              alt="${show.name}"
            />`
      }
          </a>
          <div class="card-body">
            <h5 class="card-title">${show.name}</h5>
            <p class="card-text">
              <small class="text-muted">Lançado em: ${new Date(
        show.first_air_date
      ).toLocaleDateString('pt-BR')}</small>
            </p>
          </div>
          `;
    document.querySelector('#popular-shows').appendChild(div);
  });
}

const statusTraducao = {
  Released: 'Lançado',
  'In Production': 'Em Produção',
  'Post Production': 'Pós-Produção',
  Planned: 'Planejado',
  Canceled: 'Cancelado',
  Rumored: 'Rumor',
};

async function displayMovieDetails() {
  const movieId = window.location.search.split('=')[1];
  console.log(movieId);
  const movie = await fetchAPIData(`movie/${movieId}`);
  displayBackgroundImage('movie', movie.backdrop_path);
  const div = document.createElement('div');
  div.innerHTML = `
            <div class="details-top">
          <div>
            ${movie.poster_path
      ? `<img
              src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
              class="card-img-top"
              alt="${movie.title}"
            />`
      : `<img
              src="../images/no-image.jpg"
              class="card-img-top"
              alt="${movie.title}"
            />`
    }
          </div>
          <div>
            <h2>${movie.title}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${movie.vote_average.toFixed(1)} / 10
            </p>
            <p class="text-muted">Data de lançamento: ${new Date(
      movie.release_date
    ).toLocaleDateString('pt-BR')}</p>
            <p>
              ${movie.overview}
            </p>
            <h5>Gênero</h5>
            <ul class="list-group">
              ${movie.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
            </ul>
            <a href="${movie.homepage
    }" target="_blank" class="btn">Visite a página oficial</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Informações adicionais do filme</h2>
          <ul>
            <li><span class="text-secondary">Orçamento:</span> $${addCommasToNumber(
      movie.budget
    )}</li>
            <li><span class="text-secondary">Receita:</span> $${addCommasToNumber(
      movie.revenue
    )}</li>
            <li><span class="text-secondary">Duração:</span> ${movie.runtime
    } minutos</li>
            <li><span class="text-secondary">Estado:</span> ${statusTraducao[movie.status] || movie.status
    }</li>
          </ul>
          <h4>Empresas produtoras</h4>
          <div class="list-group">
          ${movie.production_companies
      .map((company) => `<span>${company.name}</span>`)
      .join(', ')}
          </div>
        </div>
    `;
  document.querySelector('#movie-details').appendChild(div);
}

const statusTraducaoTV = {
  'Returning Series': 'Em andamento',
  Ended: 'Encerrado',
  Canceled: 'Cancelado',
  'In Production': 'Em produção',
};

async function displayShowDetails() {
  const showId = window.location.search.split('=')[1];
  console.log(showId);
  const show = await fetchAPIData(`tv/${showId}`);
  displayBackgroundImage('tv', show.backdrop_path);
  const div = document.createElement('div');
  div.innerHTML = `
            <div class="details-top">
          <div>
            ${show.poster_path
      ? `<img
              src="https://image.tmdb.org/t/p/w500${show.poster_path}"
              class="card-img-top"
              alt="${show.name}"
            />`
      : `<img
              src="../images/no-image.jpg"
              class="card-img-top"
              alt="${show.name}"
            />`
    }
          </div>
          <div>
            <h2>${show.name}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${show.vote_average.toFixed(1)} / 10
            </p>
            <p class="text-muted">Último dia ao ar: ${new Date(
      show.last_air_date
    ).toLocaleDateString('pt-BR')}</p>
            <p>
              ${show.overview}
            </p>
            <h5>Gênero</h5>
            <ul class="list-group">
              ${show.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
            </ul>
            <a href="${show.homepage
    }" target="_blank" class="btn">Visite a página oficial</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Informações adicionais do programa televisivo</h2>
          <ul>
            <li><span class="text-secondary">Número de episódios:</span> ${show.number_of_episodes
    }</li>
            <li><span class="text-secondary">Último episódio ao ar:</span> ${show.last_episode_to_air.name
    }</li>
            <li><span class="text-secondary">Estado:</span> ${statusTraducaoTV[show.status] || show.status
    }</li>
          </ul>
          <h4>Empresas produtoras</h4>
          <div class="list-group">
          ${show.production_companies
      .map((company) => `<span>${company.name}</span>`)
      .join(', ')}
          </div>
        </div>
    `;
  document.querySelector('#show-details').appendChild(div);
}

function displayBackgroundImage(type, backgroundPath) {
  const overlayDiv = document.createElement('div');
  overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backgroundPath})`;
  overlayDiv.style.backgroundSize = 'cover';
  overlayDiv.style.backgroundPosition = 'center';
  overlayDiv.style.backgroundRepeat = 'no-repeat';
  overlayDiv.style.height = '100vh';
  overlayDiv.style.width = '100vw';
  overlayDiv.style.position = 'absolute';
  overlayDiv.style.top = '0';
  overlayDiv.style.left = '0';
  overlayDiv.style.zIndex = '-1';
  overlayDiv.style.opacity = '0.2';
  if (type === 'movie') {
    document.querySelector('#movie-details').appendChild(overlayDiv);
  } else {
    document.querySelector('#show-details').appendChild(overlayDiv);
  }
}

async function search() {
  const queryString = window.location.search;
  console.log(queryString);
  const urlParams = new URLSearchParams(queryString);
  console.log(urlParams.get('type'));
  global.search.type = urlParams.get('type');
  global.search.term = urlParams.get('search-term');
  if (global.search.term !== '' && global.search.term !== null) {
    const { results, total_pages, page, total_results } = await searchAPIData();
    global.search.page = page;
    global.search.totalPages = total_pages;
    global.search.totalResults = total_results;
    if (results.length === 0) {
      showAlert('Nenhum resultado encontrado');
      return;
    }
    displaySearchResults(results);
    document.querySelector('#search-term').value = '';
    console.log(results);
  } else {
    showAlert('Por favor preencha o campo de pesquisa.');
  }
}

function displaySearchResults(results) {
  document.querySelector('#search-results').innerHTML = '';
  document.querySelector('#search-results-heading').innerHTML = '';
  document.querySelector('#pagination').innerHTML = '';
  results.forEach((result) => {
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = `
          <a href="${global.search.type}-details.html?id=${result.id}">
              ${result.poster_path
        ? `<img
                src="https://image.tmdb.org/t/p/w500/${result.poster_path}"
                class="card-img-top"
                alt="${global.search.type === 'movie' ? result.title : result.name
        }"
              />`
        : `<img
                src="../images/no-image.jpg"
                class="card-img-top"
                alt="${global.search.type === 'movie' ? result.title : result.name
        }"
              />`
      }
            </a>
            <div class="card-body">
              <h5 class="card-title">${global.search.type === 'movie' ? result.title : result.name
      }</h5>
              <p class="card-text">
                <small class="text-muted">Lançado em: ${global.search.type === 'movie'
        ? new Date(result.release_date).toLocaleDateString('pt-BR')
        : result.first_air_date
      }</small>
              </p>
            </div>
            `;
    document.querySelector(
      '#search-results-heading'
    ).innerHTML = `<h2>${results.length} de ${global.search.totalResults} resultados para ${global.search.term}</h2>`;
    document.querySelector('#search-results').appendChild(div);
  });
  displayPagination();
}

function displayPagination() {
  const div = document.createElement('div');
  div.classList.add('pagination');
  div.innerHTML = `
          <div class="pagination">
          <button class="btn btn-primary" id="prev">Anterior</button>
          <button class="btn btn-primary" id="next">Próximo</button>
          <div class="page-counter">Página ${global.search.page} de ${global.search.totalPages} </div>
  `;
  document.querySelector('#pagination').appendChild(div);
  if (global.search.page === 1) {
    document.querySelector('#prev').disabled = true;
  }
  if (global.search.page === global.search.totalPages) {
    document.querySelector('#next').disabled = true;
  }
  document.querySelector('#next').addEventListener('click', async () => {
    global.search.page++;
    const { results, total_pages } = await searchAPIData();
    displaySearchResults(results);
  });
  document.querySelector('#prev').addEventListener('click', async () => {
    global.search.page--;
    const { results, total_pages } = await searchAPIData();
    displaySearchResults(results);
  });
}

async function displaySlider() {
  const { results } = await fetchAPIData('movie/now_playing');
  results.forEach((movie) => {
    const div = document.createElement('div');
    div.classList.add('swiper-slide');
    div.innerHTML = `
        <a href="movie-details.html?id=${movie.id}">
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title
      }" />
        </a>
        <h4 class="swiper-rating">
        <i class="fas fa-star text-secondary"></i> ${movie.vote_average.toFixed(
        1
      )} / 10
        </h4>`;
    console.log(results);
    document.querySelector('.swiper-wrapper').appendChild(div);
    initSwiper();
  });
}

function initSwiper() {
  const swiper = new Swiper('.swiper', {
    slidesPerView: 1,
    spaceBetween: 30,
    freeMode: true,
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    breakpoints: {
      500: {
        slidesPerView: 2,
      },
      700: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4,
      },
    },
  });
}

async function searchAPIData() {
  showSpinner();
  try {
    const params = new URLSearchParams({
      query: global.search.term,
      page: global.search.page,
    });
    const response = await fetch(
      `${global.api.apiUrl}search/${global.search.type}?${params}`
    );
    if (!response.ok) {
      throw new Error('Falha na requisição de busca');
    }
    const data = await response.json();
    hideSpinner();
    return data;
  } catch (error) {
    hideSpinner();
    showAlert('Erro na busca: ' + error.message);
    return { results: [], page: 1, total_pages: 0, total_results: 0 };
  }
}

function showSpinner() {
  document.querySelector('.spinner').classList.add('show');
}

function hideSpinner() {
  document.querySelector('.spinner').classList.remove('show');
}

function highlightActiveLink() {
  const links = document.querySelectorAll('.nav-link');
  const currentPath = window.location.pathname;
  let activePath = global.currentPage;
  if (currentPath.includes('movie-details.html')) {
    activePath = '/';
  } else if (currentPath.includes('tv-details.html')) {
    activePath = '/shows.html';
  }
  links.forEach((link) => {
    if (link.getAttribute('href') === activePath) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

function showAlert(message, classname = 'error') {
  const alertElement = document.createElement('div');
  alertElement.classList.add('alert', classname);
  alertElement.appendChild(document.createTextNode(message));
  document.querySelector('#alert').appendChild(alertElement);
  setTimeout(() => alertElement.remove(), 10000);
}

function addCommasToNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function init() {
  switch (global.currentPage) {
    case '/':
    case '/index.html':
      displaySlider();
      console.log('Home');
      displayPopularMovies();
      break;
    case '/shows.html':
      console.log('TV shows');
      displayPopularShows();
      break;
    case '/movie-details.html':
      console.log('Movie details');
      displayMovieDetails();
      break;
    case '/tv-details.html':
      console.log('TV details');
      displayShowDetails();
      break;
    case '/search.html':
      search();
      console.log('Search');
      break;
  }
  highlightActiveLink();
}

document.addEventListener('DOMContentLoaded', init);
