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

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MINOR_COMMENTS: 'MINOR_COMMENTS',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

const ButtonName = {
  WATCHLIST: 'watchlist',
  WATCHED: 'watched',
  FAVORITES: 'favorite',
};

const MenuItem = {
  FILMS: '#all',
  STATISTICS: '#stats',
};

const sortByDate = (filmA, filmB) => filmB.year - filmA.year;

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

export {
  SortType,
  UserAction,
  UpdateType,
  ButtonName,
  MenuItem,
  sortByDate,
  sortByRating,
  getRandomFloat,
  getRandomInteger,
  getRandomArrayElement,
  getRandomArray,
  updateItem,
  getGenresSet,
  countFilmsByGenre,
  countTotalDuration
};
