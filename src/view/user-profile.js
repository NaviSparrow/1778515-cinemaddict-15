import AbstractView from './abstract.js';
import {getRating} from '../utils/utils.js';

const createUserProfileTemplate = (rating) => (
  `<section class="header__profile profile">
  <p class="profile__rating">${rating}</p>
  <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
</section>`
);

export default class UserProfile extends AbstractView {
  constructor(films) {
    super();
    this._films = films;
    this._rating = null;

    this._setProfileRating(this._films);
  }

  _setProfileRating(films) {
    this._rating = getRating(films);
  }

  getTemplate() {
    return createUserProfileTemplate(this._rating);
  }

}
