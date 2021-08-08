import {createElement} from '../utils/dom-utils.js';

const createStatisticsTemplate = (filmsLength) => `<p>${filmsLength} movies inside</p>`;

export default class Statistics {
  constructor(filmsLength) {
    this._filmsLength = filmsLength;
    this._element = null;
  }

  getTemplate() {
    return createStatisticsTemplate(this._filmsLength);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
