import AbstractView from './abstract.js';
import {FilmsCount} from '../utils/utils.js';

const createUserProfileTemplate = (rating) => (
  `<section class="header__profile profile">
  <p class="profile__rating">${rating}</p>
  <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
</section>`
);

const ProfileRating = {
  NOVICE: 'novice',
  FAN: 'fan',
  MOVIE_BUFF: 'movie buff',
};

export default class UserProfile extends AbstractView {
  constructor(films) {
    super();
    this._films = films;
    this._rating = null;

    this._setProfileRating(this._films);
  }

  _setProfileRating(films) {
    if (films >= FilmsCount.ONE && films <= FilmsCount.TEN) {
      this._rating = ProfileRating.NOVICE;
    }
    if (films >= FilmsCount.ELEVEN && films <= FilmsCount.TWENTY) {
      this._rating = ProfileRating.FAN;
    }
    if (films >= FilmsCount.TWENTY_ONE) {
      this._rating = ProfileRating.MOVIE_BUFF;
    }
  }

  getTemplate() {
    return createUserProfileTemplate(this._rating);
  }

}
