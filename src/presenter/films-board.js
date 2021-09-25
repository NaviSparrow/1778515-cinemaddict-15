import FilmsSectionView from '../view/films-section.js';
import FilmsListView from '../view/films-list.js';
import FilmPresenter, {State as FilmPresenterViewState} from './film';
import ShowMoreButtonView from '../view/show-more-button.js';
import TopRatedFilmsView from '../view/top-rated-films.js';
import MostCommentedFilmsView from '../view/most-commented-films.js';
import SortView from '../view/sort.js';
import NoFilmsView from '../view/no-films';
import LoadingView from '../view/loading.js';
import UserProfileView from '../view/user-profile.js';
import {remove, render} from '../utils/dom-utils.js';
import {filter, FilterType} from '../utils/filter-utils.js';
import {FilmsCount, sortByDate, sortByRating, SortType, UpdateType, UserAction} from '../utils/utils.js';
import Films from "../model/films";

const CARDS_PER_STEP = 5;
const EXTRA_CARDS_COUNT = 2;

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
    this._topRatedFilmPresenter = new Map();
    this._mostCommentedFilmPresenter = new Map();

    this._isLoading = true;
    this._isJustPopup = false;
    this._isMostCommentedFlag = false;
    this._currentFilmId = null;

    this._filmsSectionComponent = new FilmsSectionView();
    this._filmsListComponent = new FilmsListView();
    this._topRatedListComponent = new TopRatedFilmsView();
    this._mostCommentedListComponent = new MostCommentedFilmsView();
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
      boardPresenter.showPopup(false);
      return;
    }

    const topRatedPresenter = this._topRatedFilmPresenter.get(this._currentFilmId);
    if (topRatedPresenter) {
      topRatedPresenter.showPopup();
      return;
    }

    const mostCommentedPresenter = this._mostCommentedFilmPresenter.get(this._currentFilmId);
    if (mostCommentedPresenter) {
      mostCommentedPresenter.showPopup();
    }
  }

  _popupOpenHandler(filmId) {
    if (this._currentFilmId === filmId) {
      return;
    }
    this._currentFilmId = filmId;
    [this._boardFilmPresenter, this._topRatedFilmPresenter, this._mostCommentedFilmPresenter]
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
      filteredFilms = [
        currentFilm,
        ...filteredFilms,
      ];
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

    const topRatedPresenter = this._topRatedFilmPresenter.get(filmId);
    if (topRatedPresenter) {
      topRatedPresenter.setViewState(state);
    }

    const mostCommentedPresenter = this._mostCommentedFilmPresenter.get(filmId);
    if (mostCommentedPresenter) {
      mostCommentedPresenter.setViewState(state);
    }
  }

  _handleViewAction(actionType, updateType, film) {
    switch (actionType) {
      case UserAction.BUTTON_CLICK:
        this._api.updateFilm(film)
          .then((response) => {
            this._filmsModel.updateFilm(updateType, response);
          });
        // .catch(() => {
        //   this._setFilmPresenterState(film.id, FilmPresenterViewState.ABORTING);
        // });
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
        this._updatePresenters(data);
        this._updateUserProfile();
        break;
      }
      case UpdateType.MINOR:
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
        this._updatePresenters(data);
        this._clearMostCommentedFilmsList();
        this._renderMostCommentedFilms();
        this._reopenPopup();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderBoard();
        break;
    }
  }

  _updatePresenters(film) {
    const boardPresenter = this._boardFilmPresenter.get(film.id);
    if (boardPresenter) {
      boardPresenter.init(film);
    }

    const topRatedPresenter = this._topRatedFilmPresenter.get(film.id);
    if (topRatedPresenter) {
      topRatedPresenter.init(film);
    }

    const mostCommentedPresenter = this._mostCommentedFilmPresenter.get(film.id);
    if (mostCommentedPresenter) {
      mostCommentedPresenter.init(film);
    }
  }

  _handleSortTypeClick(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearFilmsSection(true);
    this._renderBoardFilms();
    this._renderTopRatedFilms();
    this._renderMostCommentedFilms();
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

  _renderTopRatedList() {
    render(this._filmsSectionComponent, this._topRatedListComponent);
  }

  _renderMostCommentedList() {
    render(this._filmsSectionComponent, this._mostCommentedListComponent);
  }

  _getBoardFilmsListContainer() {
    return this._filmsListComponent.getElement().querySelector('.films-list__container');
  }

  _getTopRatedFilmsListContainer() {
    return this._topRatedListComponent.getElement().querySelector('.films-list__container');
  }

  _getMostCommentedFilmsListContainer() {
    return this._mostCommentedListComponent.getElement().querySelector('.films-list__container');
  }

  _renderFilm(film, container = this._getBoardFilmsListContainer()) {
    if (film.id === this._currentFilmId && this._filterType !== FilterType.ALL) {
      this._isJustPopup = true;
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
      case this._getTopRatedFilmsListContainer():
        this._topRatedFilmPresenter.set(film.id, filmPresenter);
        break;
      case this._getMostCommentedFilmsListContainer():
        this._mostCommentedFilmPresenter.set(film.id, filmPresenter);
        break;
    }
  }

  _clearMostCommentedFilmsList() {
    this._mostCommentedFilmPresenter.forEach((presenter) => presenter.destroy());
    this._mostCommentedFilmPresenter.clear();
  }

  _clearFilmsSection(resetFilmsCount) {
    const filmCount = this._getFilms().length;
    this._boardFilmPresenter.forEach((presenter) => presenter.destroy());
    this._topRatedFilmPresenter.forEach((presenter) => presenter.destroy());
    this._mostCommentedFilmPresenter.forEach((presenter) => presenter.destroy());
    this._boardFilmPresenter.clear();
    this._topRatedFilmPresenter.clear();
    this._mostCommentedFilmPresenter.clear();

    resetFilmsCount
      ? this._renderedFilmsCount = CARDS_PER_STEP
      : this._renderedFilmsCount = Math.min(filmCount, this._renderedFilmsCount);

    remove(this._showMoreButtonComponent);
    remove(this._loadingComponent);
  }

  _clearBoard({resetRenderedTaskCount = false, resetSortType = false} = {}) {
    remove(this._sortComponent);
    this._clearFilmsSection(resetRenderedTaskCount);
    remove(this._topRatedListComponent);
    remove(this._mostCommentedListComponent);
    remove(this._userProfileComponent);

    if (this._noFilmsComponent) {
      remove(this._noFilmsComponent);
    }

    if (resetSortType) {
      this._currentSortType = SortType.BY_DEFAULT;
    }
  }

  _renderFilms(films, container) {
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

  _renderTopRatedFilms() {
    const topRatedFilms = this._filmsModel.getFilms().slice()
      .sort((filmA, filmB) => filmB.rating - filmA.rating);

    const isEveryRatingNull = topRatedFilms.every((film) => film.rating === 0);

    const isEveryRatingEqual = topRatedFilms.every((film) => film.rating === topRatedFilms[0].rating);

    if (isEveryRatingNull) {
      remove(this._topRatedListComponent);
      return;
    }

    if (isEveryRatingEqual && topRatedFilms.length > 1) {
      this._renderFilms(topRatedFilms.slice(0, Math.min(topRatedFilms.length, EXTRA_CARDS_COUNT)), this._getTopRatedFilmsListContainer());
    }

    this._renderFilms(topRatedFilms.slice(0, Math.min(topRatedFilms.length, EXTRA_CARDS_COUNT)), this._getTopRatedFilmsListContainer());
  }

  _renderMostCommentedFilms() {
    const mostCommentedFilms = this._filmsModel.getFilms().slice()
      .sort((filmA, filmB) => filmB.comments.length - filmA.comments.length);

    const isEveryCommentsBlockNull = mostCommentedFilms.every((film) => film.comments.length === 0);

    const isCommentsAmountEqual = mostCommentedFilms
      .every((film) => film.comments.length === mostCommentedFilms[0].comments.length);

    if (isEveryCommentsBlockNull) {
      remove(this._mostCommentedListComponent);
      return;
    }

    if (isCommentsAmountEqual && mostCommentedFilms.length > 1) {
      this._renderFilms(mostCommentedFilms.slice(0, Math.min(mostCommentedFilms.length, EXTRA_CARDS_COUNT)), this._getMostCommentedFilmsListContainer());
    }

    this._renderFilms(mostCommentedFilms.slice(0, Math.min(mostCommentedFilms.length, EXTRA_CARDS_COUNT)), this._getMostCommentedFilmsListContainer());
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

    this._renderTopRatedList();
    this._renderTopRatedFilms();

    this._renderMostCommentedList();
    this._renderMostCommentedFilms();
    this._renderUserProfile();
  }
}
