import FilmCardView from '../view/film-card.js';
import FilmPopupView from '../view/film-popup.js';
import {isEscEvent, remove, render, RenderPlace, replace} from '../utils/dom-utils.js';
import {CommentAction, UpdateType, UserAction} from '../utils/utils.js';
import {FilterType} from '../utils/filter-utils.js';
import {updateWatchingDate} from '../utils/film-utils.js';

export const State = {
  POSTING: 'POSTING',
  DELETING: 'DELETING',
  ABORTING: 'ABORTING',
};

export default class Film {
  constructor(filmListContainer, changeData, commentsModel, currentFilter, api, popupOpenHandler, popupCloseHandler) {
    this._filmListContainer = filmListContainer;
    this._popupOpenHandler = popupOpenHandler;
    this._popupCloseHandler = popupCloseHandler;
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
    this._handleCommentsLoad = this._handleCommentsLoad.bind(this);
  }

  init(film, containers, currentFilmID) {
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

    if (this._film.id === currentFilmID) {
      this._openPopupHandler();
      return;
    }

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

  _handleCommentsLoad() {
    this._popupComponent.getComments();
  }

  _handleCommentsAction(actionType, update, film) {
    switch (actionType) {
      case CommentAction.DELETE_COMMENT:
        this._api.deleteComment(update)
          .then(() => {
            const index = this._film.comments.findIndex((comment) => comment === update);
            this._film.comments = [
              ...this._film.comments.slice(0, index),
              ...this._film.comments.slice(index + 1),
            ];

            this._changeFilmData(
              UserAction.DELETE_COMMENT,
              UpdateType.MINOR_COMMENTS,
              Object.assign(
                {},
                this._film,
              ),
            );
            this._commentsModel.deleteComment(update);
          })
          .catch(() => {
            this.setViewState(State.ABORTING);
          });
        break;
      case CommentAction.ADD_COMMENT:
        this._api.addComment(update, film)
          .then((response) => {
            this._changeFilmData(
              UserAction.ADD_COMMENT,
              UpdateType.MINOR_COMMENTS,
              Object.assign(
                {},
                response.film,
              ),
            );

            this._commentsModel.addComment(response.comments);
          })
          .catch(() => {
            this.setViewState(State.ABORTING);
          });
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
        this._commentsModel.addObserver(this._handleCommentsLoad);
        this._commentsModel.setComments(comments);
      });
    render(document.body, this._popupComponent, RenderPlace.BEFOREEND);
    document.body.classList.add('hide-overflow');
    this._popupOpenHandler(this._film);
  }

  _handleClosePopupClick() {
    this._popupCloseHandler();
    remove(this._popupComponent);
    document.removeEventListener('keydown', this._closePopupOnKeyDownHandler);
    document.body.classList.remove('hide-overflow');
  }

  _closePopupOnKeyDownHandler() {
    this._handleClosePopupClick();

  }

  _closePopupOnClickHandler(evt) {
    evt.preventDefault();
    this._handleClosePopupClick();
  }

  destroy() {
    remove(this._filmComponent);
    remove(this._popupComponent);
  }

  setViewState(state) {
    const resetFormState = () => {
      this._popupComponent.updateData({
        isDisabled: false,
        isDeleting: false,
        isPosting: false,
      });

    };
    switch (state) {
      case State.POSTING:
        this._popupComponent.updateData({
          isDisabled: true,
          isPosting: true,
        });
        break;
      case State.DELETING:
        this._popupComponent.updateData({
          isDisabled: true,
          isDeleting: true,
        });
        break;
      case State.ABORTING:
        this._popupComponent.shake(resetFormState);

    }

  }
}
