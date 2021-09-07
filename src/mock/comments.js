import {getRandomArrayElement } from '../utils/utils.js';
import {nanoid} from 'nanoid';

const AUTHORS = [
  'Tim Macoveev',
  'John Doe',
  'Robert Towne',
  'Heinz Herald',
];

const TEXTS = [
  'Booooooooooring',
  'Interesting setting and a good cast',
  'a film that changed my life, a true masterpiece, post-credit scene was just amazing omg',
  'Very very old. Meh',
];

const DATES = [
  '2021-09-03T16:12:32.554Z',
  '2021-07-11T00:00:00.554Z',
  '2021-09-04T12:42:32.554Z',
  '2021-08-30T12:42:32.554Z',
];

const EMOTIONS = [
  'smile',
  'sleeping',
  'puke',
  'angry',
];

const generateAuthor = () => getRandomArrayElement(AUTHORS);

const generateText = () => getRandomArrayElement(TEXTS);

const generateDate = () => getRandomArrayElement(DATES);

const generateEmotion = () => getRandomArrayElement(EMOTIONS);

const generateComment = () => (
  {
    id: nanoid(),
    author: generateAuthor(),
    comment: generateText(),
    date: generateDate(),
    emotion: generateEmotion(),
  }
);

export {generateComment};
