import UserProfileView from './view/user-profile.js';
import StatisticsFooterView from './view/statistics.js';
import StatisticsView from './view/stats.js';
import FilmsBoardPresenter from './presenter/films-board';
import FilmsModel from './model/films.js';
import FilterModel from './model/filter.js';
import FilterPresenter from './presenter/filter.js';
import { generateFilmCard } from './mock/film-card.js';
import {RenderPlace, render, remove} from './utils/dom-utils.js';
import {MenuItem, UpdateType} from './utils/utils.js';
import {FilterType} from './utils/filter-utils.js';

const CARDS_COUNT = 20;

const mainSection = document.querySelector('.main');
const header = document.querySelector('.header');
const footerStatistics = document.querySelector('.footer__statistics');

let statisticsComponent = null;

const filmCards = new Array(CARDS_COUNT).fill().map(() => generateFilmCard());

const filmsModel = new FilmsModel();
filmsModel.setFilms(filmCards);

const filterModel = new FilterModel();

const filmsBoardPresenter = new FilmsBoardPresenter(mainSection, filmsModel, filterModel);

const handleMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.FILMS:
      if (statisticsComponent !== null) {
        filmsBoardPresenter.init();
        remove(statisticsComponent);
      }
      filterModel.setFilters(UpdateType.MAJOR, FilterType.ALL);
      break;
    case MenuItem.STATISTICS:
      filmsBoardPresenter.destroy();
      statisticsComponent = new StatisticsView(filmsModel.getFilms());
      render(mainSection, statisticsComponent, RenderPlace.BEFOREEND);
      break;
  }
};

const filterPresenter = new FilterPresenter(mainSection, filterModel, filmsModel, handleMenuClick);

filterPresenter.init();
filmsBoardPresenter.init();

render(header, new UserProfileView, RenderPlace.BEFOREEND);
render(footerStatistics, new StatisticsFooterView(filmCards.length), RenderPlace.BEFOREEND);
