const RenderPlace = {
  BEFOREBEGIN: 'beforebegin',
  BEFOREEND: 'beforeend',
  AFTERBEGIN: 'afterbegin',
  AFTEREND: 'afterend',
};

const render = (container, element, place) => {
  switch (place){
    case RenderPlace.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPlace.BEFOREEND:
      container.append(element);
      break;
  }
};

const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;
  return newElement.firstChild;
};

export {
  RenderPlace,
  render,
  createElement
};
