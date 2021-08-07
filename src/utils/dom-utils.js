const RenderPlace = {
  BEFOREBEGIN: 'beforebegin',
  BEFOREEND: 'beforeend',
  AFTERBEGIN: 'afterbegin',
  AFTEREND: 'afterend',
};

const renderElement = (container, element, place) => {
  switch (place){
    case RenderPlace.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPlace.BEFOREEND:
      container.append(element);
      break;
  }
};

const renderTemplate = (container, template, place) => container.insertAdjacentHTML(place, template);

const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;
  return newElement.firstChild;
};

export {
  RenderPlace,
  renderElement,
  renderTemplate,
  createElement
};
