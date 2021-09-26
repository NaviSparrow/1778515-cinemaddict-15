import FilmCardView from '../view/film-card.js';
import FilmPopupView from '../view/film-popup.js';
import {remove, render, RenderPlace, replace} from '../utils/dom-utils.js';
import {CommentAction, deleteComment, UpdateType, UserAction} from '../utils/utils.js';
import {FilterType} from '../utils/filter-utils.js';
import {updateWatchingDate} from '../utils/film-utils.js';

export const State = {
  POSTING: 'POSTING',
  DELETING: 'DELETING',
  ABORTING: 'ABORTING',
};

const Mode = {
  DEFAULT: 'Default',
  POPUP: 'Popup',
};

export default class Film {
  constructor(container, changeData, popupOpenHandler, popupCloseHandler, commentsModel, currentFilter, api) {
    this._container = container;
    this._commentsModel = commentsModel;
    this._changeFilmData = changeData;
    this._currentFilter = currentFilter;
    this._api = api;

    this._mode = Mode.DEFAULT;
    this._popupOpenHandler = popupOpenHandler;
    this._popupCloseHandler = popupCloseHandler;

    this._filmComponent = null;
    this._popupComponent = null;
    this._scrollPosition = null;
    this._formState = {
      comment: '',
      emotion: null,
    };

    this.showPopup = this.showPopup.bind(this);

    this._handleWatchListClick = this._handleWatchListClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleFavoritesClick = this._handleFavoritesClick.bind(this);

    this._handleCommentsAction = this._handleCommentsAction.bind(this);
    this._handleCommentsLoad = this._handleCommentsLoad.bind(this);

    this._handleClosePopupClick = this._handleClosePopupClick.bind(this);
    this._closePopupOnKeyDownHandler = this._closePopupOnKeyDownHandler.bind(this);
    this._closePopupOnClickHandler = this._closePopupOnClickHandler.bind(this);
  }

  init(film, isJustPopup = false) {
    this._film = film;
    if (isJustPopup) {
      this._popupComponent = new FilmPopupView(this._film, this._handleCommentsAction);
      this._popupComponent.setAddToWatchListClickHandler(this._handleWatchListClick);
      this._popupComponent.setWatchedClickHandler(this._handleWatchedClick);
      this._popupComponent.setFavoriteClickHandler(this._handleFavoritesClick);
      this._popupComponent.setCloseClickHandler(this._closePopupOnClickHandler);
      this._formState = this._popupComponent.getNewCommentFormState();
      this._scrollPosition = this._popupComponent.getScrollPosition();
      return;
    }
    const prevFilmComponent = this._filmComponent;
    const prevPopupComponent = this._popupComponent;
    if (prevPopupComponent !== null) {
      this._formState = prevPopupComponent.getNewCommentFormState();
      this._scrollPosition = prevPopupComponent.getScrollPosition();
    }
    this._filmComponent = new FilmCardView(film);
    this._popupComponent = new FilmPopupView(this._film, this._handleCommentsAction);

    this._filmComponent.setClickHandler(this.showPopup);
    this._filmComponent.setAddToWatchListClickHandler(this._handleWatchListClick);
    this._filmComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._filmComponent.setFavoriteClickHandler(this._handleFavoritesClick);

    this._popupComponent.setAddToWatchListClickHandler(this._handleWatchListClick);
    this._popupComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._popupComponent.setFavoriteClickHandler(this._handleFavoritesClick);
    this._popupComponent.setCloseClickHandler(this._closePopupOnClickHandler);

    if (prevFilmComponent === null) {
      render(this._container, this._filmComponent);
    } else {
      replace(this._filmComponent, prevFilmComponent);
    }

    if (this._mode === Mode.POPUP) {
      this.showPopup();
    }
    remove(prevFilmComponent);
    remove(prevPopupComponent);
  }

  resetState() {
    this._mode = Mode.DEFAULT;
    this._popupComponent.getElement().remove();
  }

  destroy() {
    this._commentsModel.removeObserver(this._handleCommentsLoad);
    document.removeEventListener('keydown', this._closePopupOnKeyDownHandler);
    remove(this._filmComponent);
    remove(this._popupComponent);
  }

  getPopupScrollPosition() {
    if (this._popupComponent) {
      return this._popupComponent.getScrollPosition();
    }
  }

  getPopupFormState() {
    if (this._popupComponent) {
      return this._popupComponent.getNewCommentFormState();
    }
  }

  setPopupState(scroll, form) {
    this._scrollPosition = scroll;
    this._formState = form;
  }

