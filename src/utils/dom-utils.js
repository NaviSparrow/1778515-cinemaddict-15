import AbstractView from '../view/abstract.js';

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

const render = (container, child, place) => {
  if (container instanceof AbstractView) {
    container = container.getElement();
  }

  if (child instanceof AbstractView) {
    child = child.getElement();
  }

  switch (place){
    case RenderPlace.AFTERBEGIN:
      container.prepend(child);
      break;
    case RenderPlace.BEFOREEND:
      container.append(child);
      break;
  }
};

const remove = (component) => {
  if (!(component instanceof AbstractView)) {
    throw new Error('Can remove only components');
  }
  component.getElement().remove();
  component.removeElement();
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
  remove,
  createElement,
  isEscEvent
};
