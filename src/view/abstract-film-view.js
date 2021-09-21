import SmartView from './smart.js';

export default class AbstractFilmView extends SmartView {

  constructor(film) {
    super();
    this._film = film;

    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._addToWatchListClickHandler = this._addToWatchListClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  restoreHandlers() {
    this.setWatchedClickHandler(this._callback.watchedClick);
    this.setAddToWatchListClickHandler(this._callback.addToWatchListClick);
    this.setFavoriteClickHandler(this._callback.favoriteClick);
  }

  setWatchedClickHandler(callback) {
    this._callback.watchedClick = callback;
    this._getWatchedControl().addEventListener('click', this._watchedClickHandler);
  }

  setAddToWatchListClickHandler(callback) {
    this._callback.addToWatchListClick = callback;
    this._getAddToWatchListControl().addEventListener('click', this._addToWatchListClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this._getFavoriteControl().addEventListener('click', this._favoriteClickHandler);
  }

  _watchedClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchedClick();
  }

  _addToWatchListClickHandler(evt) {
    evt.preventDefault();
    this._callback.addToWatchListClick();
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  _getWatchedControl() {
    throw new Error('Abstract method not implemented: _getWatchedControl');
  }

  _getAddToWatchListControl() {
    throw new Error('Abstract method not implemented: _getAddToWatchListControl');
  }

  _getFavoriteControl() {
    throw new Error('Abstract method not implemented: _getFavoriteControl');
  }
}
