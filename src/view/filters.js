import AbstractView from './abstract.js';
import {FilterType} from '../utils/filter-utils';

const createFilterItemTemplate = (filter, currentFilterType) => {
  const {type, name, count} = filter;

  return (
    `<a href="#${type}" class="main-navigation__item ${type === currentFilterType ? 'main-navigation__item--active' : ''}">
      ${type === FilterType.ALL
      ? `${name} movies`
      : `${name}<span class="main-navigation__item-count">${count}</span>`}</a>`
  );
};

const createFiltersMenuTemplate = (filters, currentFilterType) => {
  const filterItemsTemplate = filters.map((filter) => createFilterItemTemplate(filter, currentFilterType)).join('');

  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
        ${filterItemsTemplate}
      </div>
     <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
  );
};

export default class Filters extends AbstractView {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilterType;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createFiltersMenuTemplate(this._filters, this._currentFilter);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.onClickChange();
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.onClickChange = callback;
    this.getElement().addEventListener('click', this._filterTypeChangeHandler);
  }
}
