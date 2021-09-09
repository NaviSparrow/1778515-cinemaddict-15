import AbstractObserver from '../utils/abstract-observer.js';

export default class Films extends AbstractObserver {
  constructor() {
    super();
    this._films = [];
  }

  setFilms(updateType, films) {
    this._films = films.slice();

    this.notify(updateType);
  }

  getFilms() {
    return this._films;
  }

  updateFilm(updateType, update) {
    const index = this._films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    this._films = [
      ...this._films.slice(0, index),
      update,
      ...this._films.slice(index + 1),
    ];

    this.notify(updateType, update);
  }

  static adaptToClient(film) {
    const adaptedFilm = Object.assign(
      {},
      film,
      {
        comments: film['comments'],
        actors: film['film_info']['actors'],
        ageRating: film['film_info']['age_rating'],
        originalTitle: film['film_info']['alternative_title'],
        description: film['film_info']['description'],
        director: film['film_info']['director'],
        genres: film['film_info']['genre'],
        poster: film['film_info']['poster'],
        releaseDate: film['film_info']['release']['date'],
        country: film['film_info']['release']['release_country'],
        duration: film['film_info']['runtime'],
        title: film['film_info']['title'],
        rating: film['film_info']['total_rating'],
        writers:  film['film_info']['writers'],
        id: film['id'],
        isWatched: film['user_details']['already_watched'],
        isFavorite: film['user_details']['favorite'],
        isInWatchList: film['user_details']['watchlist'],
        watchingDate: film['user_details']['watching_date'],
      },
    );

    delete adaptedFilm['film_info'];
    delete adaptedFilm['user_details'];

    return adaptedFilm;
  }

  static adaptedToServer(film) {
    const adaptedFilm = Object.assign(
      {},
      film,
      {
        'comments': film.comments,
        'film_info': {
          'actors': film.actors,
          'age_rating': film.ageRating,
          'alternative_title': film.originalTitle,
          'description': film.description,
          'director': film.director,
          'genre': film.genres,
          'poster': film.poster,
          'release': {
            'date': film.releaseDate,
            'release_country': film.country,
          },
          'runtime': film.duration,
          'title': film.title,
          'total_rating': film.rating,
          'writers': film.writers,
        },
        'id': film.id,
        'user_details': {
          'already_watched': film.isWatched,
          'favorite': film.isFavorite,
          'watchlist': film.isInWatchList,
          'watching_date': film.watchingDate,
        },
      });
    delete adaptedFilm.isWatched;
    delete adaptedFilm.isFavorite;
    delete adaptedFilm.isInWatchList;

    return adaptedFilm;

  }
}
