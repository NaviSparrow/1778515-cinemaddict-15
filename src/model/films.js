import AbstractObserver from '../utils/abstract-observer.js';

export default class Films extends AbstractObserver {
  constructor() {
    super();
    this._films = [];
  }

  setFilms(films) {
    this._films = films.slice();
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
        ['comments']: comments,
        ['film_info']: {
          ['actors']: actors,
          ['age_rating']: ageRating,
          ['alternative_title']: originalTitle,
          ['description']: description,
          ['director']: director,
          ['genre']: genres,
          ['poster']: poster,
          ['release']: {
            ['date']: releaseDate,
            ['release_country']: country,
          },
          ['runtime']: duration,
          ['title']: title,
          ['total_rating']: rating,
          ['writers']: writers,
        },
        ['id']: id,
        ['user_details']: {
          ['already_watched']: isWatched,
          ['favorite']: isFavorite,
          ['watchlist']: isInWatchList,
          ['watching_date']: watchingDate,
        },
      });
  }

    return adaptedFilm;

  }
}
