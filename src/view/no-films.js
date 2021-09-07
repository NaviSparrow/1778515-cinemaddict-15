import AbstractView from './abstract.js';
import {FilterType} from '../utils/filter-utils.js';

const noFilmsTextType = {
  [FilterType.ALL]: 'There are no movies in our database',
  [FilterType.WATCHLIST]: 'There are no movies to watch now',
  [FilterType.HISTORY]: 'There are no watched movies now',
  [FilterType.FAVORITES]: 'There are no favorite movies now',
};

const createNoFilmsTemplate = (currentFilter) => (
  `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title">${noFilmsTextType[currentFilter]}</h2>
    </section>
  </section>`
);

export default class NoFilmsInDatabase extends AbstractView {
  constructor(filterType) {
    super();
    this._filterType = filterType;
  }

  getTemplate() {
    return createNoFilmsTemplate(this._filterType);
  }
}

