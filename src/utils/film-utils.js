import dayjs from 'dayjs';
const duration = require('dayjs/plugin/duration');
dayjs.extend(duration);

const EmojiState = {
  NULL: null,
  SMILE: 'smile',
  SLEEPING: 'sleeping',
  PUKE: 'puke',
  ANGRY: 'angry',
};

const formatDuration = (time) => {
  let filmDuration = dayjs.duration(time, 'm');
  time < 60
    ? filmDuration = filmDuration.format('m[m]')
    : filmDuration = filmDuration.format('H[h] m[m]');
  return filmDuration;
};

const formatDate = (date) => dayjs(date).format('DD MMMM YYYY');

const createGenres = (genresList) => genresList.map((genre) => `<span class="film-details__genre">${genre}</span>`).join('');

const formatYear = (year) => dayjs(year).format('YYYY');

export {
  EmojiState,
  formatDuration,
  formatDate,
  createGenres,
  formatYear
};

