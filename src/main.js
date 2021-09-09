import UserProfileView from './view/user-profile.js';
import StatisticsFooterView from './view/statistics.js';
import StatisticsView from './view/stats.js';
import FilmsBoardPresenter from './presenter/films-board';
import FilmsModel from './model/films.js';
import FilterModel from './model/filter.js';
import FilterPresenter from './presenter/filter.js';
import Api from './api.js';
// import { generateFilmCard } from './mock/film-card.js';
import {RenderPlace, render, remove} from './utils/dom-utils.js';
import {MenuItem, UpdateType} from './utils/utils.js';
import {FilterType} from './utils/filter-utils.js';

// const CARDS_COUNT = 20;

const AUTHORIZATION = 'Basic gL7en6jyTrbk5qw3x';
const END_POINT = 'https://15.ecmascript.pages.academy/cinemaddict';

const mainSection = document.querySelector('.main');
const header = document.querySelector('.header');

// const footerStatistics = document.querySelector('.footer__statistics');

let statisticsComponent = null;

// const filmCards = new Array(CARDS_COUNT).fill().map(() => generateFilmCard());

const api = new Api(END_POINT, AUTHORIZATION);

const filmsModel = new FilmsModel();

// filmsModel.setFilms(filmCards);

const filterModel = new FilterModel();

const filmsBoardPresenter = new FilmsBoardPresenter(mainSection, filmsModel, filterModel);

let isClickedFilmsMenu = false;
let isClickedStatisticsMenu = false;
const handleMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.FILMS:
      if (!isClickedFilmsMenu) {
        filmsBoardPresenter.init();
        remove(statisticsComponent);
        isClickedFilmsMenu = true;
        isClickedStatisticsMenu = false;
      }
      filterModel.setFilters(UpdateType.MAJOR, FilterType.ALL);
      break;
    case MenuItem.STATISTICS:
      if (!isClickedStatisticsMenu) {
        filmsBoardPresenter.destroy();
        statisticsComponent = new StatisticsView(filmsModel.getFilms());
        render(mainSection, statisticsComponent, RenderPlace.BEFOREEND);
        isClickedFilmsMenu = false;
        isClickedStatisticsMenu = true;
      }
      break;
  }
};

const filterPresenter = new FilterPresenter(mainSection, filterModel, filmsModel, handleMenuClick);

filterPresenter.init();
filmsBoardPresenter.init();

api.getFilms()
  .then((films) => {
    filmsModel.setFilms(UpdateType.INIT, films);
  })
  .catch(() =>{
    filmsModel.setFilms(UpdateType.INIT, []);
  });

render(header, new UserProfileView, RenderPlace.BEFOREEND);
// render(footerStatistics, new StatisticsFooterView(filmCards.length), RenderPlace.BEFOREEND);
