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
import NoFilmsInDatabaseView from './view/no-films-in-database.js';
import { generateFilmCard } from './mock/film-card.js';
import { generateFilters } from './mock/filters.js';
import {RenderPlace, render, remove, isEscEvent} from './utils/dom-utils.js';

const CARDS_COUNT = 20;
const CARDS_PER_STEP = 5;
const EXTRA_CARDS_COUNT = 2;

const mainSection = document.querySelector('.main');
const header = document.querySelector('.header');
const footerStatistics = document.querySelector('.footer__statistics');

const filmCards = new Array(CARDS_COUNT).fill().map(() => generateFilmCard());
const filters = generateFilters(filmCards);

const renderFilmCard = (container, filmCard) => {
  const filmCardComponent = new FilmCardView(filmCard);
  const filmPopupComponent = new FilmPopupView(filmCard);

  const findPopup = () => document.body.querySelector('.film-details');

  const closeOnClickHandler = () => {
    remove(filmPopupComponent);
    document.body.classList.remove('hide-overflow');
  };

  const closeOnKeydownHandler = (evt) => {
    if (isEscEvent(evt)) {
      evt.preventDefault();
      closeOnClickHandler();
    }
  };

  const openOnClickHandler = () => {
    if(findPopup()) {
      document.body.removeChild(findPopup());
    }
    render(document.body, filmPopupComponent, RenderPlace.BEFOREEND);
    document.body.classList.add('hide-overflow');
    document.addEventListener('keydown', closeOnKeydownHandler, {once: true});
  };

  filmCardComponent.setClickHandler(openOnClickHandler);
  filmPopupComponent.setClickHandler(closeOnClickHandler);

  render(container, filmCardComponent, RenderPlace.BEFOREEND);
};

const renderSection = (sectionContainer, films) => {
  const filmsSectionComponent = new FilmsSectionView();
  const filmsListComponent = new FilmsListView();

  if (films.length === 0) {
    render(mainSection, new NoFilmsInDatabaseView, RenderPlace.BEFOREEND);
    return;
  }

  render(mainSection, new SortView, RenderPlace.BEFOREEND);
  render(sectionContainer, filmsSectionComponent, RenderPlace.BEFOREEND);
  render(filmsSectionComponent, filmsListComponent, RenderPlace.BEFOREEND);

  const filmsListContainer = filmsListComponent.getElement().querySelector('.films-list__container');
  for (let i = 0; i < Math.min(filmCards.length, CARDS_PER_STEP); i++) {
    renderFilmCard(filmsListContainer, films[i]);
  }

  if (films.length > CARDS_PER_STEP) {
    let renderedFilmsCount = CARDS_PER_STEP;
    const showMoreButton = new ShowMoreButtonView();
    render(filmsSectionComponent, showMoreButton, RenderPlace.BEFOREEND);

    const showMoreButtonHandler = () => {
      films
        .slice(renderedFilmsCount, renderedFilmsCount + CARDS_PER_STEP)
        .forEach((film) => renderFilmCard(filmsListContainer, film, RenderPlace.BEFOREEND));
      renderedFilmsCount += CARDS_PER_STEP;

      if (renderedFilmsCount >= films.length) {
        remove(showMoreButton);
      }
    };

    showMoreButton.setClickHandler(showMoreButtonHandler);
  }

  const renderExtraSection = () => {
    const renderFilms = (container) => {
      for (let i = 0; i < EXTRA_CARDS_COUNT; i++) {
        renderFilmCard(container, films[i]);
      }
    };

    const topRatedFilms = new TopRatedFilmsView();
    const mostCommentedFilms = new MostCommentedFilmsView();
    render(filmsSectionComponent, topRatedFilms, RenderPlace.BEFOREEND);
    render(filmsSectionComponent, mostCommentedFilms, RenderPlace.BEFOREEND);
    renderFilms(topRatedFilms.getElement().querySelector('.films-list__container'));
    renderFilms(mostCommentedFilms.getElement().querySelector('.films-list__container'));
  };

  renderExtraSection();
};

render(header, new UserProfileView, RenderPlace.BEFOREEND);
render(mainSection, new FiltersView(filters), RenderPlace.BEFOREEND);
render(footerStatistics, new StatisticsView(filmCards.length), RenderPlace.BEFOREEND);
renderSection(mainSection, filmCards);


