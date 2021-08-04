import dayjs from 'dayjs';
import {getRandomFloat, getRandomArray, getRandomInteger, getRandomArrayElement } from '../utils/utils.js';

const TITLES = [
  'Made for Each Other',
  'Popeye the Sailor Meets Sinbad the Sailor',
  'Sagerbush Trail',
  'Santa Claus Conquers the Matrians',
  'The Dance of Life',
  'The Great Flamarion',
  'The Man With the Golden Arm',
];

const GANRES = [
  'Western',
  'Comedy',
  'Musical',
  'Drama',
  'Mystery',
  'Cartoon',
];

const POSTERS = [
  'made-for-each-other.png',
  'popeye-meets-sinbad.png',
  'sagebrush-trail.jpg',
  'santa-claus-conquers-the-martians.jpg',
  'the-dance-of-life.jpg',
  'the-great-flamarion.jpg',
  'the-man-with-the-golden-arm.jpg',
];

const DESRIPTIONS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.',
];

const DIRECTORS = [
  'Steven Spielberg',
  'Martin Scorsese',
  'Alfred Hitchcock',
  'Stanley Kubrick',
  'Quentin Tarantino',
  'Francis Ford Coppola',
  'Sergio Leone',
];

const WRITERS = [
  'Billy Wilder',
  'Ethan Coen',
  'Robert Towne',
  'Quentin Tarantino',
  'Francis Ford Coppola',
  'William Goldman',
  'Charlie Kaufman',
  'Woody Allen',
  'Nora Ephron',
];

const ACTORS = [
  'Erich von Stroheim',
  'Heinz Herald',
  'Richard Weil',
  'Jack Nicholson',
  'Marlon Brando',
  'Robert De Niro',
  'Al Pacino',
  'Daniel Day-Lewis',
];

const COUNTRES = [
  'USA',
  'France',
  'Italy',
  'Spain',
  'Germany',
];

const AGE_RATINGS = [
  '0+',
  '12+',
  '16+',
  '18+',
];

const generateTitle = () => getRandomArrayElement(TITLES);

const generateRating = () => getRandomFloat(1, 10, 1);

const generateYear = () => {
  const year = '1950';
  dayjs(year);
  const maxYearGap = 20;
  const yearGap = getRandomInteger(-maxYearGap, maxYearGap);
  return dayjs(year).add(yearGap, 'year').toDate();
};

const generateDuration = () => {
  const hours = getRandomInteger(0, 2);
  const minutes = getRandomInteger(0, 59);
  if (hours === 0) {
    return `${minutes}m`;
  } else if (minutes === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${minutes}m`;
};

const generateGanre = () => getRandomArray(GANRES, 4);

const generatePoster = () => `./images/posters/${getRandomArrayElement(POSTERS)}`;

const generateDesription = () => getRandomArray(DESRIPTIONS, 5);

const generateComments = () => getRandomInteger(0, 5);

const generateOriginalTitle = () => generateTitle();

const generateDirector = () =>  getRandomArrayElement(DIRECTORS);

const generateWriters = () => getRandomArray(WRITERS, 3);

const generateActors = () => getRandomArray(ACTORS, 3);

const generateDate = () => {
  const date = '1965-06-27';
  dayjs(date);
  const maxYearsGap = 10;
  const maxMouthGap = 6;
  const maxDayGap = 8;
  const yearsGap = getRandomInteger(-maxYearsGap, maxYearsGap);
  const mouthsGap = getRandomInteger(-maxMouthGap, maxMouthGap);
  const daysGap = getRandomInteger(-maxDayGap, maxDayGap);
  return dayjs(date).add(yearsGap, 'year').add(mouthsGap, 'month').add(daysGap, 'day').toDate();
};

const generateCountry = () => getRandomArrayElement(COUNTRES);

const generateAgeRating = () => getRandomArrayElement(AGE_RATINGS);

export const generateFilmCard = () => (
  {
    title: generateTitle(),
    rating: generateRating(),
    year:generateYear(),
    duration: generateDuration(),
    genres: generateGanre(),
    poster: generatePoster(),
    description:generateDesription(),
    comments: generateComments(),
    originalTitle: generateOriginalTitle(),
    director: generateDirector(),
    writers: generateWriters(),
    actors: generateActors(),
    releaseDate: generateDate(),
    country: generateCountry(),
    ageRating: generateAgeRating(),
    isAddtoWatchList: Boolean(getRandomInteger(0, 1)),
    isWhatched: Boolean(getRandomInteger(0, 1)),
    isFavorite: Boolean(getRandomInteger(0, 1)),
  });
