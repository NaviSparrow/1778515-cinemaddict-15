import AbstractView from './abstract.js';

const createFilmsSectionTemplate = () => '<section class="films"></section>';

export default class FilmsSection extends AbstractView {
  getTemplate() {
    return createFilmsSectionTemplate();
  }
}
