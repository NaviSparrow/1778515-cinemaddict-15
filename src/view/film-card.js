import { applyClassName } from '../utils/utils.js';
import {createElement} from '../utils/dom-utils.js';
import dayjs from 'dayjs';

const createFilmCardTemplate = (filmCard) => {
  const {title, rating, year, duration, ganre, poster, description, comments, isAddtoWatchList, isWhatched, isFavorite} = filmCard;
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

export default class FilmCard {
  constructor(filmCard) {
    this._filmCard = filmCard;
    this._element = null;
  }

  getTemplate() {
    return createFilmCardTemplate(this._filmCard);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  returnElement() {
    this._element = null;
  }
}
