import AbstractView from './abstract.js';

const createNewCommentTemplate = (commentData, isDisabled) => {
  const {author, comment, date, emotion} = commentData;
  return (
    `<li class="film-details__comment">
            <span class="film-details__comment-emoji">
              <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-smile">
            </span>
            <div>
              <p class="film-details__comment-text">${comment}</p>
              <p class="film-details__comment-info">
                <span class="film-details__comment-author">${author}</span>
                <span class="film-details__comment-day">${date}</span>
                <button class="film-details__comment-delete" ${isDisabled ? 'disabled' : ''}>Delete</button>
              </p>
            </div>
          </li>`
  );
};

export default class CommentForm extends AbstractView {
  constructor(commentData) {
    super();
    this._commentData = commentData;
  }

  getTemplate() {
    return createNewCommentTemplate(this._commentData);
  }

}
