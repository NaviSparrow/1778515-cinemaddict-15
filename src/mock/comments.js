import {getRandomArrayElement } from '../utils/utils.js';

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
  '2019-04-12T16:12:32.554Z',
  '2019-05-11T00:00:00.000Z',
  '2021-05-11T12:42:32.554Z',
  '2021-30-08T12:42:32.554Z',
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
    author: generateAuthor(),
    comment: generateText(),
    date: generateDate(),
    emotion: generateEmotion(),
  }
);

export {generateComment};
