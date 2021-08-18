import FilmCardView from '../view/film-card.js';
import FilmPopupView from '../view/film-popup.js';
import {RenderPlace, render, remove, isEscEvent, replace} from '../utils/dom-utils.js';

export default class Film {
  constructor(filmListContainer) {
    this._filmListContainer = filmListContainer;

    this._filmComponent = null;
    this._popupComponent = null;

    this._closePopupHandler = this._closePopupHandler.bind(this);
    this._openPopupHandler = this._openPopupHandler.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);

  }

  init(film) {
    this._film = film;

    const prevFilmComponent = this._filmComponent;
    const prevPopupComponent = this._popupComponent;

    this._filmComponent = new FilmCardView(film);
    this._popupComponent = new FilmPopupView(film);

    this._filmComponent.setClickHandler(this._openPopupHandler);
    this._popupComponent.setClickHandler(this._closePopupHandler);

    if (prevFilmComponent === null || prevPopupComponent === null) {
      render(this._filmListContainer, this._filmComponent, RenderPlace.BEFOREEND);
      return;
    }

    if (this._filmListContainer.getElement().contains(prevFilmComponent.getElement())) {
      replace(this._filmComponent, prevFilmComponent);
    }

    if (this._filmListContainer.getElement().contains(prevPopupComponent.getElement())) {
      replace(this._popupComponent, prevPopupComponent);
    }

    remove(prevFilmComponent);
    remove(prevPopupComponent);
  }

  _closePopupHandler() {
    remove(this._popupComponent);
    document.body.classList.remove('hide-overflow');
  }

  _escKeyDownHandler(evt) {
    if (isEscEvent(evt)) {
      evt.preventDefault();
      this._closePopupHandler();
    }
  }

  _openPopupHandler() {
    render(document.body, this._popupComponent, RenderPlace.BEFOREEND);
    document.body.classList.add('hide-overflow');
    document.addEventListener('keydown', this._escKeyDownHandler, {once: true});
  }

  _destroy() {
    remove(this._filmComponent);
    remove(this._popupComponent);
  }
}
