import { createFilmsBlockTemplate } from './view/films-block-markup.js';
import { createFilmCardTemplate } from './view/film-card.js';
import { createMainMenuTemplate } from './view/main-menu.js';
import { createPopupTemplate } from './view/popup.js';
import { createShowMoreButtonTemplate } from './view/show-more-button.js';
import { createSortTemplate } from './view/sort.js';
import { createStatisticsTemplate } from './view/statistics.js';
import { createUserProfileTemplate } from './view/user.js';

const TASK_COUNT = 5;
const EXTRA_TASK_COUNT = 2;
const FILMS_SECTION = 0;
const TOP_RATED_SECTION = 1;
const MOST_COMMENTED_SECTION = 2;

const mainMenu = document.querySelector('.main');
const userProfile = document.querySelector('.header');
const footerStatistics = document.querySelector('.footer__statistics');

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

render(userProfile, createUserProfileTemplate(), 'beforeend');
render(mainMenu, createMainMenuTemplate(), 'beforeend');
render(mainMenu, createSortTemplate(), 'beforeend');
render(mainMenu, createFilmsBlockTemplate(), 'beforeend');

const filmsBlock = document.querySelector('.films').children;
const filmsList = filmsBlock[FILMS_SECTION];
const filmsListContainer = filmsList.querySelector('.films-list__container');
for(let i = 0 ; i < TASK_COUNT; i++) {
  render(filmsListContainer, createFilmCardTemplate(), 'beforeend');
}

render(filmsList, createShowMoreButtonTemplate(), 'beforeend');

const topRatedFilms = filmsBlock[TOP_RATED_SECTION];
const topRatedListContainer = topRatedFilms.querySelector('.films-list__container');
for(let i = 0 ; i < EXTRA_TASK_COUNT; i++) {
  render(topRatedListContainer, createFilmCardTemplate(), 'beforeend');
}

const mostCommentedFilms = filmsBlock[MOST_COMMENTED_SECTION];
const mostCommentedListContainer = mostCommentedFilms.querySelector('.films-list__container');
for(let i = 0 ; i < EXTRA_TASK_COUNT; i++) {
  render(mostCommentedListContainer, createFilmCardTemplate(), 'beforeend');
}

render(footerStatistics, createStatisticsTemplate(), 'beforeend');
render(document.body, createPopupTemplate(), 'beforeend');
