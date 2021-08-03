export const createFilmCardTemplate = (filmCard) => {
  const {title, rating, year, duration, ganre, poster, description, comments, isAddtoWatchList, isWhatched, isFavorite} = filmCard;

  const setClassName = (condition) => condition ? 'film-card__controls-item--active' : '';
  const whatchListClassName = setClassName(isAddtoWatchList);
  const whatchedClassName = setClassName(isWhatched);
  const favoriteClassName = setClassName(isFavorite);
  return `<article class="film-card">
    <h3 class="film-card__title">${title}</h3>
    <p class="film-card__rating">${rating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${year}</span>
      <span class="film-card__duration">${duration}</span>
      <span class="film-card__genre">${ganre}</span>
    </p>
    <img src=${poster} alt="" class="film-card__poster">
    <p class="film-card__description">${description}</p>
    <a class="film-card__comments">${comments} comments</a>
    <div class="film-card__controls">
      <button class="film-card__controls-item ${whatchListClassName} film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
      <button class="film-card__controls-item ${whatchedClassName} film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
      <button class="film-card__controls-item ${favoriteClassName} film-card__controls-item--favorite" type="button">Mark as favorite</button>
    </div>
  </article>`;
};
