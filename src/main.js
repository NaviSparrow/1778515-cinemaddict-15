import FilmsSectionView  from './view/films.js';
import FilmsListView from './view/films-list.js';
import FilmCardView from './view/film-card.js';
import FilmPopupView from './view/popup.js';
import ShowMoreButtonView from './view/show-more-button.js';
import TopRatedFilmsView from './view/top-rated-extra-section.js';
import MostCommentedFilmsView from './view/most-commented-extra-section';
import FiltersView from './view/filters-menu';
import SortView from './view/sort.js';
import UserProfileView from './view/user.js';
import StatisticsView from './view/statistics.js';
import { generateFilmCard } from './mock/film-card.js';
import { generateFilters } from './mock/filters.js';
import { RenderPlace, render } from './utils/dom-utils.js';

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
    render(container, new FilmCardView(filmCards[i]).getElement(), RenderPlace.BEFOREEND);
  }
};

render(header, new UserProfileView().getElement(), RenderPlace.BEFOREEND);
render(mainSection, new FiltersView(filters).getElement(), RenderPlace.BEFOREEND);
render(mainSection, new SortView().getElement(), RenderPlace.BEFOREEND);

const filmsSectionComponent = new FilmsSectionView();
render(mainSection, filmsSectionComponent.getElement(), RenderPlace.BEFOREEND);
render(filmsSectionComponent.getElement(), new FilmsListView().getElement(), RenderPlace.BEFOREEND);

const filmsListContainer = filmsSectionComponent.getElement().querySelector('.films-list__container');
for (let i = 0; i < Math.min(filmCards.length, CARDS_PER_STEP); i++) {
  render(filmsListContainer, new FilmCardView(filmCards[i]).getElement(), RenderPlace.BEFOREEND);
}

if (filmCards.length > CARDS_PER_STEP) {
  let renderedFilmsCount = CARDS_PER_STEP;
  const showMoreButton = new ShowMoreButtonView();
  render(filmsSectionComponent.getElement(), showMoreButton.getElement(), RenderPlace.BEFOREEND);

  const showMoreButtonHandler = (evt) => {
    evt.preventDefault();
    filmCards
      .slice(renderedFilmsCount, renderedFilmsCount + CARDS_PER_STEP)
      .forEach((filmCard) => render(filmsListContainer, new FilmCardView(filmCard).getElement(), RenderPlace.BEFOREEND));
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

render(filmsSectionComponent.getElement(), topRatedFilms.getElement(), RenderPlace.BEFOREEND);
render(filmsSectionComponent.getElement(), mostCommentedFilms.getElement(), RenderPlace.BEFOREEND);

renderExtraSection(topRatedFilms.getElement().querySelector('.films-list__container'));
renderExtraSection(mostCommentedFilms.getElement().querySelector('.films-list__container'));

render(footerStatistics, new StatisticsView(filmCards).getElement(), RenderPlace.BEFOREEND);
render(document.body, new FilmPopupView(filmCards[0]).getElement(), RenderPlace.BEFOREEND);
