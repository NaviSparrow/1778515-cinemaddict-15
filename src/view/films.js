import {createElement} from '../utils/dom-utils.js';

const createFilmsSectionTemplate = () => '<section class="films"></section>';

export default class FilmsSection {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createFilmsSectionTemplate();
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
