import  he from 'he';
import SmartView from './smart.js';
import CommentFormView from './comment-form.js';
import {FilterType} from '../utils/filter-utils';
import {UpdateType, UserAction, CommentAction} from '../utils/utils.js';
import {formatDuration, formatDate, createGenres, formatCommentDate, updateWatchingDate} from '../utils/film-utils.js';
import {isCtrlEnterEvent, render, RenderPlace} from '../utils/dom-utils.js';


const createPopupDetailsTemplate = (data) => {
  const {title, rating, duration, genres, poster, description, originalTitle, director, writers, actors, releaseDate, country, ageRating, isInWatchList, isWatched, isFavorite, isDisabled} = data;

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

const createCommentsListTemplate = (comments, isDisabled, isDeleting) => (
  `<ul class="film-details__comments-list">
        ${comments.map(({id, author, comment, date, emotion}) => `<li class="film-details__comment">
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
          </li>`).join('')}
    </ul>`
);

const createNewCommentFormTemplate = (formNewComment, isDisabled) => (
  `<div class="film-details__new-comment">
          <div class="film-details__add-emoji-label">${formNewComment.emotion !== null ? `<img src="./images/emoji/${formNewComment.emotion}.png" width="79" height="68">` : ''}</div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment" ${isDisabled ? 'disabled' : ''}>${he.encode(formNewComment.comment)}</textarea>
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
  const {isComments, comments, formNewComment, isPosting, isDisabled, isDeleting} = filmData;

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
        ${createNewCommentFormTemplate(formNewComment, isDisabled)}
      </section>
    </div>
  </form>
</section>`;
};

export default class FilmPopup extends SmartView {
  constructor(film, changeData, changeCommentsData, currentFilter, commentsModel) {
    super();
    this._film = film;
    this._data = FilmPopup.parseFilmToData(film, this._comments);
    this._changeData = changeData;
    this._changeCommentsData = changeCommentsData;
    this._currentFilter = currentFilter;
    this._commentsModel = commentsModel;
    this._comments = [];

    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._addToWatchListClickHandler = this._addToWatchListClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._commentTextInputHandler = this._commentTextInputHandler.bind(this);
    this._emojiClickHandler = this._emojiClickHandler.bind(this);
    this._resetComment = this._resetComment.bind(this);
    this._closeOnClickHandler = this._closeOnClickHandler.bind(this);
    this._closeOnKeyDownHandler = this._closeOnKeyDownHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._deleteClickHandler = this._deleteClickHandler.bind(this);

    this._setInnerHandlers();
  }

  getComments() {
    this._comments = this._commentsModel.getComments();
    this.updateData({
      serverComments: this._comments,
    });
  }

  getTemplate() {
    return createPopupTemplate(this._data, this._comments);
  }

  _resetComment() {
    this.updateData({
      formNewComment: {
        emotion: null,
        comment: '',
      },
    });
  }

  _deleteClickHandler (evt) {
    evt.preventDefault();
    const id = evt.target.dataset.commentId;
    this._changeCommentsData(
      CommentAction.DELETE_COMMENT,
      id,
    );
  }

  _getScrollPosition() {
    return this.getElement().scrollTop;
  }

  _watchedClickHandler(evt) {
    evt.preventDefault();
    const watchingDate = updateWatchingDate(this._data);
    this._changeData(
      UserAction.BUTTON_CLICK,
      this._currentFilter === FilterType.ALL ? UpdateType.PATCH : UpdateType.MAJOR,
      Object.assign(
        {},
        FilmPopup.parseDataToFilm(this._data),
        {
          isWatched: !this._data.isWatched,
          watchingDate,
        },
      ),
    );

    this.updateData({
      isWatched: !this._data.isWatched,
    }, this._getScrollPosition());
  }

  _addToWatchListClickHandler(evt) {
    evt.preventDefault();
    this._changeData(
      UserAction.BUTTON_CLICK,
      this._currentFilter === FilterType.ALL ? UpdateType.PATCH : UpdateType.MAJOR,
      Object.assign(
        {},
        FilmPopup.parseDataToFilm(this._data),
        {
          isInWatchList: !this._data.isInWatchList,
        },
      ),
    );

    this.updateData({
      isInWatchList: !this._data.isInWatchList,
    }, this._getScrollPosition());
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._changeData(
      UserAction.BUTTON_CLICK,
      this._currentFilter === FilterType.ALL
        ? UpdateType.PATCH
        : UpdateType.MAJOR,
      Object.assign(
        {},
        FilmPopup.parseDataToFilm(this._data),
        {
          isFavorite: !this._data.isFavorite,
        },
      ),
    );

    this.updateData({
      isFavorite: !this._data.isFavorite,
    }, this._getScrollPosition());
  }

  _commentTextInputHandler(evt) {
    evt.preventDefault();
    this.updateData({
      formNewComment: Object.assign(
        {},
        this._data.formNewComment,
        {comment: evt.target.value},
      ),
    }, this._getScrollPosition(), true);
  }

  _emojiClickHandler(evt) {
    evt.preventDefault();

    this.updateData({
      formNewComment: Object.assign(
        {},
        this._data.formNewComment,
        {emotion: evt.target.value},
      ),
    }, this._getScrollPosition());
  }

  static parseFilmToData(film, serverComments) {
    return Object.assign(
      {},
      film,
      {
        serverComments: serverComments,
        isComments: serverComments !== [],
        formNewComment: {
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

  _getCommentsContainer() {
    return this.getElement().querySelector('.film-details__comments-list');
  }

  _formSubmitHandler(evt) {
    if (isCtrlEnterEvent(evt)) {
      this._changeCommentsData(
        CommentAction.ADD_COMMENT,
        this._data.formNewComment,
        FilmPopup.parseDataToFilm(this._data),
      );

      this._newCommentComponent = new CommentFormView(this._data.formNewComment, this._data.isDisabled);
      render(this._getCommentsContainer(), this._newCommentComponent, RenderPlace.BEFOREEND);
    }
  }

  _closeOnClickHandler(evt) {
    evt.preventDefault();
    this._callback.closePopup(evt);
  }

  _closeOnKeyDownHandler(evt) {
    this._callback.closeEscPopup(evt);
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
    this._setInnerHandlers();
    this.setCloseClickHandler(this._callback.closePopup);
    this.setCloseEscHandler(this._callback.closeEscPopup);
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector('.film-details__comment-input')
      .addEventListener('keydown', this._formSubmitHandler);
    this.getElement()
      .querySelector('.film-details__control-button--watched')
      .addEventListener('click', this._watchedClickHandler);
    this.getElement()
      .querySelector('.film-details__control-button--watchlist')
      .addEventListener('click', this._addToWatchListClickHandler);
    this.getElement()
      .querySelector('.film-details__control-button--favorite')
      .addEventListener('click', this._favoriteClickHandler);
    this.getElement()
      .querySelector('.film-details__comment-input')
      .addEventListener('input', this._commentTextInputHandler);
    const emojiItems =  this.getElement().querySelectorAll('.film-details__emoji-item');
    for (const item of emojiItems) {
      item.addEventListener('click', this._emojiClickHandler);
    }

    const deleteButtons = this.getElement().querySelectorAll('.film-details__comment-delete');
    for (const button of deleteButtons) {
      button.addEventListener('click', this._deleteClickHandler);
    }
  }
}
