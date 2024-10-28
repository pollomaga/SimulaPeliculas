const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5MjU5NDIyMWVhYjdhNTMyZjY4ZWFjZjQ4ZTQ4MDNjZSIsIm5iZiI6MTcyOTYzOTI0NS4wNzYwNDcsInN1YiI6IjY3MTdjYjc3MWUyMmQzZmI2YmJkNTZjYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.818sK98JtFcbPu7DyeOLh1F2KvfHa8bb5wifz_0FLH4'
  }
};

// Función para mostrar películas populares

function displayPopularMovies(movies) {
  const popularDiv = document.getElementById('popularMovies');
  popularDiv.innerHTML = `<div class="title-center">5 Películas más vistas</div>`;

  const moviesContainer = document.createElement('div');
  moviesContainer.style.display = 'flex';
  moviesContainer.style.flexWrap = 'wrap';
  moviesContainer.style.justifyContent = 'center';

  movies.forEach(movie => {
    const movieElement = document.createElement('div');
    movieElement.classList.add('p-2');

    const posterUrl = movie.poster_path
      ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
      : 'https://via.placeholder.com/150x225?text=No+Image';

    movieElement.innerHTML = `<img src="${posterUrl}" alt="${movie.title}" class="img-fluid" style="cursor:pointer;" 
      onclick="showDetails('movie', ${movie.id})"><br><br>
      <button style="display: block; margin: 0 auto;" onclick="toggleWatchlist({id: ${movie.id}, type: 'movie',
      title: '${movie.title}', poster_path: '${movie.poster_path || ''}'})">Agregar a Lista❤️</button>`;


    moviesContainer.appendChild(movieElement);
  });

  popularDiv.appendChild(moviesContainer);
}
// Función para mostrar series populares

function displayPopularSeries(series) {
  const popularDiv = document.getElementById('popularSeries');
  popularDiv.innerHTML = `<div class="title-center">5 Series más vistas</div>`;

  const seriesContainer = document.createElement('div');
  seriesContainer.style.display = 'flex';
  seriesContainer.style.flexWrap = 'wrap';
  seriesContainer.style.justifyContent = 'center';

  series.forEach(serie => {
    const serieElement = document.createElement('div');
    serieElement.classList.add('p-2');

    const posterUrl = serie.poster_path
      ? `https://image.tmdb.org/t/p/w500/${serie.poster_path}`
      : 'https://via.placeholder.com/150x225?text=No+Image';

    serieElement.innerHTML = `
      <img src="${posterUrl}" alt="${serie.name}" class="img-fluid"
      style="cursor:pointer;" onclick="showDetails('tv', ${serie.id})"><br><br>
      <button onclick="toggleWatchlist({id: ${serie.id}, type: 'tv', title: '${serie.name}', poster_path: '${serie.poster_path || ''}'})">Agregar a Lista❤️</button>
    `;

    seriesContainer.appendChild(serieElement);
  });

  popularDiv.appendChild(seriesContainer);
}



// Función para cargar géneros en un selector
async function loadGenres(type) {
  const genreUrl = `https://api.themoviedb.org/3/genre/${type}/list?language=en-US`;
  try {
    const response = await fetch(genreUrl, options);
    const data = await response.json();

    const genreSelect = document.getElementById('genreSelect');
    genreSelect.innerHTML = ''; // Limpiar opciones anteriores

    data.genres.forEach(genre => {
      const option = document.createElement('option');
      option.value = genre.id;
      option.textContent = genre.name;
      genreSelect.appendChild(option);
    });
  } catch (error) {
    console.error(error);
    alert('No se pudieron cargar los géneros.');
  }
}

// Función para obtener las más vistas por género y mostrar en contenedores específicos
async function getMostPopularByGenre(type) {
  const genreId = document.getElementById('genreSelect').value;
  if (!genreId) {
    alert('Selecciona un género primero.');
    return;
  }

  const url = `https://api.themoviedb.org/3/discover/${type}?with_genres=${genreId}&sort_by=popularity.desc&language=en-US&page=1`;

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    const resultsContainer = type === 'movie' ? document.getElementById('genreMovies') : document.getElementById('genreSeries');
    resultsContainer.innerHTML = ''; // Limpiar resultados anteriores

    if (type === 'movie') {
      displayPopularMoviesInContainer(data.results.slice(0, 5), resultsContainer);
    } else {
      displayPopularSeriesInContainer(data.results.slice(0, 5), resultsContainer);
    }
  } catch (error) {
    console.error(error);
    alert('No se pudieron cargar los resultados.');
  }
}

