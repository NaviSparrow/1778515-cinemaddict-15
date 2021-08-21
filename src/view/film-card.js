import { applyClassName } from '../utils/utils.js';
import AbstractView from './abstract.js';
import dayjs from 'dayjs';

const createFilmCardTemplate = (film) => {
  const {title, rating, year, duration, ganre, poster, description, comments, isAddtoWatchList, isWhatched, isFavorite} = film;
  const formatYear = dayjs(year).format('YYYY');
  const buttonClassName =  'film-card__controls-item--active';
  const watchListClassName = applyClassName(isAddtoWatchList, buttonClassName);
  const watchedClassName = applyClassName(isWhatched, buttonClassName);
  const favoriteClassName = applyClassName(isFavorite, buttonClassName);
  const fullDescription = description.join(' ');
  const getShortDescription = () => `${fullDescription.slice(0, 139)}...`;

  return `<article class="film-card">
    <h3 class="film-card__title">${title}</h3>
    <p class="film-card__rating">${rating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${formatYear}</span>
      <span class="film-card__duration">${duration}</span>
      <span class="film-card__genre">${ganre}</span>
    </p>
    <img src=${poster} alt="" class="film-card__poster">
    <p class="film-card__description">${fullDescription.length > 140 ? getShortDescription() : fullDescription}</p>
    <a class="film-card__comments">${comments} comments</a>
    <div class="film-card__controls">
      <button class="film-card__controls-item ${watchListClassName} film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
      <button class="film-card__controls-item ${watchedClassName} film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
      <button class="film-card__controls-item ${favoriteClassName} film-card__controls-item--favorite" type="button">Mark as favorite</button>
    </div>
  </article>`;
};

export default class FilmCard extends AbstractView {
  constructor(film) {
    super();
    this._film = film;
    this._clickHandler = this._clickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._addToWatchListClickHandler = this._addToWatchListClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  getTemplate() {
    return createFilmCardTemplate(this._film);
  }

  _watchedClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchedClick();
  }

  _addToWatchListClickHandler(evt) {
    evt.preventDefault();
    this._callback.addToWatchListClick();
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.openOnClick();
  }

  setClickHandler(callback) {
    this._callback.openOnClick = callback;
    this.getElement().querySelector('.film-card__title').addEventListener('click', this._clickHandler);
    this.getElement().querySelector('.film-card__poster').addEventListener('click', this._clickHandler);
    this.getElement().querySelector('.film-card__comments').addEventListener('click', this._clickHandler);
  }

  setWatchedClickHandler(callback) {
    this._callback.watchedClick = callback;
    this.getElement().querySelector('.film-card__controls-item--mark-as-watched')
      .addEventListener('click', this._watchedClickHandler);
  }

  setAddToWatchListClickHandler(callback) {
    this._callback.addToWatchListClick = callback;
    this.getElement().querySelector('.film-card__controls-item--add-to-watchlist')
      .addEventListener('click', this._addToWatchListClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector('.film-card__controls-item--favorite')
      .addEventListener('click', this._favoriteClickHandler);
  }
}
