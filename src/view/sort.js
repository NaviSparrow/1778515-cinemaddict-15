import AbstractView from './abstract.js';
import {SortType} from '../utils/utils.js';

const createSortTemplate = () => (
  `<ul class="sort">
<li><a href="#" class="sort__button sort__button--active" data-sort-type="${SortType.BY_DEFAULT}">Sort by default</a></li>
<li><a href="#" class="sort__button" data-sort-type="${SortType.BY_DATE}">Sort by date</a></li>
<li><a href="#" class="sort__button" data-sort-type="${SortType.BY_RATING}">Sort by rating</a></li>
</ul>`
);

export default class Sort extends AbstractView {
  constructor() {
    super();

    this._sortTypeClickHandler = this._sortTypeClickHandler.bind(this);
  }

  getTemplate() {
    return createSortTemplate();
  }

  _sortTypeClickHandler(evt) {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    this._callback.sortTypeClick(evt.target.dataset.sortType);
  }

  setSortTypeClickHandler(callback) {
    this._callback.sortTypeClick = callback;
    this.getElement().addEventListener('click', this._sortTypeClickHandler);
  }
}