function displayPopularMoviesInContainer(movies, container) {
 
  container.innerHTML = ''; // Esto eliminará cualquier contenido anterior

  // Crear contenedor para las películas
  const moviesContainer = document.createElement('div');
  moviesContainer.style.display = 'flex';
  moviesContainer.style.flexWrap = 'wrap';
  moviesContainer.style.justifyContent = 'center';

  movies.forEach(movie => {
    const movieElement = document.createElement('div');
    movieElement.classList.add('p-2');
    movieElement.style.flex = '0 0 100px'; 

    const posterUrl = movie.poster_path
      ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
      : 'https://via.placeholder.com/150x225?text=No+Image';

    movieElement.innerHTML = `
      <img src="${posterUrl}" alt="${movie.title}" class="img-fluid" style="cursor:pointer;"
      onclick="showDetails('movie', ${movie.id})"><br><br>
      <button onclick="toggleWatchlist({id: ${movie.id}, type: 'movie', title: '${movie.title}', poster_path: '${movie.poster_path || ''}'})">Agregar a Lista❤️</button>`;

    moviesContainer.appendChild(movieElement);
  });

  // Agregar el contenedor de películas al contenedor principal
  container.appendChild(moviesContainer);
}

function displayPopularSeriesInContainer(series, container) {
  
  container.innerHTML = ''; // Esto eliminará cualquier contenido anterior

  // Crear contenedor para las series
  const seriesContainer = document.createElement('div');
  seriesContainer.style.display = 'flex';
  seriesContainer.style.flexWrap = 'wrap';
  seriesContainer.style.justifyContent = 'center';

  series.forEach(serie => {
    const serieElement = document.createElement('div');
    serieElement.classList.add('p-2');
    serieElement.style.flex = '0 0 100px'; // Ajusta el tamaño según sea necesario

    const posterUrl = serie.poster_path
      ? `https://image.tmdb.org/t/p/w500/${serie.poster_path}`
      : 'https://via.placeholder.com/150x225?text=No+Image';

    serieElement.innerHTML = `
      <img src="${posterUrl}" alt="${serie.name}" class="img-fluid" style="cursor:pointer;"
      onclick="showDetails('tv', ${serie.id})"><br><br>
      <button onclick="toggleWatchlist({id: ${serie.id}, type: 'tv', title: '${serie.name}', poster_path: '${serie.poster_path || ''}'})">Agregar a Lista❤️</button>`;

    seriesContainer.appendChild(serieElement);
  });

  // Agregar el contenedor de series al contenedor principal
  container.appendChild(seriesContainer);
}


// Función para mostrar detalles en un modal

async function showDetails(type, id) {
  const url = `https://api.themoviedb.org/3/${type}/${id}?language=en-US&append_to_response=credits,videos`;

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');

    modalTitle.innerHTML = `${type === 'movie' ? data.title : data.name}`;

    const posterUrl = data.poster_path
      ? `https://image.tmdb.org/t/p/w500/${data.poster_path}`
      : 'https://via.placeholder.com/150x225?text=No+Image';

    const genres = data.genres.map(genre => genre.name).join(', ');

    const duration = type === 'movie'
      ? `<p><strong>Duración:</strong> ${data.runtime} minutos</p>`
      : `<p><strong>Episodios:</strong> ${data.number_of_episodes}</p>`;

    const productionCompanies = data.production_companies.map(company => company.name).join(', ');

    const rating = data.vote_average ? `${data.vote_average}/10` : 'No disponible';

    const cast = data.credits && data.credits.cast.length > 0
      ? data.credits.cast.slice(0, 5).map(actor => actor.name).join(', ')
      : 'No disponible';

    // Obtener el tráiler
    const trailer = data.videos.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
    const trailerKey = trailer ? trailer.key : null;

    modalBody.innerHTML = `
      <div class="row">
        <div class="col-md-4">
          <img src="${posterUrl}" alt="${type === 'movie' ? data.title : data.name}" class="img-fluid mb-3">
        </div>
        <div class="col-md-8">
          <p><strong>Año:</strong> ${type === 'movie' ? data.release_date : data.first_air_date}</p>
          <p><strong>Género:</strong> ${genres}</p>
          ${duration}
          <p><strong>Calificación:</strong> ${rating}</p>
          <p><strong>Productoras:</strong> ${productionCompanies}</p>
          <p><strong>Reparto principal:</strong> ${cast}</p>
          <p><strong>Resumen:</strong> ${data.overview}</p>
          ${trailerKey ? `<p><strong>Tráiler:</strong> <button class="btn btn-primary" onclick="showTrailer('${trailerKey}')">Ver tráiler</button></p>` : '<p><strong>Tráiler:</strong> No disponible</p>'}
        </div>
      </div>
    `;

    const modal = new bootstrap.Modal(document.getElementById('detailsModal'));
    modal.show();
  } catch (error) {
    console.error(error);
    alert('Hubo un error al cargar los detalles. Intenta nuevamente.');
  }
}

