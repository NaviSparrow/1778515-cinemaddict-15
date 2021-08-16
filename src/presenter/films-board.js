import FilmsSectionView  from '../view/films-section.js';
import FilmsListView from '../view/films-list.js';
import FilmCardView from '../view/film-card.js';
import FilmPopupView from '../view/film-popup.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import TopRatedFilmsView from '../view/top-rated-films.js';
import MostCommentedFilmsView from '../view/most-commented-films.js';
import SortView from '../view/sort.js';
import NoFilmsInDatabaseView from '../view/no-films-in-database.js';
import {RenderPlace, render, remove, isEscEvent} from '../utils/dom-utils.js';

const CARDS_PER_STEP = 5;
const EXTRA_CARDS_COUNT = 2;

export default class FilmsBoard {
  constructor(boardContainer) {
    this._filmsBoardContainer = boardContainer;

    this._filmsSectionComponent = new FilmsSectionView();
    this._filmsListComponent = new FilmsListView();
    this._sortCopmponent = new SortView();
    this._noFilmsComponent = new NoFilmsInDatabaseView();
  }

  init(films) {
    // Метод для инициализации (начала работы) модуля,
    // малая часть текущей функции renderBoard в main.js
    this._boardFilms = films.slice();

    this._renderFilmsBoard();
  }

  _renderSort() {
    //Метод рендеринга сортировки
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
    //Метод для отрисовки одной задачи
    //текущая renderFilmCard
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

    render(container, filmCardComponent, RenderPlace.BEFOREEND);
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

  _renderShowMoreButton() {
    //отрисовка кнопки подзагрузки
    let renderedFilmsCount = CARDS_PER_STEP;
    const showMoreButton = new ShowMoreButtonView();
    render(this._filmsSectionComponent, showMoreButton, RenderPlace.BEFOREEND);

    showMoreButton.setClickHandler(() => {
      this._boardFilms
        .slice(renderedFilmsCount, renderedFilmsCount + CARDS_PER_STEP)
        .forEach((film) => this._renderFilm(film));
      renderedFilmsCount += CARDS_PER_STEP;

      if (renderedFilmsCount >= this._boardFilms.length) {
        remove(showMoreButton);
      }
    });
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
