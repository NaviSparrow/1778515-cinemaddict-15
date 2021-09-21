import AbstractView from './abstract.js';

export default class CommentForm extends AbstractView {
  constructor(template, commentData, isDisabled, isDeleting) {
    super();
    this._commentData = commentData;
    this._isDisabled = isDisabled;
    this._isDeleting = isDeleting;
    this._createCommentFormTemplate = template;
  }

  getTemplate() {
    return this._createCommentFormTemplate(this._commentData, this._isDeleting, this._isDeleting);
  }

}
