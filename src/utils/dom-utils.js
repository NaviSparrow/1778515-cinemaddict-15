const RenderPlace = {
  BEFOREBEGIN: 'beforebegin',
  BEFOREEND: 'beforeend',
  AFTERBEGIN: 'afterbegin',
  AFTEREND: 'afterend',
};

const render = (container, template, place) => container.insertAdjacentHTML(place, template);

export {RenderPlace, render};
