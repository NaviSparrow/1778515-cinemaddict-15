import FilmsSectionView  from '../view/films-section.js';
import FilmsListView from '../view/films-list.js';
import FilmPresenter from './film';
import ShowMoreButtonView from '../view/show-more-button.js';
import TopRatedFilmsView from '../view/top-rated-films.js';
import MostCommentedFilmsView from '../view/most-commented-films.js';
import SortView from '../view/sort.js';
import NoFilmsInDatabaseView from '../view/no-films-in-database.js';
import {RenderPlace, render, remove} from '../utils/dom-utils.js';
import {sortByDate, sortByRating, SortType, updateItem} from '../utils/utils.js';

const CARDS_PER_STEP = 5;
const EXTRA_CARDS_COUNT = 2;

export default class FilmsBoard {
  constructor(boardContainer, filmsModel) {
    this._boardContainer = boardContainer;
    this._filmsModel = filmsModel;
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
    this._sortCopmponent = new SortView();
    this._noFilmsComponent = new NoFilmsInDatabaseView();
    this._showMoreButtonComponent = new ShowMoreButtonView();

    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._handleSortTypeClick = this._handleSortTypeClick.bind(this);
  }

  init(films) {
    this._boardFilms = films.slice();
    this._soursedBoardFilms = films.slice();

    this._renderFilmsBoard();
  }

  getFilms() {
    return this._filmsModel.getFilms();
  }

  _handleFilmChange(updatedFilm) {
    this._boardFilms = updateItem(this._boardFilms, updatedFilm);
    this._soursedBoardFilms = updateItem(this._soursedBoardFilms, updatedFilm);

    if (this._boardFilmPresenter.has(updatedFilm.id)) {
      this._boardFilmPresenter.get(updatedFilm.id).init(updatedFilm, this._setOfContainers);
    }

    if (this._topRatedFilmPresenter.has(updatedFilm.id)) {
      this._topRatedFilmPresenter.get(updatedFilm.id).init(updatedFilm,this._setOfContainers);
    }

    if (this._mostCommentedFilmPresenter.has(updatedFilm.id)) {
      this._mostCommentedFilmPresenter.get(updatedFilm.id).init(updatedFilm,this._setOfContainers);
    }
  }

  _sortFilms(sortType) {
    switch (sortType) {
      case SortType.BY_DATE:
        this._boardFilms.sort(sortByDate);
        break;
      case SortType.BY_RATING:
        this._boardFilms.sort(sortByRating);
        break;
      default:
        this._boardFilms = this._soursedBoardFilms.slice();
    }

    this._currentSortType = sortType;
  }

  _handleSortTypeClick(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortFilms(sortType);
    this._clearFilmsSection();
    this._renderBoardFilms();
    this._renderTopRatedList();
    this._renderMostCommentedList();
    this._renderTopRatedFilms();
    this._renderMostCommentedFilms();
  }

  _renderSort() {
    render(this._boardContainer, this._sortCopmponent, RenderPlace.BEFOREEND);
    this._sortCopmponent.setSortTypeClickHandler(this._handleSortTypeClick);
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
    const filmPresenter = new FilmPresenter(container, this._handleFilmChange);
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

  _renderFilms(from, to, container) {
    this._boardFilms
      .slice(from, to)
      .forEach((film) => {
        this._renderFilm(film, container);
      });
  }

  _renderNoFilms() {
    render(this._boardContainer, this._noFilmsComponent, RenderPlace.BEFOREEND);
  }

  _renderBoardFilms() {
    this._renderFilms(0, Math.min(this._boardFilms.length, CARDS_PER_STEP));

    if (this._boardFilms.length > CARDS_PER_STEP) {
      this._renderShowMoreButton();
    }
  }

  _renderTopRatedFilms() {
    this._renderFilms(0, EXTRA_CARDS_COUNT, this._getTopRatedFilmsListContainer());
  }

  _renderMostCommentedFilms() {
    this._renderFilms(0, EXTRA_CARDS_COUNT, this._getMostCommentedFilmsListContainer());
  }

  _handleShowMoreButtonClick() {
    this._renderFilms(this._renderedFilmsCount, this._renderedFilmsCount + CARDS_PER_STEP);
    this._renderedFilmsCount += CARDS_PER_STEP;

    if (this._renderedFilmsCount >= this._boardFilms.length) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderShowMoreButton() {
    render(this._filmsListComponent, this._showMoreButtonComponent, RenderPlace.BEFOREEND);
    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);
  }

  _renderFilmsBoard() {
    if (this._boardFilms.length === 0) {
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
