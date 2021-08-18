import FilmsSectionView  from '../view/films-section.js';
import FilmsListView from '../view/films-list.js';
import FilmCardView from '../view/film-card.js';
import FilmPopupView from '../view/film-popup.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import TopRatedFilmsView from '../view/top-rated-films.js';
import MostCommentedFilmsView from '../view/most-commented-films.js';
import SortView from '../view/sort.js';
import NoFilmsInDatabaseView from '../view/no-films-in-database.js';
import {RenderPlace, render, remove, isEscEvent, replace} from '../utils/dom-utils.js';

const CARDS_PER_STEP = 5;
const EXTRA_CARDS_COUNT = 2;

export default class FilmsBoard {
  constructor(boardContainer) {
    this._filmsBoardContainer = boardContainer;
    this._renderedFilmsCount = CARDS_PER_STEP;

    this._filmsSectionComponent = new FilmsSectionView();
    this._filmsListComponent = new FilmsListView();
    this._sortCopmponent = new SortView();
    this._noFilmsComponent = new NoFilmsInDatabaseView();
    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._filmCardComponent = null;
    this._filmPopupComponent = null;

    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
  }

  init(films) {
    // Метод для инициализации (начала работы) модуля,
    // малая часть текущей функции renderBoard в main.js
    this._boardFilms = films.slice();

    this._renderFilmsBoard();
  }

  _renderSort() {
    render(this._filmsBoardContainer, this._sortCopmponent, RenderPlace.BEFOREEND);
  }

  _renderFilmsSection() {
    render(this._filmsBoardContainer, this._filmsSectionComponent, RenderPlace.BEFOREEND);
  }

  renderFilmsList() {
    render(this._filmsSectionComponent, this._filmsListComponent, RenderPlace.BEFOREEND);
  }

  _getBasicFilmsListContainer() {
    return this._filmsListComponent.getElement().querySelector('.films-list__container');
  }

  _renderFilm(film, container = this._getBasicFilmsListContainer()) {
    const prevFilmCardComponent = this._filmCardComponent;
    const prevFilmPopupComponent = this._filmPopupComponent;

    const filmCardComponent = new FilmCardView(film);
    const filmPopupComponent = new FilmPopupView(film);

    const findPopup = () => document.body.querySelector('.film-details');

    const closeOnClickHandler = () => {
      remove(filmPopupComponent);
      document.body.classList.remove('hide-overflow');
    };

    const closeOnKeydownHandler = (evt) => {
      if (isEscEvent(evt)) {
        evt.preventDefault();
        closeOnClickHandler();
      }
    };

    const openOnClickHandler = () => {
      if(findPopup()) {
        document.body.removeChild(findPopup());
      }
      render(document.body, filmPopupComponent, RenderPlace.BEFOREEND);
      document.body.classList.add('hide-overflow');
      document.addEventListener('keydown', closeOnKeydownHandler, {once: true});
    };

    filmCardComponent.setClickHandler(openOnClickHandler);
    filmPopupComponent.setClickHandler(closeOnClickHandler);

    if (prevFilmCardComponent === null || prevFilmPopupComponent === null) {
      render(container, filmCardComponent, RenderPlace.BEFOREEND);
      return;
    }
    //TODO проверить контейнер
    if (this._filmsSectionComponent.getElement().contains(prevFilmCardComponent.getElement())) {
      replace(this._filmCardComponent, prevFilmCardComponent);
    }

    if (this._filmsSectionComponent.getElement().contains(prevFilmPopupComponent.getElement())) {
      replace(this._filmPopupComponent, prevFilmPopupComponent);
    }
  }

  destroy() {
    remove(this._filmCardComponent);
    remove(this._filmPopupComponent);
  }

  _renderFilms(from, to, container) {
    //отрисовка n-колличества фильмов
    this._boardFilms
      .slice(from, to)
      .forEach((film) => {
        this._renderFilm(film, container);
      });
  }

  _renderNoFilms() {
    //отрисовка заглушки
    render(this._filmsBoardContainer, this._noFilmsComponent, RenderPlace.BEFOREEND);
  }

  _renderBasicFilms() {
    this._renderFilms(0, Math.min(this._boardFilms.length, CARDS_PER_STEP));

    if (this._boardFilms.length > CARDS_PER_STEP) {
      this._renderShowMoreButton();
    }
  }

  _renderExtraFilms() {
    const renderExtraSectionFilms = (container) => {
      this._renderFilms(0, EXTRA_CARDS_COUNT, container);
    };

    const topRatedFilms = new TopRatedFilmsView();
    const mostCommentedFilms = new MostCommentedFilmsView();

    render(this._filmsSectionComponent, topRatedFilms, RenderPlace.BEFOREEND);
    render(this._filmsSectionComponent, mostCommentedFilms, RenderPlace.BEFOREEND);

    renderExtraSectionFilms(topRatedFilms.getElement().querySelector('.films-list__container'));
    renderExtraSectionFilms(mostCommentedFilms.getElement().querySelector('.films-list__container'));
  }

  _handleShowMoreButtonClick() {
    this._renderFilms(this._renderedFilmsCount, this._renderedFilmsCount + CARDS_PER_STEP);
    this._renderedFilmsCount += CARDS_PER_STEP;

    if (this._renderedFilmsCount >= this._boardFilms.length) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderShowMoreButton() {
    //отрисовка кнопки подзагрузки
    render(this._filmsSectionComponent, this._showMoreButtonComponent, RenderPlace.BEFOREEND);
    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);
  }

  _renderFilmsBoard() {
    // Метод для инициализации (начала работы) модуля,
    // бОльшая часть текущей функции renderBoard в main.js
    if (this._boardFilms.length === 0) {
      this._renderNoFilms();
      return;
    }

    this._renderSort();
    this._renderFilmsSection();
    this.renderFilmsList();
    this._renderBasicFilms();
    this._renderExtraFilms();
  }
}