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

const FilmsCount = {
  NULL: 0,
  ONE: 1,
  TEN: 10,
  ELEVEN: 11,
  TWENTY: 20,
  TWENTY_ONE: 21,
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

const getFilmsByPeriod = (films, dateFrom, dateTo) => films.filter((film) => dayjs(film.watchingDate).isBetween(dateFrom, dateTo));

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

const deleteComment = (comments, update,  isAlreadyId = true) => {
  const index = comments.findIndex((comment) => isAlreadyId ? comment === update : comment.id === update);

  comments = [
    ...comments.slice(0, index),
    ...comments.slice(index + 1),
  ];
  return comments;
};

export {
  SortType,
  UserAction,
  CommentAction,
  UpdateType,
  MenuItem,
  Period,
  FilmsCount,
  sortByDate,
  sortByRating,
  getRandomFloat,
  getRandomInteger,
  getRandomArrayElement,
  getGenresSet,
  countFilmsByGenre,
  countTotalDuration,
  getFilmsByPeriod,
  getTopGenre,
  deleteComment
};
