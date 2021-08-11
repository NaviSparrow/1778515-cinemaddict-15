import AbstractView from './abstract.js';

const createTopRatedFilmsTemplate = () => (
  `<section class="films-list films-list--extra">
      <h2 class="films-list__title">Top rated</h2>
      <div class="films-list__container"></div>
    </section`
);

export default class TopRatedFilms extends AbstractView {
  getTemplate() {
    return createTopRatedFilmsTemplate();
  }
}
