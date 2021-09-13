import FilmsSectionView  from '../view/films-section.js';
import FilmsListView from '../view/films-list.js';
import FilmPresenter from './film';
import ShowMoreButtonView from '../view/show-more-button.js';
import TopRatedFilmsView from '../view/top-rated-films.js';
import MostCommentedFilmsView from '../view/most-commented-films.js';
import SortView from '../view/sort.js';
import NoFilmsView from '../view/no-films';
import LoadingView from '../view/loading.js';
import {RenderPlace, render, remove} from '../utils/dom-utils.js';
import {filter, FilterType} from '../utils/filter-utils.js';
import {getRandomArrayElement, sortByDate, sortByRating, SortType, UpdateType, UserAction} from '../utils/utils.js';

const CARDS_PER_STEP = 5;
const EXTRA_CARDS_COUNT = 2;

export default class FilmsBoard {
  constructor(boardContainer, filmsModel, filterModel, commentsModel, api) {
    this._boardContainer = boardContainer;
    this._filmsModel = filmsModel;
    this._filterModel = filterModel;
    this._commentsModel = commentsModel;
    this._filterType = FilterType.ALL;
    this._renderedFilmsCount = CARDS_PER_STEP;
    this._boardFilmPresenter = new Map();
    this._topRatedFilmPresenter = new Map();
    this._mostCommentedFilmPresenter = new Map();
    this._setOfContainers = new Set();
    this._currentSortType = SortType.BY_DEFAULT;
    this._isLoading = true;
    this._api = api;

    this._filmsSectionComponent = new FilmsSectionView();
    this._filmsListComponent = new FilmsListView();
    this._topRatedListComponent = new TopRatedFilmsView();
    this._mostCommentedListComponent = new MostCommentedFilmsView();
    this._loadingComponent = new LoadingView();
    this._sortCopmponent = null;
    this._showMoreButtonComponent = null;

    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleSortTypeClick = this._handleSortTypeClick.bind(this);
  }

  init() {
    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
    this._renderBoard();
  }

