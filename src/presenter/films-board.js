import FilmsSectionView from '../view/films-section.js';
import FilmsListView from '../view/films-list.js';
import FilmPresenter, {State as FilmPresenterViewState} from './film';
import ShowMoreButtonView from '../view/show-more-button.js';
import SortView from '../view/sort.js';
import NoFilmsView from '../view/no-films';
import LoadingView from '../view/loading.js';
import UserProfileView from '../view/user-profile.js';
import {remove, render} from '../utils/dom-utils.js';
import {filter, FilterType} from '../utils/filter-utils.js';
import {FilmsCount, sortByDate, sortByRating, SortType, UpdateType, UserAction, ButtonName, isJustPopup} from '../utils/utils.js';

const CARDS_PER_STEP = 5;

export default class FilmsBoard {
  constructor(boardContainer, profileRatingContainer, filmsModel, filterModel, commentsModel, api) {
    this._boardContainer = boardContainer;
    this._profileRatingContainer = profileRatingContainer;

    this._filmsModel = filmsModel;
    this._filterModel = filterModel;
    this._commentsModel = commentsModel;
    this._api = api;

    this._currentSortType = SortType.BY_DEFAULT;
    this._filterType = FilterType.ALL;

    this._renderedFilmsCount = CARDS_PER_STEP;

    this._boardFilmPresenter = new Map();

    this._isLoading = true;
    this._isJustPopup = false;
    this._currentFilmId = null;
    this._currentFilm = null;
    this._poppScroll = null;
    this._popupForm = null;
    this._clickEvent = null;

    this._filmsSectionComponent = new FilmsSectionView();
    this._filmsListComponent = new FilmsListView();
    this._loadingComponent = new LoadingView();
    this._sortComponent = null;
    this._showMoreButtonComponent = null;
    this._userProfileComponent = null;

    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleSortTypeClick = this._handleSortTypeClick.bind(this);
    this._popupOpenHandler = this._popupOpenHandler.bind(this);
    this._popupCloseHandler = this._popupCloseHandler.bind(this);
    this._setFilmPresenterState = this._setFilmPresenterState.bind(this);
    this._updateUserProfile = this._updateUserProfile.bind(this);
  }

  init() {
    this._filterModel.addObserver(this._handleModelEvent);
    this._filmsModel.addObserver(this._handleModelEvent);
    this._renderBoard();
  }

