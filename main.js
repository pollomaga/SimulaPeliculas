const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5MjU5NDIyMWVhYjdhNTMyZjY4ZWFjZjQ4ZTQ4MDNjZSIsIm5iZiI6MTcyOTYzOTI0NS4wNzYwNDcsInN1YiI6IjY3MTdjYjc3MWUyMmQzZmI2YmJkNTZjYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.818sK98JtFcbPu7DyeOLh1F2KvfHa8bb5wifz_0FLH4'
    }
  };
  
  
// Función para mostrar películas populares (solo pósters)
function displayPopularMovies(movies) {
  const popularDiv = document.getElementById('popularMovies');
  
  // Limpiamos el contenido anterior
  popularDiv.innerHTML = `
    <div style="text-align: center; margin-bottom: 20px;">
      <h3 style="font-size: 24px; font-weight: bold;">10 Películas más vistas</h3>
    </div>
  `;

  // Creamos un contenedor para las películas
  const moviesContainer = document.createElement('div');
  moviesContainer.style.display = 'flex';
  moviesContainer.style.flexWrap = 'wrap';
  moviesContainer.style.justifyContent = 'center';  // Para centrar los posters
  
  // Iteramos sobre las películas para crear los elementos correspondientes
  movies.forEach(movie => {
    const movieElement = document.createElement('div');
    movieElement.classList.add('p-2'); // Clase de padding (bootstrap o custom)
    
    // Definimos la URL del póster (o un placeholder si no hay imagen disponible)
    const posterUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}` : 'https://via.placeholder.com/150x225?text=No+Image';

    // Insertamos el póster de la película
    movieElement.innerHTML = `
      <img src="${posterUrl}" alt="${movie.title}" class="img-fluid" 
      style="cursor:pointer; margin: 10px; max-width: 150px;" 
      onclick="showDetails('movie', ${movie.id})">
    `;

    // Añadimos cada película al contenedor de películas
    moviesContainer.appendChild(movieElement);
  });

  // Añadimos el contenedor de películas debajo del título
  popularDiv.appendChild(moviesContainer);
}


// Función para mostrar series populares (solo pósters)
function displayPopularSeries(series) {
  const popularDiv = document.getElementById('popularSeries');
  popularDiv.innerHTML = `
    <div style="text-align: center;">
      <h3>10 Series más vistas</h3>
    </div>
    <div style="margin-bottom: 20px;"></div> <!-- Salto de línea visual -->
  `;

  const seriesContainer = document.createElement('div');
  seriesContainer.style.display = 'flex';
  seriesContainer.style.flexWrap = 'wrap';
  seriesContainer.style.justifyContent = 'center';  // Para centrar los posters

  series.forEach(serie => {
    const serieElement = document.createElement('div');
    serieElement.classList.add('p-2');

    const posterUrl = serie.poster_path ? `https://image.tmdb.org/t/p/w500/${serie.poster_path}` : 'https://via.placeholder.com/150x225?text=No+Image';

    serieElement.innerHTML = `
      <img src="${posterUrl}" alt="${serie.name}" class="img-fluid" style="cursor:pointer; margin: 10px;" onclick="showDetails('tv', ${serie.id})">
    `;
    seriesContainer.appendChild(serieElement);
  });

  popularDiv.appendChild(seriesContainer);
}


  
  // Función para mostrar detalles en un modal ajustado con más información
