import FilmCardView from '../view/film-card.js';
import FilmPopupView from '../view/film-popup.js';
import {RenderPlace, render, remove, replace, isEscEvent} from '../utils/dom-utils.js';
import {CommentAction, UpdateType, UserAction} from '../utils/utils.js';
import {FilterType} from '../utils/filter-utils.js';
import {updateWatchingDate} from '../utils/film-utils.js';

export default class Film {
  constructor(filmListContainer, changeData, commentsModel, currentFilter, api) {
    this._filmListContainer = filmListContainer;
    this._commentsModel = commentsModel;
    this._changeFilmData = changeData;
    this._currentFilter = currentFilter;
    this._api = api;

    this._filmComponent = null;
    this._popupComponent = null;

    this._openPopupHandler = this._openPopupHandler.bind(this);
    this._handleWatchListClick = this._handleWatchListClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleFavoritesClick = this._handleFavoritesClick.bind(this);
    this._handleCommentsAction = this._handleCommentsAction.bind(this);
    this._handleClosePopupClick = this._handleClosePopupClick.bind(this);
    this._closePopupOnKeyDownHandler = this._closePopupOnKeyDownHandler.bind(this);
    this._closePopupOnClickHandler = this._closePopupOnClickHandler.bind(this);
  }

  init(film, containers) {
    this._film = film;
    const prevFilmComponent = this._filmComponent;

    this._filmComponent = new FilmCardView(film);
    this._popupComponent = new FilmPopupView(this._film, this._changeFilmData, this._handleCommentsAction, this._currentFilter, this._commentsModel);


    this._filmComponent.setClickHandler(this._openPopupHandler);
    this._filmComponent.setAddToWatchListClickHandler(this._handleWatchListClick);
    this._filmComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._filmComponent.setFavoriteClickHandler(this._handleFavoritesClick);

    this._popupComponent.setCloseClickHandler(this._closePopupOnClickHandler);
    this._popupComponent.setCloseEscHandler(this._closePopupOnKeyDownHandler);

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

  _handleCommentsAction(actionType, update) {
    switch (actionType) {
      case CommentAction.DELETE:
        this._film.comments = [
          ...this._film.comments.slice(0, update),
          ...this._film.comments.slice(update + 1),
        ];
        this._changeFilmData(
          UserAction.DELETE_COMMENT,
          UpdateType.MINOR_COMMENTS,
          Object.assign({}, this._film),
        );
        break;
      case CommentAction.LOAD:
        this._popupComponent.getComments();
        break;
    }
  }

  _handleWatchListClick() {
    this._changeFilmData(
      UserAction.BUTTON_CLICK,
      this._currentFilter === FilterType.ALL ? UpdateType.PATCH : UpdateType.MINOR,
      Object.assign(
        {},
        this._film,
        {
          isInWatchList: !this._film.isInWatchList,
        },
      ),
    );
  }

  _handleWatchedClick() {
    const watchingDate = updateWatchingDate(this._film);
    this._changeFilmData(
      UserAction.BUTTON_CLICK,
      this._currentFilter === FilterType.ALL ? UpdateType.PATCH : UpdateType.MINOR,
      Object.assign(
        {},
        this._film,
        {
          isWatched: !this._film.isWatched,
          watchingDate,
        },
      ),
    );
  }

  _handleFavoritesClick() {
    this._changeFilmData(
      UserAction.BUTTON_CLICK,
      this._currentFilter === FilterType.ALL ? UpdateType.PATCH : UpdateType.MINOR, //TODO поменять на isFilterTypeAll
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
    this._api.getComments(this._film)
      .then((comments) => {
        this._commentsModel.addObserver(this._handleCommentsAction);
        this._commentsModel.setComments(CommentAction.LOAD, comments);
      });

    render(document.body, this._popupComponent, RenderPlace.BEFOREEND);
    document.body.classList.add('hide-overflow');
  }

  _handleClosePopupClick() {
    remove(this._popupComponent);
    document.removeEventListener('keydown', this._closePopupOnKeyDownHandler);
  }

  _closePopupOnKeyDownHandler(evt) {
    if (isEscEvent(evt)) {
      this._handleClosePopupClick();
      document.body.classList.remove('hide-overflow');
    }
  }

  _closePopupOnClickHandler(evt) {
    evt.preventDefault();
    this._handleClosePopupClick();
  }

  destroy() {
    remove(this._filmComponent);
    remove(this._popupComponent);
  }
}