  destroy() {
    this._clearBoard({resetRenderedTaskCount: true, resetSortType: true});

    remove(this._filmsListComponent);
    remove(this._filmsSectionComponent);
    this._filmsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  _reopenPopup() {
    const boardPresenter = this._boardFilmPresenter.get(this._currentFilmId);
    if (boardPresenter) {
      boardPresenter.setPopupState(this._poppScroll, this._popupForm);
      boardPresenter.showPopup(false);
    }
  }

  _popupOpenHandler(filmId) {
    if (this._currentFilmId === filmId) {
      return;
    }
    this._currentFilmId = filmId;
    [this._boardFilmPresenter]
      .flatMap((map) => [...map.values()])
      .forEach((presenter) => presenter.resetState());
  }

  _popupCloseHandler() {
    this._currentFilmId = null;
  }

  _getFilms() {
    this._filterType = this._filterModel.getFilter();
    const sourceFilms = this._filmsModel.getFilms();
    let filteredFilms = filter[this._filterType](sourceFilms);
    if (this._currentFilmId !== null && this._filterType !== FilterType.ALL) {
      const currentFilm = sourceFilms.find((film) => film.id === this._currentFilmId);
      if (!filteredFilms.includes(currentFilm)) {
        filteredFilms = [
          currentFilm,
          ...filteredFilms,
        ];
      }
    }
    switch (this._currentSortType) {
      case SortType.BY_DEFAULT:
        return filteredFilms;
      case SortType.BY_DATE:
        return filteredFilms.sort(sortByDate);
      case SortType.BY_RATING:
        return filteredFilms.sort(sortByRating);
    }
    return sourceFilms;
  }

  _setFilmPresenterState(filmId, state) {
    const mainPresenter = this._boardFilmPresenter.get(filmId);
    if (mainPresenter) {
      mainPresenter.setViewState(state);
    }
  }

  _handleViewAction(actionType, updateType, film, evt) {
    switch (actionType) {
      case UserAction.BUTTON_CLICK:
        this._clickEvent = evt.target.id;
        this._api.updateFilm(film)
          .then((response) => {
            this._filmsModel.updateFilm(updateType, response);
          })
          .catch(() => {
            this._setFilmPresenterState(film.id, FilmPresenterViewState.ABORTING);
          });
        break;
      case UserAction.DELETE_COMMENT:
        this._setFilmPresenterState(film.id, FilmPresenterViewState.DELETING);
        this._filmsModel.updateFilm(updateType, film);
        break;
      case UserAction.ADD_COMMENT:
        this._setFilmPresenterState(film.id, FilmPresenterViewState.POSTING);
        this._filmsModel.updateFilm(updateType, film);
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH: {
        this._updatePresenter(data);
        this._updateUserProfile();
        break;
      }
      case UpdateType.MINOR:
        if(this._currentFilmId !== null) {
          this.getPopupScroll();
          this.getPopupForm();
          this._currentFilm = this._boardFilmPresenter.get(this._currentFilmId);
        }
        this._clearBoard();
        this._renderBoard();
        this._reopenPopup();
        break;
      case UpdateType.MAJOR:
        this._clearBoard({resetRenderedTaskCount: true, resetSortType: true});
        this._renderBoard();
        this._reopenPopup();
        break;
      case UpdateType.MINOR_COMMENTS:
        this._currentFilm = this._boardFilmPresenter.get(this._currentFilmId);
        this._updatePresenter(data);
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderBoard();
        break;
    }
  }

  getPopupScroll() {
    const boardPresenter = this._boardFilmPresenter.get(this._currentFilmId);
    this._poppScroll = boardPresenter.getPopupScrollPosition();
  }

  getPopupForm() {
    const boardPresenter = this._boardFilmPresenter.get(this._currentFilmId);
    this._popupForm = boardPresenter.getPopupFormState();
  }

  _updatePresenter(film) {
    const boardPresenter = this._boardFilmPresenter.get(film.id);
    if (this._filterType !== FilterType.ALL && this._currentFilmId === film.id
      && (this._currentFilm.isPopupWatchListButtonActive() === false
        || this._currentFilm.isPopupWatchedButtonActive() === false
        || this._currentFilm.isPopupFavoritesButtonActive() === false)) {
      this._currentFilm.initOnlyPopup(film);
    } else {
      boardPresenter.init(film);
    }
  }

  _handleSortTypeClick(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearFilmsSection(true);
    this._renderBoardFilms();
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }
    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setSortTypeClickHandler(this._handleSortTypeClick);
    render(this._boardContainer, this._sortComponent);
  }

  _renderLoading() {
    render(this._boardContainer, this._loadingComponent);
  }

  _renderFilmsSection() {
    render(this._boardContainer, this._filmsSectionComponent);
  }

  _renderFilmsList() {
    render(this._filmsSectionComponent, this._filmsListComponent);
  }

  _getBoardFilmsListContainer() {
    return this._filmsListComponent.getElement().querySelector('.films-list__container');
  }

