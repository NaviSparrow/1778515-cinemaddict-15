import dayjs from 'dayjs';

const SortType = {
  BY_DEFAULT: 'by-default',
  BY_DATE: 'by-date',
  BY_RATING: 'by-rating',
};

const UserAction = {
  BUTTON_CLICK: 'BUTTON_CLICK',
  UPDATE_FORM: 'UPDATE_FORM',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
};

const CommentAction = {
  DELETE_COMMENT: 'DELETE_COMMENT',
  ADD_COMMENT: 'ADD_COMMENT',
  CHANGE: 'CHANGE',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MINOR_COMMENTS: 'MINOR_COMMENTS',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

const MenuItem = {
  FILMS: '#all',
  STATISTICS: '#stats',
};

const Period = {
  ALL_TIME: 'all-time',
  TODAY: 'today',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
};

const sortByDate = (filmA, filmB) => {
  const dateOfFilmB = dayjs(filmB.releaseDate);
  const dateOfFilmA = dayjs(filmA.releaseDate);
  return dateOfFilmB.diff(dateOfFilmA, 'year');
};

const sortByRating = (filmA ,filmB) => filmB.rating - filmA.rating;

const getRandomFloat = (min, max, precision) => {
  const result = (Math.random() * (max - min + 0.1)) + min;
  return Number(result.toFixed(precision));
};

const getRandomInteger = (min, max) => getRandomFloat(min, max, 0);

const getRandomArrayElement = (array) => array[getRandomInteger(0, array.length - 1)];

const getRandomArray = (array, max, min = 1) => {
  const newArray = array.slice().sort(() => Math.random() - 0.5);
  return newArray.slice(0, getRandomInteger(min, max));
};

const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};

const getGenresSet = (films) => new Set(films.flatMap((film) => film.genres));

const countFilmsByGenre = (films, genre) => {
  let result = 0;
  films
    .filter((film) => film.genres
      .forEach((filmGenre) => {
        filmGenre === genre ? result += 1 : result;
      }),
    );
  return result;
};

const countTotalDuration = (films) => dayjs.duration(films.reduce((totalDuration, film) => totalDuration + film.duration, 0), 'm');

const getFilmsByPeriod = (films, dateFrom, dateTo) => films.slice().filter((film) => dayjs(film.watchingDate).isBetween(dateFrom, dateTo));

const getTopGenre = (genres, counts) => {
  const keys = genres;
  const values = counts;

  const genresPerCount = {};
  keys.forEach((key, i) => genresPerCount[key] = values[i]);

  const sortableGenresPerCount = Object.fromEntries(
    Object.entries(genresPerCount).sort(([,genreA],[,genreB]) => genreB - genreA),
  );
  return Object.keys(sortableGenresPerCount)[0];
};

export {
  SortType,
  UserAction,
  CommentAction,
  UpdateType,
  MenuItem,
  Period,
  sortByDate,
  sortByRating,
  getRandomFloat,
  getRandomInteger,
  getRandomArrayElement,
  getRandomArray,
  updateItem,
  getGenresSet,
  countFilmsByGenre,
  countTotalDuration,
  getFilmsByPeriod,
  getTopGenre
};
