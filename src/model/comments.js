import AbstractObserver from '../utils/abstract-observer.js';

export default class Comments extends AbstractObserver {
  constructor() {
    super();
    this._comments = [];
  }

  setComments(comments) {
    this._comments = comments.slice();
    this.notify();
  }

  getComments() {
    return this._comments;
  }

  addComment(updateType, update) {
    this._comments = [
      ...this._comments,
      update,
    ];
    this.notify(update);
  }

  deleteComment(update) {
    const index = this._comments.findIndex((comment) => comment.id === update);
    this._comments = [
      ...this._comments.slice(0, index),
      ...this._comments.slice(index + 1),
    ];
    this.notify();
  }
}
