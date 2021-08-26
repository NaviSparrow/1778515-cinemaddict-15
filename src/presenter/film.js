import FilmCardView from '../view/film-card.js';
import FilmPopupView from '../view/film-popup.js';
import {RenderPlace, render, remove, replace} from '../utils/dom-utils.js';

export default class Film {
  constructor(filmListContainer, changeData) {
    this._filmListContainer = filmListContainer;
    this._changeData = changeData;

    this._filmComponent = null;
    this._popupComponent = null;

    this._openPopupHandler = this._openPopupHandler.bind(this);
    this._handleWatchListClick = this._handleWatchListClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleFavoritesClick = this._handleFavoritesClick.bind(this);
  }

  init(film, containers) {
    this._film = film;
    const prevFilmComponent = this._filmComponent;

    this._filmComponent = new FilmCardView(film);
    this._popupComponent = new FilmPopupView(film);

    this._filmComponent.setClickHandler(this._openPopupHandler);
    this._filmComponent.setAddToWatchListClickHandler(this._handleWatchListClick);
    this._filmComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._filmComponent.setFavoriteClickHandler(this._handleFavoritesClick);

    if (prevFilmComponent === null) {
      render(this._filmListContainer, this._filmComponent, RenderPlace.BEFOREEND);
      return;
    }

    for (const container of containers.values()) {
      if (container.contains(prevFilmComponent.getElement())) {
        replace(this._filmComponent, prevFilmComponent);
      }
    }
    remove(prevFilmComponent);
  }

  _handleWatchListClick() {
    this._changeData(
      Object.assign(
        {},
        this._film,
        {
          isAddToWatchList: !this._film.isAddToWatchList,
        },
      ),
    );
  }

  _handleWatchedClick() {
    this._changeData(
      Object.assign(
        {},
        this._film,
        {
          isWatched: !this._film.isWatched,
        },
      ),
    );
  }

  _handleFavoritesClick() {
    this._changeData(
      Object.assign(
        {},
        this._film,
        {
          isFavorite: !this._film.isFavorite,
        },
      ),
    );
  }

  _isPopUpExist() {
    return Boolean(document.body.querySelector('.film-details'));
  }

  _removePopUp() {
    document.body.removeChild(document.body.querySelector('.film-details'));
  }

  _openPopupHandler() {
    if (this._isPopUpExist()) {
      this._removePopUp();
    }
    render(document.body, this._popupComponent, RenderPlace.BEFOREEND);
    document.body.classList.add('hide-overflow');

  }

  destroy() {
    remove(this._filmComponent);
    remove(this._popupComponent);
  }
}