// Despues de Obtener el trailer lo muestro
function showTrailer(trailerKey) {
  const trailerIframe = document.getElementById('trailerIframe');
  trailerIframe.src = `https://www.youtube.com/embed/${trailerKey}?autoplay=1`;

  const trailerModal = new bootstrap.Modal(document.getElementById('trailerModal'));
  trailerModal.show();

  // Detener la reproducción cuando se cierra el modal
  trailerModal._element.addEventListener('hidden.bs.modal', function () {
    trailerIframe.src = ''; // Reiniciar el src para detener el video
  });
}

// Función para obtener películas populares
async function getMostPopularMovies() {
  showLoadingIndicator('popularMovies');

  try {
    const response = await fetch('https://api.themoviedb.org/3/movie/popular?language=en-US&page=1', options);
    const data = await response.json();
    displayPopularMovies(data.results.slice(0, 5)); // Mostrar 5 películas
  } catch (error) {
    console.error(error);
    alert('No se pudieron cargar las películas populares.');
  }
}

// Función para obtener series populares
async function getMostPopularSeries() {
  showLoadingIndicator('popularSeries');

  try {
    const response = await fetch('https://api.themoviedb.org/3/tv/popular?language=en-US&page=1', options);
    const data = await response.json();
    displayPopularSeries(data.results.slice(0, 5)); // Mostrr 5 series
  } catch (error) {
    console.error(error);
    alert('No se pudieron cargar las series populares.');
  }
}

// Función para buscar por título o actor
async function search() {
  const searchInput = document.getElementById('searchInput').value.trim();
  const searchType = document.getElementById('searchType').value;

  if (searchInput === '') {
    alert('Por favor, introduce un término de búsqueda');
    return;
  }

  showLoadingIndicator('results'); // Mostrar indicador de carga mientras se realiza la búsqueda

  let url = '';
  if (searchType === 'movie') {
    url = `https://api.themoviedb.org/3/search/movie?query=${searchInput}&language=en-US&page=1`;
  } else if (searchType === 'tv') {
    url = `https://api.themoviedb.org/3/search/tv?query=${searchInput}&language=en-US&page=1`;
  } else if (searchType === 'actor') {
    url = `https://api.themoviedb.org/3/search/person?query=${searchInput}&language=en-US&page=1`;
  }

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (data.results.length === 0) {
      displayNoResults();
    } else {
      if (searchType === 'actor') {
        displayActorResults(data.results);
      } else {
        displaySearchResults(data.results, searchType);
      }
    }
  } catch (error) {
    console.error(error);
    alert('Hubo un error al realizar la búsqueda. Intenta nuevamente.');
  }
}

// Mostrar resultados de búsqueda (películas o series)
function displaySearchResults(results, type) {
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = `<h3>Resultados de búsqueda (${type === 'movie' ? 'Películas' : 'Series'})</h3>`;

  results.forEach(result => {
    const resultElement = document.createElement('div');
    resultElement.classList.add('p-2');

    const posterUrl = result.poster_path
      ? `https://image.tmdb.org/t/p/w500/${result.poster_path}`
      : 'https://via.placeholder.com/150x225?text=No+Image';

    resultElement.innerHTML = `
      <img src="${posterUrl}" alt="${type === 'movie' ? result.title : result.name}" class="img-fluid"
      style="cursor:pointer;" onclick="showDetails('${type}', ${result.id})">
      <br><br>
      <button onclick="toggleWatchlist({
        id: ${result.id}, 
        type: '${type}', 
        title: '${type === 'movie' ? result.title : result.name}', 
        poster_path: '${result.poster_path || ''}'
      })">Agregar a Lista❤️</button>
    `;

    resultsDiv.appendChild(resultElement);
  });
}


