import UserProfileView from './view/user-profile.js';
import StatisticsFooterView from './view/statistics.js';
import StatisticsView from './view/stats.js';
import FilmsBoardPresenter from './presenter/films-board';
import FilmsModel from './model/films.js';
import FilterModel from './model/filter.js';
import FilterPresenter from './presenter/filter.js';
import { generateFilmCard } from './mock/film-card.js';
import {RenderPlace, render} from './utils/dom-utils.js';
import {MenuItem} from './utils/utils.js';

const CARDS_COUNT = 20;

const mainSection = document.querySelector('.main');
const header = document.querySelector('.header');
const footerStatistics = document.querySelector('.footer__statistics');
const statisticsComponent = new StatisticsView();

const filmCards = new Array(CARDS_COUNT).fill().map(() => generateFilmCard());

const filmsModel = new FilmsModel();
filmsModel.setFilms(filmCards);

const filterModel = new FilterModel();

const handleMenuClick = (menuItem) => {
  console.log(menuItem);
  switch (menuItem) {
    case MenuItem.FILMS:
      console.log('film click');
      // show board
      // hide stats
      break;
    case MenuItem.STATISTICS:
      console.log('stats click');
      // hide board
      // show stats
      break;
  }
};

const filmsBoardPresenter = new FilmsBoardPresenter(mainSection, filmsModel, filterModel);
const filterPresenter = new FilterPresenter(mainSection, filterModel, filmsModel, handleMenuClick);

filterPresenter.init();
filmsBoardPresenter.init();

render(mainSection, statisticsComponent, RenderPlace.BEFOREEND);

render(header, new UserProfileView, RenderPlace.BEFOREEND);
render(footerStatistics, new StatisticsFooterView(filmCards.length), RenderPlace.BEFOREEND);
