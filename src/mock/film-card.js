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

const getRandomFloat = (min, max, precision = 0) => {
  const result = (Math.random() * (max - min + 0.1)) + min;
  return Number(result.toFixed(precision));
};
const getRandomInteger = (min, max) => getRandomFloat(min, max);

const getRandomArrayElement = (array) => array[getRandomInteger(0, array.length - 1)];

const getRandomArray = (array, length) => {
  const newArray = array.slice().sort(() => Math.random() - 0.5);
  return newArray.slice(0, getRandomInteger(0, length));
};

const generateTitle = () => getRandomArrayElement(TITLES);

const generateRating = () => getRandomFloat(1, 10, 1);

const generateYear = () => getRandomInteger(1930, 1970);

const generateDuration = () => {
  const hours = getRandomInteger(0, 2);
  const minutes = getRandomInteger(0, 59);
  if (hours === 0) {
    return `${minutes}m`;
  } else if (minutes === 0) {
    return `${hours}h`;
  } else {
    return `${hours}h ${minutes}m`;
  }
};

const generateGanre = () => getRandomArrayElement(GANRES);

const generatePoster = () => `./images/posters/${getRandomArrayElement(POSTERS)}`;

const generateDesription = () => getRandomArray(DESRIPTIONS, 5);

const generateComments = () => getRandomInteger(0, 5);


export const generateFilmCard = () => (
  {
    title: generateTitle(),
    rating: generateRating(),
    year:generateYear(),
    duration: generateDuration(),
    genre: generateGanre(),
    poster: generatePoster(),
    description:generateDesription(),
    comments: generateComments(),
    isAddtoWatchList: Boolean(getRandomInteger(0, 1)),
    isWhatched: Boolean(getRandomInteger(0, 1)),
    isFavorite: Boolean(getRandomInteger(0, 1)),
  });