  setViewState(state) {
    if (this._mode === Mode.DEFAULT) {
      return;
    }
    switch (state) {
      case State.POSTING:
        this._popupComponent.updateData({
          isDisabled: true,
          isPosting: true,
        }, this.getPopupScrollPosition());
        break;
      case State.DELETING:
        this._popupComponent.updateData({
          isDisabled: true,
          isDeleting: true,
        }, this.getPopupScrollPosition());
        break;
      case State.ABORTING:
        this._popupComponent.shake(() => this._popupComponent.updateData({
          isDisabled: false,
          isDeleting: false,
          isPosting: false,
        }));
    }
  }

  showPopup(isNotReopen = true) {
    if(isNotReopen) {
      this._popupOpenHandler(this._film.id);
    }
    this._mode = Mode.POPUP;

    render(document.body, this._popupComponent, RenderPlace.BEFOREEND);
    this._popupComponent.restoreForm(this._formState, this._scrollPosition);
    document.body.classList.add('hide-overflow');

    this._popupComponent.setCloseEscHandler(this._closePopupOnKeyDownHandler);
    this._commentsModel.addObserver(this._handleCommentsLoad);

    const modelComments = this._commentsModel.getComments();
    if (modelComments.length === 0 || !this._film.comments.includes(modelComments[0].id)) {
      this._api.getComments(this._film)
        .then((comments) => {
          this._commentsModel.setComments(comments,  this._scrollPosition);
        });
    } else {
      this._popupComponent.showComments(modelComments, this._scrollPosition);
      this._popupComponent.restoreForm(this._formState, this._scrollPosition);
    }
  }

  isPopupWatchedButtonActive() {
    const watchedButton = this._popupComponent.getElement().querySelector('.film-details__control-button--watched');
    return watchedButton.classList.contains('film-details__control-button--active');
  }

  isPopupWatchListButtonActive() {
    const watchListButton = this._popupComponent.getElement().querySelector('.film-details__control-button--watchlist');
    return watchListButton.classList.contains('film-details__control-button--active');
  }

  isPopupFavoritesButtonActive() {
    const favoritesButton = this._popupComponent.getElement().querySelector('.film-details__control-button--favorite');
    return favoritesButton.classList.contains('film-details__control-button--active');
  }

  _handleCommentsLoad() {
    if (this._mode === Mode.DEFAULT) {
      return;
    }
    const comments = this._commentsModel.getComments().filter((comment) => this._film.comments.includes(comment.id));
    this._popupComponent.showComments(comments, this.getPopupScrollPosition());
  }

  _handleCommentsAction(actionType, update, film) {
    switch (actionType) {
      case CommentAction.DELETE_COMMENT:
        this._api.deleteComment(update)
          .then(() => {
            this._commentsModel.deleteComment(update);
            this._film.comments = deleteComment(this._film.comments, update, true);
            this._changeFilmData(
              UserAction.DELETE_COMMENT,
              UpdateType.MINOR_COMMENTS,
              Object.assign(
                {},
                this._film,
              ),
            );
          })
          .catch(() => {
            this.setViewState(State.ABORTING);
          });
        break;
      case CommentAction.ADD_COMMENT:
        this._api.addComment(update, film)
          .then((response) => {
            this._commentsModel.addComment(response.comments[response.comments.length - 1]);
            this._changeFilmData(
              UserAction.ADD_COMMENT,
              UpdateType.MINOR_COMMENTS,
              Object.assign(
                {},
                response.film,
              ),
            );
          })
          .catch(() => {
            this.setViewState(State.ABORTING);
          });
        break;
    }
  }

  _handleWatchListClick(evt) {
    this._changeFilmData(
      UserAction.BUTTON_CLICK,
      this._currentFilter === FilterType.ALL ? UpdateType.PATCH : UpdateType.MINOR,
      Object.assign(
        {},
        this._film,
        {
          isInWatchList: !this._film.isInWatchList,
        },
      ), evt,
    );
  }

  _handleWatchedClick(evt) {
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
      ), evt,
    );
  }

  _handleFavoritesClick(evt) {
    this._changeFilmData(
      UserAction.BUTTON_CLICK,
      this._getCommentUpdateType(),
      Object.assign(
        {},
        this._film,
        {
          isFavorite: !this._film.isFavorite,
        },
      ), evt,
    );
  }

  _getCommentUpdateType() {
    return this._currentFilter === FilterType.ALL ? UpdateType.PATCH : UpdateType.MINOR;
  }

  _handleClosePopupClick() {
    this._mode = Mode.DEFAULT;
    remove(this._popupComponent);
    document.removeEventListener('keydown', this._closePopupOnKeyDownHandler);
    document.body.classList.remove('hide-overflow');
    this._popupCloseHandler();
  }

  _closePopupOnKeyDownHandler() {
    this._handleClosePopupClick();
  }

  _closePopupOnClickHandler(evt) {
    evt.preventDefault();
    this._handleClosePopupClick();
  }
}
