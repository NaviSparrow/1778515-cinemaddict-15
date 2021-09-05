import AbstractObserver from '../utils/abstract-observer.js';
import {FilterType} from '../utils/filter-utils.js';

export default class Filter extends AbstractObserver {
  constructor() {
    super();
    this._activeFilter = FilterType.ALL;
  }

  setFilters(updateType, filter) {
    this._activeFilter = filter;
    this.notify(updateType, filter);
  }

  getFilter() {
    return this._activeFilter;
  }
}
