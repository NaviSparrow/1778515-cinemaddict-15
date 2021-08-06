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
import { generateFilmCard } from './mock/film-card.js';
import { render } from './utils/dom-utils.js';
import { generateFilters } from './mock/filters.js';
import {RenderPlace} from './utils/dom-utils.js';

const CARDS_COUNT = 15;
const CARDS_PER_STEP = 5;
const EXTRA_CARDS_COUNT = 2;
const TOP_RATED_FILMS = 0;
const MOST_COMMENTED_FILMS = 1;

const mainSection = document.querySelector('.main');
const userProfile = document.querySelector('.header');
const footerStatistics = document.querySelector('.footer__statistics');

const filmCards = new Array(CARDS_COUNT).fill().map(() => generateFilmCard());
const filters = generateFilters(filmCards);

const renderExtraSection = (container) => {
  for (let i = 0; i < EXTRA_CARDS_COUNT; i++) {
    render(container, createFilmCardTemplate(filmCards[i]), RenderPlace.BEFOREEND);
  }
};

render(userProfile, createUserProfileTemplate(), RenderPlace.BEFOREEND);
render(mainSection, createMainMenuTemplate(filters), RenderPlace.BEFOREEND);
render(mainSection, createSortTemplate(), RenderPlace.BEFOREEND);
render(mainSection, createFilmsSectionTemplate(), RenderPlace.BEFOREEND);

const filmsSection = document.querySelector('.films');

render(filmsSection, createFilmsListTemplate(), RenderPlace.BEFOREEND);

const filmsListSection = filmsSection.querySelector('.films-list');
const filmsListContainer = filmsListSection.querySelector('.films-list__container');
for (let i = 0; i < Math.min(filmCards.length, CARDS_PER_STEP); i++) {
  render(filmsListContainer, createFilmCardTemplate(filmCards[i]), RenderPlace.BEFOREEND);
}

if (filmCards.length > CARDS_PER_STEP) {
  let renderedFilmsCount = CARDS_PER_STEP;
  render(filmsListSection, createShowMoreButtonTemplate(), RenderPlace.BEFOREEND);
  const showMoreButton = filmsListSection.querySelector('.films-list__show-more');

  const showMoreButtonHandler = (evt) => {
    evt.preventDefault();
    filmCards
      .slice(renderedFilmsCount, renderedFilmsCount + CARDS_PER_STEP)
      .forEach((filmCard) => render(filmsListContainer, createFilmCardTemplate(filmCard), RenderPlace.BEFOREEND));
    renderedFilmsCount += CARDS_PER_STEP;

    if (renderedFilmsCount >= filmCards.length) {
      showMoreButton.remove();
    }
  };

  showMoreButton.addEventListener('click', showMoreButtonHandler);
}

render(filmsSection, createFilmsListExtraTemplate(), RenderPlace.BEFOREEND);
const extraSections = filmsSection.querySelectorAll('.films-list--extra');

const topRatedfilms = extraSections[TOP_RATED_FILMS].querySelector('.films-list__container');
const mostCommentedFilms = extraSections[MOST_COMMENTED_FILMS].querySelector('.films-list__container');
renderExtraSection(topRatedfilms);
renderExtraSection(mostCommentedFilms);

render(footerStatistics, createStatisticsTemplate(filmCards), RenderPlace.BEFOREEND);
render(document.body, createPopupTemplate(filmCards[0]), RenderPlace.BEFOREEND);
