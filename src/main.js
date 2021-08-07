import FilmsSectionView  from './view/films.js';
import FilmsListView from './view/films-list.js';
import TopRatedFilmsView from './view/top-rated-extra-section.js';
import MostCommentedFilmsView from './view/most-commented-extra-section';
import SortView from './view/sort.js';
import UserProfileView from './view/user.js';
import ShowMoreButtonView from './view/show-more-button.js';
import FiltersView from './view/filters-menu';
import { createFilmCardTemplate } from './view/film-card.js';
import { createPopupTemplate } from './view/popup.js';
import { createStatisticsTemplate } from './view/statistics.js';
import { generateFilmCard } from './mock/film-card.js';
import { RenderPlace, renderTemplate, renderElement } from './utils/dom-utils.js';
import { generateFilters } from './mock/filters.js';

const CARDS_COUNT = 15;
const CARDS_PER_STEP = 5;
const EXTRA_CARDS_COUNT = 2;

const filmCards = new Array(CARDS_COUNT).fill().map(() => generateFilmCard());
const filters = generateFilters(filmCards);

const mainSection = document.querySelector('.main');
const header = document.querySelector('.header');
const footerStatistics = document.querySelector('.footer__statistics');

const renderExtraSection = (container) => {
  for (let i = 0; i < EXTRA_CARDS_COUNT; i++) {
    renderTemplate(container, createFilmCardTemplate(filmCards[i]), RenderPlace.BEFOREEND);
  }
};

renderElement(header, new UserProfileView().getElement(), RenderPlace.BEFOREEND);
renderElement(mainSection, new FiltersView(filters).getElement(), RenderPlace.BEFOREEND);
renderElement(mainSection, new SortView().getElement(), RenderPlace.BEFOREEND);

const filmsSectionComponent = new FilmsSectionView();
renderElement(mainSection, filmsSectionComponent.getElement(), RenderPlace.BEFOREEND);
renderElement(filmsSectionComponent.getElement(), new FilmsListView().getElement(), RenderPlace.BEFOREEND);

const filmsListContainer = filmsSectionComponent.getElement().querySelector('.films-list__container');
for (let i = 0; i < Math.min(filmCards.length, CARDS_PER_STEP); i++) {
  renderTemplate(filmsListContainer, createFilmCardTemplate(filmCards[i]), RenderPlace.BEFOREEND);
}

if (filmCards.length > CARDS_PER_STEP) {
  let renderedFilmsCount = CARDS_PER_STEP;
  const showMoreButton = new ShowMoreButtonView();
  renderElement(filmsSectionComponent.getElement(), showMoreButton.getElement(), RenderPlace.BEFOREEND);

  const showMoreButtonHandler = (evt) => {
    evt.preventDefault();
    filmCards
      .slice(renderedFilmsCount, renderedFilmsCount + CARDS_PER_STEP)
      .forEach((filmCard) => renderTemplate(filmsListContainer, createFilmCardTemplate(filmCard), RenderPlace.BEFOREEND));
    renderedFilmsCount += CARDS_PER_STEP;

    if (renderedFilmsCount >= filmCards.length) {
      showMoreButton.getElement().remove();
      showMoreButton.removeElement();
    }
  };

  showMoreButton.getElement().addEventListener('click', showMoreButtonHandler);
}

const topRatedFilms = new TopRatedFilmsView();
const mostCommentedFilms = new MostCommentedFilmsView();

renderElement(filmsSectionComponent.getElement(), topRatedFilms.getElement(), RenderPlace.BEFOREEND);
renderElement(filmsSectionComponent.getElement(), mostCommentedFilms.getElement(), RenderPlace.BEFOREEND);

renderExtraSection(topRatedFilms.getElement().querySelector('.films-list__container'));
renderExtraSection(mostCommentedFilms.getElement().querySelector('.films-list__container'));

renderTemplate(footerStatistics, createStatisticsTemplate(filmCards), RenderPlace.BEFOREEND);
renderTemplate(document.body, createPopupTemplate(filmCards[0]), RenderPlace.BEFOREEND);
