const RenderPlace = {
  BEFOREBEGIN: 'beforebegin',
  BEFOREEND: 'beforeend',
  AFTERBEGIN: 'afterbegin',
  AFTEREND: 'afterend',
};

const Selector = {
  TITLE: '.film-card__title',
  POSTER: '.film-card__poster',
  COMMENTS: '.film-card__comments',
  CLOSE_BUTTON: '.film-details__close-btn',
  SHOW_MORE_BUTTON: '.films-list__show-more',
};

const TypeOfEvent = {
  CLICK: 'click',
  KEYDOWN: 'keydown',
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

const isEscEvent = (evt) => evt.key === 'Escape' || evt.key === 'Esc';

export {
  RenderPlace,
  Selector,
  TypeOfEvent,
  render,
  createElement,
  isEscEvent
};
