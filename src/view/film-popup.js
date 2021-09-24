import he from 'he';
import AbstractFilmView from './abstract-film-view';
import {CommentAction} from '../utils/utils.js';
import {createGenres, formatCommentDate, formatDate, formatDuration} from '../utils/film-utils.js';
import {isCmdEnterEvent, isCtrlEnterEvent, isEscEvent} from '../utils/dom-utils.js';

const createPopupDetailsTemplate = (data) => {
  const {
    title,
    rating,
    duration,
    genres,
    poster,
    description,
    originalTitle,
    director,
    writers,
    actors,
    releaseDate,
    country,
    ageRating,
    isInWatchList,
    isWatched,
    isFavorite,
    isDisabled,
  } = data;

  return (
    `<div class="film-details__info-wrap">
    <div class="film-details__poster">
      <img class="film-details__poster-img" src="${poster}" alt="">

      <p class="film-details__age">${ageRating}</p>
    </div>

    <div class="film-details__info">
      <div class="film-details__info-head">
        <div class="film-details__title-wrap">
          <h3 class="film-details__title">${title}</h3>
          <p class="film-details__title-original">Original: ${originalTitle}</p>
        </div>

        <div class="film-details__rating">
          <p class="film-details__total-rating">${rating}</p>
        </div>
      </div>

      <table class="film-details__table">
        <tr class="film-details__row">
          <td class="film-details__term">Director</td>
          <td class="film-details__cell">${director}</td>
        </tr>
        <tr class="film-details__row">
          <td class="film-details__term">Writers</td>
          <td class="film-details__cell">${writers.join(', ')}</td>
        </tr>
        <tr class="film-details__row">
          <td class="film-details__term">Actors</td>
          <td class="film-details__cell">${actors.join(', ')}</td>
        </tr>
        <tr class="film-details__row">
          <td class="film-details__term">Release Date</td>
          <td class="film-details__cell">${formatDate(releaseDate)}</td>
        </tr>
        <tr class="film-details__row">
          <td class="film-details__term">Runtime</td>
          <td class="film-details__cell">${formatDuration(duration)}</td>
        </tr>
        <tr class="film-details__row">
          <td class="film-details__term">Country</td>
          <td class="film-details__cell">${country}</td>
        </tr>
        <tr class="film-details__row">
          <td class="film-details__term">${genres.length > 1 ? 'Genres' : 'Genre'}</td>
          <td class="film-details__cell">
          ${createGenres(genres)}</td>
        </tr>
      </table>

      <p class="film-details__film-description">${description}</p>
    </div>
  </div>

  <section class="film-details__controls">
    <button type="button" class="film-details__control-button ${isInWatchList ? 'film-details__control-button--active' : ''} film-details__control-button--watchlist" id="watchlist" name="watchlist" ${isDisabled ? 'disabled' : ''}>Add to watchlist</button>
    <button type="button" class="film-details__control-button ${isWatched ? 'film-details__control-button--active' : ''} film-details__control-button--watched" id="watched" name="watched" ${isDisabled ? 'disabled' : ''}>Already watched</button>
    <button type="button" class="film-details__control-button ${isFavorite ? 'film-details__control-button--active' : ''} film-details__control-button--favorite" id="favorite" name="favorite" ${isDisabled ? 'disabled' : ''}>Add to favorites</button>
  </section>
</div>`
  );
};

const createCommentFromTemplate = (commentData, isDisabled, isDeleting) => {
  const {id, author, comment, date, emotion} = commentData;
  return (
    `<li class="film-details__comment">
            <span class="film-details__comment-emoji">
              <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-smile">
            </span>
            <div>
              <p class="film-details__comment-text">${comment}</p>
              <p class="film-details__comment-info">
                <span class="film-details__comment-author">${author}</span>
                <span class="film-details__comment-day">${formatCommentDate(date)}</span>
                <button class="film-details__comment-delete" data-comment-id="${id}" ${isDisabled ? 'disabled' : ''}>${isDeleting ? 'deleting...' : 'delete'}</button>
              </p>
            </div>
          </li>`);
};

const createCommentsListTemplate = (comments, isDisabled, isDeleting) => (
  `<ul class="film-details__comments-list">
        ${comments.map((comment) => createCommentFromTemplate(comment, isDisabled, isDeleting)).join('')}
    </ul>`
);

const createNewCommentFormTemplate = (newComment, isDisabled) => (
  `<div class="film-details__new-comment">
          <div class="film-details__add-emoji-label">${newComment.emotion !== null ? `<img src="./images/emoji/${newComment.emotion}.png" width="55" height="55">` : ''}</div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment" ${isDisabled ? 'disabled' : ''}>${he.encode(newComment.comment)}</textarea>
          </label>

          <div class="film-details__emoji-list">
            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
            <label class="film-details__emoji-label" for="emoji-smile">
              <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
            <label class="film-details__emoji-label" for="emoji-sleeping">
              <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
            <label class="film-details__emoji-label" for="emoji-puke">
              <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
            <label class="film-details__emoji-label" for="emoji-angry">
              <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
            </label>
          </div>
        </div>`
);


