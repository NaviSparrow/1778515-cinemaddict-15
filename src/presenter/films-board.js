import FilmsSectionView  from '../view/films-section.js';
import FilmsListView from '../view/films-list.js';
import FilmPresenter from './film';
import ShowMoreButtonView from '../view/show-more-button.js';
import TopRatedFilmsView from '../view/top-rated-films.js';
import MostCommentedFilmsView from '../view/most-commented-films.js';
import SortView from '../view/sort.js';
import NoFilmsView from '../view/no-films';
import {RenderPlace, render, remove} from '../utils/dom-utils.js';
import {sortByDate, sortByRating, SortType, UpdateType, UserAction} from '../utils/utils.js';
import {filter, FilterType} from '../utils/filter-utils.js';

const CARDS_PER_STEP = 5;
const EXTRA_CARDS_COUNT = 2;

export default class FilmsBoard {
  constructor(boardContainer, filmsModel, filterModel) {
    this._boardContainer = boardContainer;
    this._filmsModel = filmsModel;
    this._filterModel = filterModel;
    this._filterType = FilterType.ALL;
    this._renderedFilmsCount = CARDS_PER_STEP;
    this._boardFilmPresenter = new Map();
    this._topRatedFilmPresenter = new Map();
    this._mostCommentedFilmPresenter = new Map();
    this._setOfContainers = new Set();
    this._currentSortType = SortType.BY_DEFAULT;

    this._filmsSectionComponent = new FilmsSectionView();
    this._filmsListComponent = new FilmsListView();
    this._topRatedListComponent = new TopRatedFilmsView();
    this._mostCommentedListComponent = new MostCommentedFilmsView();
    this._sortCopmponent = null;
    this._showMoreButtonComponent = null;

    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleSortTypeClick = this._handleSortTypeClick.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._renderFilmsBoard();
  }

  _getFilms() {

    this._filterType = this._filterModel.getFilters();
    const films = this._filmsModel.getFilms();
    // films.forEach((film) => film.comments.forEach((comment) => console.log(comment)));
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
        this._renderFilmsBoard();
        break;
      case UpdateType.MAJOR:
        this._clearBoard({resetRenderedTaskCount: true, resetSortType: true});
        this._renderFilmsBoard();
    }
  }

  _handleSortTypeClick(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearFilmsSection();
    this._renderBoardFilms();
    this._renderTopRatedList();
    this._renderMostCommentedList();
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
    const filmPresenter = new FilmPresenter(container, this._handleViewAction, this._filterModel.getFilters());
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

  _clearFilmsSection() {
    this._boardFilmPresenter.forEach((presenter) => presenter.destroy());
    this._topRatedFilmPresenter.forEach((presenter) => presenter.destroy());
    this._mostCommentedFilmPresenter.forEach((presenter) => presenter.destroy());
    this._boardFilmPresenter.clear();
    this._topRatedFilmPresenter.clear();
    this._mostCommentedFilmPresenter.clear();
    this._renderedFilmsCount = CARDS_PER_STEP;
    remove(this._showMoreButtonComponent);
    remove(this._topRatedListComponent);
    remove(this._mostCommentedListComponent);
  }

  _clearBoard({resetRenderedTaskCount = false, resetSortType = false} = {}) {
    const filmCount = this._getFilms().length;

    remove(this._sortCopmponent);
    this._clearFilmsSection();

    if (this._noFilmsComponent) {
      remove(this._noFilmsComponent);
    }

    if (resetRenderedTaskCount === false) {
      this._renderedFilmsCount = Math.min(filmCount, this._renderedFilmsCount);
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
    const topRatedFilms = this._getFilms().slice(0, EXTRA_CARDS_COUNT);
    this._renderFilms(topRatedFilms, this._getTopRatedFilmsListContainer());
  }

  _renderMostCommentedFilms() {
    const mostCommentedFilms = this._getFilms().slice(0, EXTRA_CARDS_COUNT);
    this._renderFilms(mostCommentedFilms, this._getMostCommentedFilmsListContainer());
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

  _renderFilmsBoard() {
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
