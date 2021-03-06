import AbstractView from './abstract.js';
import {FilterType} from '../utils/filter-utils';
import {MenuItem} from '../utils/utils.js';

const createFilterItemTemplate = (filter, currentFilterType) => {
  const {type, name, count} = filter;

  return (
    `<a href="${type}" class="main-navigation__item ${type === currentFilterType ? 'main-navigation__item--active' : ''}">
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
    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createFiltersMenuTemplate(this._filters, this._currentFilter);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    if (evt.target.hash) {
      this._callback.onClickChange(evt.target.hash);
    }
  }

  _menuClickHandler(evt) {
    evt.preventDefault();

    if(evt.target.hash) {
      this._callback.onMenuClick(evt.target.hash);
      this._updateActiveMenuItem(evt.target.hash);
    }
  }

  _updateActiveMenuItem(menuItem) {
    const additionalActiveClassName = 'main-navigation__additional--active';
    const statsItem = this.getElement().querySelector('.main-navigation__additional');
    const currentActiveMenuItem = this.getElement().querySelector('.main-navigation__item--active');
    if (menuItem === MenuItem.STATISTICS) {
      if (!statsItem.classList.contains(additionalActiveClassName)) {
        statsItem.classList.add(additionalActiveClassName);

        currentActiveMenuItem.classList.remove('main-navigation__item--active');
      }
    } else {
      statsItem.classList.remove('main-navigation__additional--active');
    }
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.onClickChange = callback;
    this.getElement().addEventListener('click', this._filterTypeChangeHandler);
  }

  setMenuClickHandler(callback) {
    this._callback.onMenuClick = callback;
    this.getElement().addEventListener('click', this._menuClickHandler);
  }
}