async function getMostPopularByGenre(type) {
  const genreId = document.getElementById('genreSelect').value;
  if (!genreId) {
    alert('Selecciona un género primero.');
    return;
  }

  const url = `https://api.themoviedb.org/3/discover/${type}?with_genres=${genreId}&sort_by=popularity.desc&language=en-US&page=1`;

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    // Selecciona el contenedor específico para películas o series
    const container = type === 'movie' ? document.getElementById('genreMoviesContainer') : document.getElementById('genreSeriesContainer');
    container.innerHTML = ''; // Limpia el contenedor antes de agregar nuevos resultados

    if (type === 'movie') {
      displayPopularMoviesInContainer(data.results.slice(0, 5), container); // Usar contenedor específico
    } else {
      displayPopularSeriesInContainer(data.results.slice(0, 5), container); // Usar contenedor específico
    }
  } catch (error) {
    console.error(error);
    alert('No se pudieron cargar los resultados.');
  }
}


//////////////////////////////////////////////////////////////////////////////////////////////

// Mostrar resultados de búsqueda de actores
function displayActorResults(actors) {
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '<h3>Resultados de búsqueda (Actores)</h3>';

  actors.forEach(actor => {
    const actorElement = document.createElement('div');
    actorElement.classList.add('p-2');

    actorElement.innerHTML = `<p><strong>${actor.name}</strong></p>`;
    actor.known_for.forEach(item => {
      const posterUrl = item.poster_path
        ? `https://image.tmdb.org/t/p/w500/${item.poster_path}`
        : 'https://via.placeholder.com/150x225?text=No+Image';

      actorElement.innerHTML += `
        <img src="${posterUrl}" alt="${item.title || item.name}" class="img-fluid" style="cursor:pointer;"
        onclick="showDetails('${item.media_type}', ${item.id})">
      `;
    });

    resultsDiv.appendChild(actorElement);
  });
}

// Función para mostrar indicador de carga
function showLoadingIndicator(containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = `
    <div class="loading-spinner"></div>
  `;
}

// Array para almacenar en favoritos
let watchlist = [];

// Función para agregar o eliminar de la lista de favoritos
function toggleWatchlist(movieOrSeries) {
  const index = watchlist.findIndex(item => item.id === movieOrSeries.id && item.type === movieOrSeries.type);

  if (index > -1) {
    // Si ya está en la lista, eliminarla
    watchlist.splice(index, 1);
    Swal.fire({
      title: 'Eliminado de la lista de favoritos',
      text: `${movieOrSeries.title || movieOrSeries.name}`,
      icon: 'success',
      confirmButtonText: 'Aceptar'
    });
  } else {
    // Si no está en la lista, agregarla
    watchlist.push(movieOrSeries);
    Swal.fire({
      title: 'Agregado a la lista de favoritos',
      text: `${movieOrSeries.title || movieOrSeries.name}`,
      icon: 'success',
      confirmButtonText: 'Aceptar'
    });
  }

  displayWatchlist(); // Actualizar la visualización de la lista
}


// Función para mostrar la lista de favoritos
function displayWatchlist() {
  const wishlistContainer = document.getElementById('wishlistContainer');
  wishlistContainer.innerHTML = ''; // Limpiar el contenedor

  if (watchlist.length === 0) {
    wishlistContainer.innerHTML = '<p>No hay elementos en la lista de favoritos.</p>';
    return;
  }

  watchlist.forEach(item => {
    const itemElement = document.createElement('div');
    itemElement.classList.add('wishlist-item');

    const posterUrl = item.poster_path
      ? `https://image.tmdb.org/t/p/w500/${item.poster_path}`
      : 'https://via.placeholder.com/150x225?text=No+Image';

    itemElement.innerHTML = `
      <img src="${posterUrl}" alt="${item.title || item.name}" class="img-fluid" style="width: 100px;">
      <span>${item.title || item.name}</span>
      <button onclick="toggleWatchlist({id: ${item.id}, type: '${item.type}', title: '${item.title || item.name}', poster_path: '${item.poster_path || ''}'})">Eliminar</button>
    `;

    wishlistContainer.appendChild(itemElement);
  });
}


// Función para mostrar cuando no hay resultados
function displayNoResults() {
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = `<p class="no-results">No se encontraron resultados.</p>`;
}

// Llamar las funciones al cargar la página
window.onload = function () {
  loadGenres('movie');
  getMostPopularMovies();
  getMostPopularSeries();
};