const createPopupTemplate = (filmData, commentsData) => {
  const {isComments, comments, newComment, isPosting, isDisabled, isDeleting} = filmData;

  return `<section class="film-details">
  <form class="film-details__inner" action="" method="get" ${isPosting ? 'disabled' : ''}>
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>

      ${createPopupDetailsTemplate(filmData)}

    <div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>
        <ul class="film-details__comments-list">
        ${isComments ? createCommentsListTemplate(commentsData, isDisabled, isDeleting) : ''}
        </ul>
        ${createNewCommentFormTemplate(newComment, isDisabled)}
      </section>
    </div>
  </form>
</section>`;
};

export default class FilmPopup extends AbstractFilmView {
  constructor(film, changeCommentsData) {
    super(film);
    this._data = FilmPopup.parseFilmToData(film, this._comments);
    this._comments = [];
    this._changeCommentsData = changeCommentsData;

    this._commentTextInputHandler = this._commentTextInputHandler.bind(this);
    this._emojiClickHandler = this._emojiClickHandler.bind(this);
    this._resetComment = this._resetComment.bind(this);
    this._deleteClickHandler = this._deleteClickHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);

    this._closeOnClickHandler = this._closeOnClickHandler.bind(this);
    this._closeOnKeyDownHandler = this._closeOnKeyDownHandler.bind(this);

    this._setInnerHandlers();
  }

  getNewCommentFormState()  {
    return this._data.newComment;
  }

  showComments(comments, scrollPosition) {
    this._comments = comments;
    this.updateData({
      serverComments: this._comments,
    }, scrollPosition);
  }

  getTemplate() {
    return createPopupTemplate(this._data, this._comments);
  }

  getScrollPosition() {
    return this.getElement().scrollTop;
  }


  removeElement() {
    super.removeElement();
    document.removeEventListener('keydown', this._closeOnKeyDownHandler);
  }

  setCloseClickHandler(callback) {
    this._callback.closePopup = callback;
    this.getElement()
      .querySelector('.film-details__close-btn')
      .addEventListener('click', this._closeOnClickHandler);
  }

  setCloseEscHandler(callback) {
    this._callback.closeEscPopup = callback;
    document.addEventListener('keydown', this._closeOnKeyDownHandler);
  }

  restoreHandlers() {
    super.restoreHandlers();
    this._setInnerHandlers();
    this.setCloseClickHandler(this._callback.closePopup);
    this.setCloseEscHandler(this._callback.closeEscPopup);
  }

  _getWatchedControl() {
    return this.getElement().querySelector('.film-details__control-button--watched');
  }

  _getAddToWatchListControl() {
    return this.getElement().querySelector('.film-details__control-button--watchlist');
  }

  _getFavoriteControl() {
    return this.getElement().querySelector('.film-details__control-button--favorite');
  }

  restoreForm(formState, scrollPosition) {
    this.updateData({
      newComment: formState,
    }, scrollPosition);
  }

  _resetComment() {
    this.updateData({
      newComment: {
        emotion: null,
        comment: '',
      },
    });
  }

  _deleteClickHandler(evt) {
    evt.preventDefault();
    const id = evt.target.dataset.commentId;
    this._changeCommentsData(
      CommentAction.DELETE_COMMENT,
      id,
      null,
    );
  }

  _commentTextInputHandler(evt) {
    evt.preventDefault();
    this.updateData({
      newComment: Object.assign(
        {},
        this._data.newComment,
        {comment: evt.target.value},
      ),
    }, 0, true);
  }

  _emojiClickHandler(evt) {
    evt.preventDefault();

    this.updateData({
      newComment: Object.assign(
        {},
        this._data.newComment,
        {emotion: evt.target.value},
      ),
    }, this.getScrollPosition());
  }


  _formSubmitHandler(evt) {
    if (isCtrlEnterEvent(evt) || isCmdEnterEvent(evt)) {
      this._changeCommentsData(
        CommentAction.ADD_COMMENT,
        this._data.newComment,
        FilmPopup.parseDataToFilm(this._data));
    }
  }

  _closeOnClickHandler(evt) {
    evt.preventDefault();
    this._resetComment();
    this._callback.closePopup(evt);
  }

  _closeOnKeyDownHandler(evt) {
    if (isEscEvent(evt)) {
      this._resetComment();
      this._callback.closeEscPopup();
    }
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector('.film-details__comment-input')
      .addEventListener('keydown', this._formSubmitHandler);

    this.getElement()
      .querySelector('.film-details__comment-input')
      .addEventListener('input', this._commentTextInputHandler);

    const emojiItems = this.getElement().querySelectorAll('.film-details__emoji-item');
    for (const item of emojiItems) {
      item.addEventListener('click', this._emojiClickHandler);
    }

    const deleteButtons = this.getElement().querySelectorAll('.film-details__comment-delete');
    for (const button of deleteButtons) {
      button.addEventListener('click', this._deleteClickHandler);
    }
  }

  static parseFilmToData(film, serverComments) {
    return Object.assign(
      {},
      film,
      {
        serverComments: serverComments,
        isComments: serverComments !== [],
        newComment: {
          comment: '',
          emotion: null,
        },
        isDisabled: false,
        isDeleting: false,
        isPosting: false,
      },
    );
  }

  static parseDataToFilm(data) {
    data = Object.assign({}, data);
    delete data.isComments;
    delete data.serverComments;
    delete data.localComment;
    delete data.isDisabled;
    delete data.isDeleting;

    return data;
  }
}
