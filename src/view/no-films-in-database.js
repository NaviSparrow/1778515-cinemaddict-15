import AbstractView from './abstract.js';

const createNoFilmsTemplate = () => (
  `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title">There are no movies in our database</h2>
    </section>
  </section>`
);

export default class NoFilmsInDatabase extends AbstractView {
  getTemplate() {
    return createNoFilmsTemplate();
  }
}