  destroy() {
    this._clearBoard({resetRenderedTaskCount: true, resetSortType: true});

    remove(this._filmsListComponent);
    remove(this._filmsSectionComponent);
    this._filmsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  _getFilms() {
    this._filterType = this._filterModel.getFilter();
    const films = this._filmsModel.getFilms();
    const filteredFilms = filter[this._filterType](films);
    switch (this._currentSortType) {
      case SortType.BY_DATE:
        return filteredFilms.sort(sortByDate);
      case SortType.BY_RATING:
        return filteredFilms.sort(sortByRating);
    }
    return filteredFilms;
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.BUTTON_CLICK:
        this._filmsModel.updateFilm(updateType, update);
        break;
      case UserAction.DELETE_COMMENT:
        this._filmsModel.updateFilm(updateType, update);
        break;
      case UserAction.ADD_COMMENT:
        this._filmsModel.updateFilm(updateType, update);
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        if (this._boardFilmPresenter.has(data.id)) {
          this._boardFilmPresenter.get(data.id).init(data, this._setOfContainers);
        }

        if (this._topRatedFilmPresenter.has(data.id)) {
          this._topRatedFilmPresenter.get(data.id).init(data, this._setOfContainers);
        }

        if (this._mostCommentedFilmPresenter.has(data.id)) {
          this._mostCommentedFilmPresenter.get(data.id).init(data, this._setOfContainers);
        }
        break;
      case UpdateType.MINOR:
        this._clearBoard();
        this._renderBoard();
        break;
      case UpdateType.MAJOR:
        this._clearBoard({resetRenderedTaskCount: true, resetSortType: true});
        this._renderBoard();
        break;
      case UpdateType.MINOR_COMMENTS:
        this._clearMostCommentedFilmsList();
        this._renderMostCommentedFilms();
        this._boardFilmPresenter.get(data.id).init(data, this._setOfContainers); //TODO ошибка здесь

        if (this._topRatedFilmPresenter.has(data.id)) {
          this._topRatedFilmPresenter.get(data.id).init(data, this._setOfContainers);
        }
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderBoard();
        break;
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
    if (this._sortCopmponent !== null) {
      this._sortCopmponent = null;
    }
    this._sortCopmponent = new SortView(this._currentSortType);
    this._sortCopmponent.setSortTypeClickHandler(this._handleSortTypeClick);
    render(this._boardContainer, this._sortCopmponent, RenderPlace.BEFOREEND);
  }

  _renderLoading() {
    render(this._boardContainer, this._loadingComponent, RenderPlace.BEFOREEND);
  }

  _renderFilmsSection() {
    render(this._boardContainer, this._filmsSectionComponent, RenderPlace.BEFOREEND);
  }

  _renderFilmsList() {
    render(this._filmsSectionComponent, this._filmsListComponent, RenderPlace.BEFOREEND);
  }

  _renderTopRatedList() {
    render(this._filmsSectionComponent, this._topRatedListComponent, RenderPlace.BEFOREEND);
  }

  _renderMostCommentedList() {
    render(this._filmsSectionComponent, this._mostCommentedListComponent, RenderPlace.BEFOREEND);
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
    const filmPresenter = new FilmPresenter(container, this._handleViewAction, this._commentsModel, this._filterModel.getFilter(), this._api);
    filmPresenter.init(film);

    switch (container) {
      case this._getBoardFilmsListContainer():
        this._boardFilmPresenter.set(film.id, filmPresenter);
        break;
      case  this._getTopRatedFilmsListContainer():
        this._topRatedFilmPresenter.set(film.id, filmPresenter);
        break;
      case this._getMostCommentedFilmsListContainer():
        this._mostCommentedFilmPresenter.set(film.id, filmPresenter);
        break;
    }
    this._setOfContainers.add(container);
  }

  _clearMostCommentedFilmsList() {
    this._mostCommentedFilmPresenter.forEach((presenter) => presenter.destroy());
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
    remove(this._sortCopmponent);
    this._clearFilmsSection(resetRenderedTaskCount);

    if (this._noFilmsComponent) {
      remove(this._noFilmsComponent);
    }

    if (resetSortType) {
      this._currentSortType = SortType.BY_DEFAULT;
    }
  }

  _renderFilms(films, container) {
    films.forEach((film) => this._renderFilm(film, container));
  }

  _renderNoFilms() {
    this._noFilmsComponent = new NoFilmsView(this._filterType);
    render(this._boardContainer, this._noFilmsComponent, RenderPlace.BEFOREEND);
  }

  _renderBoardFilms() {
    const filmCount = this._getFilms().length;
    const films = this._getFilms().slice(0, Math.min(filmCount, this._renderedFilmsCount));
    this._renderFilms(films);

    if (filmCount > CARDS_PER_STEP) {
      this._renderShowMoreButton();
    }
  }

  _renderTopRatedFilms() {
    const topRatedFilms = this._getFilms()
      .slice()
      .sort((filmA, filmB) => filmB.rating - filmA.rating);

    const isEveryRatingNull = topRatedFilms
      .every((film) => film.rating === 0);

    const isEveryRatingEqual = topRatedFilms
      .every((film) => film.rating === topRatedFilms[0].rating);

    if (isEveryRatingNull) {
      remove(this._topRatedListComponent);
      return;
    }

    if (isEveryRatingEqual) {
      this._renderFilm(getRandomArrayElement(topRatedFilms), this._getTopRatedFilmsListContainer());
      this._renderFilm(getRandomArrayElement(topRatedFilms), this._getTopRatedFilmsListContainer());
    }

    this._renderFilms(topRatedFilms.slice(0, EXTRA_CARDS_COUNT), this._getTopRatedFilmsListContainer());
  }

  _renderMostCommentedFilms() {
    const mostCommentedFilms = this._getFilms()
      .slice()
      .sort((filmA, filmB) => filmB.comments.length - filmA.comments.length);

    const isEveryCommentsBlockNull = mostCommentedFilms
      .every((film) => film.comments.length === 0);

    const isCommentsAmountEqual = mostCommentedFilms
      .every((film) => film.comments.length === mostCommentedFilms[0].comments.length);

    if (isEveryCommentsBlockNull) {
      remove(this._mostCommentedListComponent);
      return;
    }

    if (isCommentsAmountEqual) {
      this._renderFilm(getRandomArrayElement(mostCommentedFilms), this._getMostCommentedFilmsListContainer());
      this._renderFilm(getRandomArrayElement(mostCommentedFilms), this._getMostCommentedFilmsListContainer());
    }

    this._renderFilms(mostCommentedFilms.slice(0, EXTRA_CARDS_COUNT), this._getMostCommentedFilmsListContainer());
  }

  _handleShowMoreButtonClick() {
    const filmCount = this._getFilms().length;
    const newRenderedFilmCount = Math.min(filmCount, this._renderedFilmsCount + CARDS_PER_STEP);
    const films = this._getFilms().slice(this._renderedFilmsCount, newRenderedFilmCount);

    this._renderFilms(films);
    this._renderedFilmsCount = newRenderedFilmCount;
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
    render(this._filmsListComponent, this._showMoreButtonComponent, RenderPlace.BEFOREEND);
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
    this._renderMostCommentedList();
    this._renderTopRatedFilms();
    this._renderMostCommentedFilms();
  }
}
