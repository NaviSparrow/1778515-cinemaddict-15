import FiltersView from './view/filters.js';
import UserProfileView from './view/user-profile.js';
import StatisticsView from './view/statistics.js';
import FilmsBoardPresenter from './presenter/films-board';
import FilmsModel from './model/films.js';
import { generateFilmCard } from './mock/film-card.js';
import { generateFilters } from './mock/filters.js';
import {RenderPlace, render} from './utils/dom-utils.js';

const CARDS_COUNT = 20;

const mainSection = document.querySelector('.main');
const header = document.querySelector('.header');
const footerStatistics = document.querySelector('.footer__statistics');

const filmCards = new Array(CARDS_COUNT).fill().map(() => generateFilmCard());
const filters = generateFilters(filmCards);

const filmsModel = new FilmsModel();
filmsModel.setFilms(filmCards);
const filmsBoard = new FilmsBoardPresenter(mainSection, filmsModel);

render(header, new UserProfileView, RenderPlace.BEFOREEND);
render(mainSection, new FiltersView(filters), RenderPlace.BEFOREEND);

filmsBoard.init();

render(footerStatistics, new StatisticsView(filmCards.length), RenderPlace.BEFOREEND);
