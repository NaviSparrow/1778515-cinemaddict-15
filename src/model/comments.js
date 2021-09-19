import AbstractObserver from '../utils/abstract-observer.js';
import {deleteComment} from '../utils/utils';

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

  addComment(comment, scrollPosition) {
    this._comments = [
      ...this._comments,
      comment,
    ];
    this.notify(scrollPosition);
  }

  deleteComment(update, scrollPosition) {
    this._comments = deleteComment(this._comments, update, false);
    this.notify(scrollPosition);
  }
}
