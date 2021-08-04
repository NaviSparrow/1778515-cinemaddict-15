const getRandomFloat = (min, max, precision = 0) => {
  const result = (Math.random() * (max - min + 0.1)) + min;
  return Number(result.toFixed(precision));
};
const getRandomInteger = (min, max) => getRandomFloat(min, max);

const getRandomArrayElement = (array) => array[getRandomInteger(0, array.length - 1)];

const getRandomArray = (array, max, min = 1) => {
  const newArray = array.slice().sort(() => Math.random() - 0.5);
  return newArray.slice(0, getRandomInteger(min, max));
};

const setClassName = (condition, trueClassName, falseClassName = '') => condition ? trueClassName : falseClassName;

const render = (container, template, place = 'beforeend') => container.insertAdjacentHTML(place, template);

export {
  getRandomFloat,
  getRandomInteger,
  getRandomArrayElement,
  getRandomArray,
  setClassName,
  render
};
