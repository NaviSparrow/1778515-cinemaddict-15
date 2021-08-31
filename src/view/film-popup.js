import SmartView from './smart.js';
import {isCtrlEnterEvent, isEscEvent} from '../utils/dom-utils.js';
import {formatDuration, formatDate, createGenres} from '../utils/film-utils.js';

const createPopupTemplate = (data) => {
  const {title, rating, duration, genres, poster, description, comments, originalTitle, director, writers, actors, releaseDate, country, ageRating, isInWatchList, isWatched, isFavorite, localComment, isComments} = data;

  const createPopupDetailsTemplate = () => (
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
    <button type="button" class="film-details__control-button ${isInWatchList ? 'film-details__control-button--active' : ''} film-details__control-button--watchlist" id="watchlist" name="watchlist">Add to watchlist</button>
    <button type="button" class="film-details__control-button ${isWatched ? 'film-details__control-button--active' : ''} film-details__control-button--watched" id="watched" name="watched">Already watched</button>
    <button type="button" class="film-details__control-button ${isFavorite ? 'film-details__control-button--active' : ''} film-details__control-button--favorite" id="favorite" name="favorite">Add to favorites</button>
  </section>
</div>`
  );

  const createCommentsListTemplate = () => (
    `<ul class="film-details__comments-list">
        ${comments.map(({author, comment, date, emotion}) => `<li class="film-details__comment">
            <span class="film-details__comment-emoji">
              <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-smile">
            </span>
            <div>
              <p class="film-details__comment-text">${comment}</p>
              <p class="film-details__comment-info">
                <span class="film-details__comment-author">${author}</span>
                <span class="film-details__comment-day">${date}</span>
                <button class="film-details__comment-delete">Delete</button>
              </p>
            </div>
          </li>`).join('')}
    </ul>`
  );

  const createNewCommentTemplate = ({emotion, comment} = localComment) => (
    `<div class="film-details__new-comment">
          <div class="film-details__add-emoji-label">${emotion ? `<img src="./images/emoji/${emotion}.png" width="79" height="68">` : ''}</div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${comment}</textarea>
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

  return `<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      ${createPopupDetailsTemplate()}

    <div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

        ${isComments ? createCommentsListTemplate() : ''}

        ${createNewCommentTemplate(localComment)}
      </section>
    </div>
  </form>
</section>`;
};

export default class FilmPopup extends SmartView {
  constructor(film) {
    super();
    this._data = FilmPopup.parseFilmToData(film);

    this._closePopupHandler = this._closePopupHandler.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._addToWatchListClickHandler = this._addToWatchListClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._commentTextInputHandler = this._commentTextInputHandler.bind(this);
    this._emojiClickHandler = this._emojiClickHandler.bind(this);
    this._resetComment = this._resetComment.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    return createPopupTemplate(this._data);
  }

  _resetComment() {
    this.updateData({
      localComment: Object.assign(
        {},
        this._data.localComment,
        {
          emotion: null,
          comment: '',
        },
      ),
    });
  }

  _getScrollPosition() {
    return this.getElement().scrollTop;
  }

  _watchedClickHandler(evt) {
    evt.preventDefault();
    this.updateData({
      isWatched: !this._data.isWatched,
    }, this._getScrollPosition());
  }

  _addToWatchListClickHandler(evt) {
    evt.preventDefault();
    this.updateData({
      isInWatchList: !this._data.isInWatchList,
    }, this._getScrollPosition());
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this.updateData({
      isFavorite: !this._data.isFavorite,
    }, this._getScrollPosition());
  }

  _closePopupHandler(evt) {
    evt.preventDefault();
    this._resetComment();
    this.getElement().remove();
    document.body.classList.remove('hide-overflow');
  }

  _escKeyDownHandler(evt) {
    if (isEscEvent(evt)) {
      evt.preventDefault();
      this._resetComment();
      this.getElement().remove();
      document.body.classList.remove('hide-overflow');
    }
  }

  _commentTextInputHandler(evt) {
    evt.preventDefault();
    this.updateData({
      localComment: Object.assign(
        {},
        this._data.localComment,
        {comment: evt.target.value},
      ),
    }, this._getScrollPosition(), true);
  }

  _emojiClickHandler(evt) {
    evt.preventDefault();
    this.updateData({
      localComment: Object.assign(
        {},
        this._data.localComment,
        {emotion: evt.target.value},
      ),
    }, this._getScrollPosition());
  }

  _formSubmitHandler(evt) {
    if (isCtrlEnterEvent(evt)) {
      evt.preventDefault();
      console.log('submit');
      this._callback.formSubmit(FilmPopup.parseDataToFilm(this._data));
    }
  }

  static parseFilmToData(film) {
    return Object.assign(
      {},
      film,
      {
        isComments: film.comments.length !== 0,
      },
    );
  }

  static parseDataToFilm(data) {
    data = Object.assign({}, data);

    delete data.isComments;

    return data;
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector('.film-details__comment-input').addEventListener('keydown', this._formSubmitHandler);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
  }

  _setInnerHandlers() {
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
      .querySelector('.film-details__close-btn')
      .addEventListener('click', this._closePopupHandler);
    this.getElement()
      .querySelector('.film-details__comment-input')
      .addEventListener('input', this._commentTextInputHandler);
    document.addEventListener('keydown', this._escKeyDownHandler, {once: true});

    const emojiItems =  this.getElement().querySelectorAll('.film-details__emoji-item');
    for (const item of emojiItems) {
      item.addEventListener('click', this._emojiClickHandler);
    }
  }
}
