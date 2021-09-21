import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(duration);
dayjs.extend(relativeTime);

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

const formatYear = (date) => dayjs(date).format('YYYY');

const formatCommentDate = (date) => dayjs(date).fromNow();

const updateWatchingDate = (film) => !film.isWatched ? film.watchingDate = dayjs() : film.watchingDate = null;


export {
  EmojiState,
  formatDuration,
  formatDate,
  createGenres,
  formatYear,
  formatCommentDate,
  updateWatchingDate
};

