import { createFilmsListTemplate } from './view/films-list.js';
import { createFilmCardTemplate } from './view/film-card.js';
import { createMainMenuTemplate } from './view/main-menu.js';
import { createPopupTemplate } from './view/popup.js';
import { createShowMoreButtonTemplate } from './view/show-more-button.js';
import { createSortTemplate } from './view/sort.js';
import { createStatisticsTemplate } from './view/statistics.js';
import { createUserProfileTemplate } from './view/user.js';
import { createFilmsSectionTemplate } from './view/films.js';
import { createFilmsListExtraTemplate } from './view/films-list-extra.js';

const CARDS_COUNT = 5;
const EXTRA_CARDS_COUNT = 2;
const TOP_RATED_FILMS = 0;
const MOST_COMMENTED_FILMS = 1;
const RenderPlace = {
  beforebegin: 'beforebegin',
  afterbegin: 'afterbegin',
  afterend: 'afterend',
};

const mainSection = document.querySelector('.main');
const userProfile = document.querySelector('.header');
const footerStatistics = document.querySelector('.footer__statistics');

const render = (container, template, place = 'beforeend') => container.insertAdjacentHTML(place, template);

const renderExtraSection = (container) => {
  for (let i = 0; i < EXTRA_CARDS_COUNT; i++) {
    render(container, createFilmCardTemplate());
  }
};

render(userProfile, createUserProfileTemplate());
render(mainSection, createMainMenuTemplate());
render(mainSection, createSortTemplate());

render(mainSection, createFilmsSectionTemplate());
const filmsSection = document.querySelector('.films');

render(filmsSection, createFilmsListTemplate());

const filmsListSection = filmsSection.querySelector('.films-list');
const filmsListContainer = filmsListSection.querySelector('.films-list__container');
for (let i = 0; i < CARDS_COUNT; i++) {
  render(filmsListContainer, createFilmCardTemplate());
}

render(filmsListSection, createShowMoreButtonTemplate());

render(filmsSection, createFilmsListExtraTemplate());
const extraSections = filmsSection.querySelectorAll('.films-list--extra');

const topRatedfilms = extraSections[TOP_RATED_FILMS].querySelector('.films-list__container');
const mostCommentedFilms = extraSections[MOST_COMMENTED_FILMS].querySelector('.films-list__container');
renderExtraSection(topRatedfilms);
renderExtraSection(mostCommentedFilms);


render(footerStatistics, createStatisticsTemplate());
// render(document.body, createPopupTemplate());
