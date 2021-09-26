import { formatDuration, formatYear } from '../utils/film-utils.js';
import AbstractFilmView from './abstract-film-view';

const SHORT_DESCRIPTION_SYMBOLS = 139;
const MAX_SYMBOLS = 140;

const createFilmCardTemplate = (film) => {
  const {title, rating, releaseDate, duration, genres, poster, description, comments, isInWatchList, isWatched, isFavorite} = film;
  const fullDescription = description;
  const getShortDescription = () => `${fullDescription.slice(0, SHORT_DESCRIPTION_SYMBOLS)}...`;

  return `<article class="film-card">
    <h3 class="film-card__title">${title}</h3>
    <p class="film-card__rating">${rating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${formatYear(releaseDate)}</span>
      <span class="film-card__duration">${formatDuration(duration)}</span>
      <span class="film-card__genre">${genres[0]}</span>
    </p>
    <img src=${poster} alt="" class="film-card__poster">
    <p class="film-card__description">${fullDescription.length > MAX_SYMBOLS ? getShortDescription() : fullDescription}</p>
    <a class="film-card__comments">${comments.length} comments</a>
    <div class="film-card__controls">
      <button class="film-card__controls-item ${isInWatchList ? 'film-card__controls-item--active' : ''} film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
      <button class="film-card__controls-item ${isWatched ? 'film-card__controls-item--active' : ''} film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
      <button class="film-card__controls-item ${isFavorite ? 'film-card__controls-item--active' : ''} film-card__controls-item--favorite" type="button">Mark as favorite</button>
    </div>
  </article>`;
};

export default class FilmCard extends AbstractFilmView {
  constructor(film) {
    super(film);
    this._clickHandler = this._clickHandler.bind(this);
  }

  getTemplate() {
    return createFilmCardTemplate(this._film);
  }

  setClickHandler(callback) {
    this._callback.openOnClick = callback;
    this.getElement().querySelector('.film-card__title').addEventListener('click', this._clickHandler);
    this.getElement().querySelector('.film-card__poster').addEventListener('click', this._clickHandler);
    this.getElement().querySelector('.film-card__comments').addEventListener('click', this._clickHandler);
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.openOnClick();
  }

  _getWatchedControl() {
    return this.getElement().querySelector('.film-card__controls-item--mark-as-watched');
  }

  _getAddToWatchListControl() {
    return this.getElement().querySelector('.film-card__controls-item--add-to-watchlist');
  }

  _getFavoriteControl() {
    return this.getElement().querySelector('.film-card__controls-item--favorite');
  }
}
