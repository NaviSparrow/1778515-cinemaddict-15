import FilmsSectionView  from './view/films-section.js';
import FilmsListView from './view/films-list.js';
import FilmCardView from './view/film-card.js';
import FilmPopupView from './view/film-popup.js';
import ShowMoreButtonView from './view/show-more-button.js';
import TopRatedFilmsView from './view/top-rated-films.js';
import MostCommentedFilmsView from './view/most-commented-films.js';
import FiltersView from './view/filters.js';
import SortView from './view/sort.js';
import UserProfileView from './view/user-profile.js';
import StatisticsView from './view/statistics.js';
import { generateFilmCard } from './mock/film-card.js';
import { generateFilters } from './mock/filters.js';
import { RenderPlace, Selector, TypeOfEvent, render } from './utils/dom-utils.js';

const CARDS_COUNT = 15;
const CARDS_PER_STEP = 5;
const EXTRA_CARDS_COUNT = 2;

const filmCards = new Array(CARDS_COUNT).fill().map(() => generateFilmCard());
const filters = generateFilters(filmCards);

const renderFilmCard = (container, filmCard) => {
  const filmCardComponent = new FilmCardView(filmCard);
  const filmPopupComponent = new FilmPopupView(filmCard);

  const findPopup = () => document.body.querySelector('.film-details');

  const openOnClickHandler = () => {
    if(findPopup()) {
      document.body.removeChild(findPopup());
    }
    document.body.appendChild(filmPopupComponent.getElement());
    document.body.classList.add('hide-overflow');
  };

  const closeOnClickHandler = () => {
    document.body.removeChild(filmPopupComponent.getElement());
    document.body.classList.remove('hide-overflow');
  };

  filmCardComponent.applyListener(Selector.TITLE, TypeOfEvent.CLICK, openOnClickHandler);
  filmCardComponent.applyListener(Selector.POSTER, TypeOfEvent.CLICK, openOnClickHandler);
  filmCardComponent.applyListener(Selector.COMMENTS, TypeOfEvent.CLICK, openOnClickHandler);
  filmPopupComponent.applyListener(Selector.CLOSE_BUTTON, TypeOfEvent.CLICK, closeOnClickHandler);

  render(container, filmCardComponent.getElement(), RenderPlace.BEFOREEND);
};

const renderExtraSection = (container) => {
  for (let i = 0; i < EXTRA_CARDS_COUNT; i++) {
    renderFilmCard(container, filmCards[i]);
  }
};

const mainSection = document.querySelector('.main');
const header = document.querySelector('.header');
const footerStatistics = document.querySelector('.footer__statistics');

render(header, new UserProfileView().getElement(), RenderPlace.BEFOREEND);
render(mainSection, new FiltersView(filters).getElement(), RenderPlace.BEFOREEND);
render(mainSection, new SortView().getElement(), RenderPlace.BEFOREEND);

const filmsSectionComponent = new FilmsSectionView();
render(mainSection, filmsSectionComponent.getElement(), RenderPlace.BEFOREEND);
render(filmsSectionComponent.getElement(), new FilmsListView().getElement(), RenderPlace.BEFOREEND);

const filmsListContainer = filmsSectionComponent.getElement().querySelector('.films-list__container');
for (let i = 0; i < Math.min(filmCards.length, CARDS_PER_STEP); i++) {
  renderFilmCard(filmsListContainer, filmCards[i]);
}

if (filmCards.length > CARDS_PER_STEP) {
  let renderedFilmsCount = CARDS_PER_STEP;
  const showMoreButton = new ShowMoreButtonView();
  render(filmsSectionComponent.getElement(), showMoreButton.getElement(), RenderPlace.BEFOREEND);

  const showMoreButtonHandler = (evt) => {
    evt.preventDefault();
    filmCards
      .slice(renderedFilmsCount, renderedFilmsCount + CARDS_PER_STEP)
      .forEach((filmCard) => renderFilmCard(filmsListContainer, filmCard, RenderPlace.BEFOREEND));
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

render(footerStatistics, new StatisticsView(filmCards.length).getElement(), RenderPlace.BEFOREEND);