async function showDetails(type, id) {
  const url = `https://api.themoviedb.org/3/${type}/${id}?language=en-US&append_to_response=credits`;

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');

    // Detalles del título (película o serie)
    modalTitle.innerHTML = `${type === 'movie' ? data.title : data.name}`;

    const posterUrl = data.poster_path
      ? `https://image.tmdb.org/t/p/w500/${data.poster_path}`
      : 'https://via.placeholder.com/150x225?text=No+Image';

    // Obtener géneros
    const genres = data.genres.map(genre => genre.name).join(', ');

    // Duración (película) o número de episodios (serie)
    const duration = type === 'movie'
      ? `<p><strong>Duración:</strong> ${data.runtime} minutos</p>`
      : `<p><strong>Episodios:</strong> ${data.number_of_episodes}</p>`;

    // Productoras
    const productionCompanies = data.production_companies.map(company => company.name).join(', ');

    // Calificación
    const rating = data.vote_average ? `${data.vote_average}/10` : 'No disponible';

    // Reparto principal (máx. 5 actores)
    const cast = data.credits && data.credits.cast.length > 0
      ? data.credits.cast.slice(0, 5).map(actor => actor.name).join(', ')
      : 'No disponible';

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
        </div>
      </div>
    `;

    const modal = new bootstrap.Modal(document.getElementById('detailsModal'));
    modal.show();
  } catch (error) {
    console.error(error);
  }
}

  
  // Función para obtener las 10 películas más populares
  async function getMostPopularMovies() {
    try {
      const response = await fetch('https://api.themoviedb.org/3/movie/popular?language=en-US&page=1', options);
      const data = await response.json();
      displayPopularMovies(data.results.slice(0, 10)); // Limitar a 10 películas
    } catch (error) {
      console.error(error);
    }
  }
  
  // Función para obtener las 10 series más populares
  async function getMostPopularSeries() {
    try {
      const response = await fetch('https://api.themoviedb.org/3/tv/popular?language=en-US&page=1', options);
      const data = await response.json();
      displayPopularSeries(data.results.slice(0, 10)); // Limitar a 10 series
    } catch (error) {
      console.error(error);
    }
  }
  
  // Función para buscar por título o actor
  async function search() {
    const searchInput = document.getElementById('searchInput').value;
    const searchType = document.getElementById('searchType').value;
  
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
  
      if (searchType === 'actor') {
        displayActorResults(data.results);
      } else {
        displaySearchResults(data.results, searchType);
      }
    } catch (error) {
      console.error(error);
    }
  }
  
  // Función para mostrar resultados de búsqueda
  function displaySearchResults(results, type) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `<h3>Resultados de búsqueda (${type === 'movie' ? 'Películas' : 'Series'})</h3>`;
  
    results.forEach(result => {
      const resultElement = document.createElement('div');
      resultElement.classList.add('p-2');
  
      const posterUrl = result.poster_path ? `https://image.tmdb.org/t/p/w500/${result.poster_path}` : 'https://via.placeholder.com/150x225?text=No+Image';
  
      resultElement.innerHTML = `
        <img src="${posterUrl}" alt="${type === 'movie' ? result.title : result.name}" class="img-fluid" style="cursor:pointer;" onclick="showDetails('${type}', ${result.id})">
      `;
      resultsDiv.appendChild(resultElement);
    });
  }
  
  // Función para mostrar actores y sus películas/series
  function displayActorResults(actors) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '<h3>Resultados de búsqueda (Actores)</h3>';
  
    actors.forEach(actor => {
      const actorElement = document.createElement('div');
      actorElement.classList.add('p-2');
  
      actorElement.innerHTML = `
        <p><strong>${actor.name}</strong></p>
      `;
      actor.known_for.forEach(item => {
        const posterUrl = item.poster_path ? `https://image.tmdb.org/t/p/w500/${item.poster_path}` : 'https://via.placeholder.com/150x225?text=No+Image';
        actorElement.innerHTML += `
          <img src="${posterUrl}" alt="${item.title || item.name}" class="img-fluid" style="cursor:pointer;" onclick="showDetails('${item.media_type}', ${item.id})">
        `;
      });
  
      resultsDiv.appendChild(actorElement);
    });
  }
  
  // Llamar las funciones automáticamente al cargar la página
window.onload = function() {
  getMostPopularMovies();
  getMostPopularSeries();
};

// Función para obtener las 10 series más populares
async function getMostPopularSeries() {
  try {
    const response = await fetch('https://api.themoviedb.org/3/tv/popular?language=en-US&page=1', options);
    const data = await response.json();
    displayPopularSeries(data.results.slice(0, 10)); // Limitar a 10 series
  } catch (error) {
    console.error(error);
  }
}
