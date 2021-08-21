import AbstractView from './abstract.js';

const createShowMoreButtonTemplate = () => '<button class="films-list__show-more">Show more</button>';

export default class ShowMoreButton extends AbstractView {
  constructor() {
    super();
    this._clickHandler = this._clickHandler.bind(this);
  }

  getTemplate() {
    return createShowMoreButtonTemplate();
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.btnClick();
  }

  setClickHandler(callback) {
    this._callback.btnClick = callback;
    this.getElement().addEventListener('click', this._clickHandler);
  }
}