  _renderFilm(film, container = this._getBoardFilmsListContainer()) {
    if (film.id === this._currentFilmId && this._filterType !== FilterType.ALL) {

      switch (this._filterType) {
        case FilterType.HISTORY:
          this._isJustPopup = isJustPopup(this._currentFilm.isPopupWatchedButtonActive(), this._clickEvent, ButtonName.WATCHED);
          break;
        case FilterType.WATCHLIST:
          this._isJustPopup = isJustPopup(this._currentFilm.isPopupWatchListButtonActive(), this._clickEvent, ButtonName.WATCHLIST);
          break;
        case FilterType.FAVORITES:
          this._isJustPopup = isJustPopup(this._currentFilm.isPopupFavoritesButtonActive(), this._clickEvent, ButtonName.FAVORITE);
      }
    } else {
      this._isJustPopup = false;
    }

    const filmPresenter = new FilmPresenter(
      container,
      this._handleViewAction,
      this._popupOpenHandler,
      this._popupCloseHandler,
      this._commentsModel,
      this._filterModel.getFilter(),
      this._api);
    filmPresenter.init(film, this._isJustPopup);

    switch (container) {
      case this._getBoardFilmsListContainer():
        this._boardFilmPresenter.set(film.id, filmPresenter);
        break;
    }
  }

  _clearFilmsSection(resetFilmsCount) {
    const filmCount = this._getFilms().length;
    this._boardFilmPresenter.forEach((presenter) => presenter.destroy());
    this._boardFilmPresenter.clear();

    resetFilmsCount
      ? this._renderedFilmsCount = CARDS_PER_STEP
      : this._renderedFilmsCount = Math.min(filmCount, this._renderedFilmsCount);

    remove(this._showMoreButtonComponent);
    remove(this._loadingComponent);
  }

  _clearBoard({resetRenderedTaskCount = false, resetSortType = false} = {}) {
    remove(this._sortComponent);
    this._clearFilmsSection(resetRenderedTaskCount);
    remove(this._userProfileComponent);

    if (this._noFilmsComponent) {
      remove(this._noFilmsComponent);
    }

    if (resetSortType) {
      this._currentSortType = SortType.BY_DEFAULT;
    }
  }

  _renderFilms(films, container) {
    // if (films.length === NO_FILMS) {
    //   this._renderNoFilms();
    // }
    films.forEach((film) => {
      this._renderFilm(film, container);
    });
  }

  _renderNoFilms() {
    this._noFilmsComponent = new NoFilmsView(this._filterType);
    render(this._filmsListComponent, this._noFilmsComponent);
  }

  _renderBoardFilms() {
    const films = this._getFilms();
    const filmCount = films.length;

    this._renderFilms(films.slice(0, Math.min(filmCount, this._renderedFilmsCount)));

    if (filmCount > CARDS_PER_STEP) {
      this._renderShowMoreButton();
    }
  }

  _handleShowMoreButtonClick() {
    const filmCount = this._getFilms().length;
    const newRenderedFilmsCount = Math.min(filmCount, this._renderedFilmsCount + CARDS_PER_STEP);
    const films = this._getFilms().slice(this._renderedFilmsCount, newRenderedFilmsCount);

    this._renderFilms(films);
    this._renderedFilmsCount = newRenderedFilmsCount;
    if (this._renderedFilmsCount >= filmCount) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderShowMoreButton() {
    if (this._showMoreButtonComponent !== null) {
      this._showMoreButtonComponent = null;
    }

    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);
    render(this._filmsListComponent, this._showMoreButtonComponent);
  }

  _renderUserProfile() {
    const films = this._filmsModel.getFilms();
    const watchedFilms = filter[FilterType.HISTORY](films);
    if (watchedFilms.length === FilmsCount.NULL) {
      return;
    }
    this._userProfileComponent = new UserProfileView(watchedFilms.length);
    render(this._profileRatingContainer, this._userProfileComponent);
  }

  _updateUserProfile() {
    remove(this._userProfileComponent);
    this._renderUserProfile();
  }

  _renderBoard() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    const filmCount = this._getFilms().length;
    if (filmCount === 0) {
      this._renderNoFilms();
      return;
    }

    this._renderSort();
    this._renderFilmsSection();
    this._renderFilmsList();
    this._renderBoardFilms();
    this._renderUserProfile();
  }
}
