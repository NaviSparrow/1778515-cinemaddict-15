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
  getTemplate() {
    return createSortTemplate();
  }
}

