import AbstractView from './abstract.js';

export default class Smart extends AbstractView {
  constructor() {
    super();
    this._data = {};
    this._commentData = {};
  }

  updateData(update, scrollPosition) {
    if (!update) {
      return;
    }

    this._data = Object.assign(
      {},
      this._data,
      update,
    );

    this.updateElement(scrollPosition);
  }

  updateCommentData(update, justDataUpdating, scrollPosition) {
    if (!update) {
      return;
    }

    this._commentData = Object.assign(
      {},
      this._commentData,
      update,
    );

    if (justDataUpdating) {
      return;
    }

    this.updateElement(scrollPosition);
  }

  updateElement(scrollPosition) {

    const prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.getElement();

    parent.replaceChild(newElement, prevElement);

    this.restoreHandlers();
    this.getElement().scrollTo(0, scrollPosition);
  }

  restoreHandlers() {
    throw new Error('Abstract method not implemented: resetHandlers'); }

}
