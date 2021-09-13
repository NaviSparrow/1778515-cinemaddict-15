import UserProfileView from './view/user-profile.js';
import StatisticsFooterView from './view/statistics.js';
import StatisticsView from './view/stats.js';
import FilmsBoardPresenter from './presenter/films-board';
import FilmsModel from './model/films.js';
import FilterModel from './model/filter.js';
import FilterPresenter from './presenter/filter.js';
import Api from './api.js';
import CommentsModel from './model/comments.js';
import {RenderPlace, render, remove} from './utils/dom-utils.js';
import {MenuItem, UpdateType} from './utils/utils.js';
import {FilterType} from './utils/filter-utils.js';

const AUTHORIZATION = 'Basic gL7en6jyTrbk5qw3x';
const END_POINT = 'https://15.ecmascript.pages.academy/cinemaddict';

const mainSection = document.querySelector('.main');
const header = document.querySelector('.header');

const footerStatistics = document.querySelector('.footer__statistics');


const api = new Api(END_POINT, AUTHORIZATION);

const filmsModel = new FilmsModel();
const filterModel = new FilterModel();
const commentsModel = new CommentsModel();

const filmsBoardPresenter = new FilmsBoardPresenter(mainSection, filmsModel, filterModel, commentsModel, api);

let statisticsComponent = null;

let isAllMoviesMenuActive = false;

const handleMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.FILMS:
      if (!isAllMoviesMenuActive) {
        filmsBoardPresenter.init();
        remove(statisticsComponent);
      }
      filterModel.setFilters(UpdateType.MAJOR, FilterType.ALL);
      isAllMoviesMenuActive = true;
      break;
    case MenuItem.STATISTICS:
      if (isAllMoviesMenuActive) {
        filmsBoardPresenter.destroy();
        statisticsComponent = new StatisticsView(filmsModel.getFilms());
        render(mainSection, statisticsComponent, RenderPlace.BEFOREEND);
        isAllMoviesMenuActive = false;
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
    render(header, new UserProfileView, RenderPlace.BEFOREEND);
  });
  // .catch(() => {
  //   filmsModel.setFilms(UpdateType.INIT, []);
  //   render(header, new UserProfileView, RenderPlace.BEFOREEND);
  // });

// render(footerStatistics, new StatisticsFooterView(filmCards.length), RenderPlace.BEFOREEND);
