import FiltersView from './view/filters.js';
import UserProfileView from './view/user-profile.js';
import StatisticsView from './view/statistics.js';
import FilmsBoardPresenter from './presenter/films-board';
import FilmsModel from './model/films.js';
import FilterModel from './model/filter.js';
import { generateFilmCard } from './mock/film-card.js';
// import { generateFilters } from './mock/filters.js';
import {RenderPlace, render} from './utils/dom-utils.js';
import FilterPresenter from './presenter/filter.js';

const CARDS_COUNT = 20;

const mainSection = document.querySelector('.main');
const header = document.querySelector('.header');
const footerStatistics = document.querySelector('.footer__statistics');

const filmCards = new Array(CARDS_COUNT).fill().map(() => generateFilmCard());

const filmsModel = new FilmsModel();
filmsModel.setFilms(filmCards);

const filterModel = new FilterModel();

const filmsBoardPresenter = new FilmsBoardPresenter(mainSection, filmsModel, filterModel);
const filterPresenter = new FilterPresenter(mainSection, filterModel, filmsModel);

render(header, new UserProfileView, RenderPlace.BEFOREEND);

filterPresenter.init();
filmsBoardPresenter.init();

render(footerStatistics, new StatisticsView(filmCards.length), RenderPlace.BEFOREEND);
