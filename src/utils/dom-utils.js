import AbstractView from '../view/abstract.js';

const RenderPlace = {
  BEFOREBEGIN: 'beforebegin',
  BEFOREEND: 'beforeend',
  AFTERBEGIN: 'afterbegin',
  AFTEREND: 'afterend',
};

const render = (container, child, place = RenderPlace.BEFOREEND) => {
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
  if (component === null) {
    return;
  }
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

const replace = (newChild, oldChild) => {
  if (oldChild instanceof AbstractView) {
    oldChild = oldChild.getElement();
  }

  if (newChild instanceof AbstractView) {
    newChild = newChild.getElement();
  }

  const parent = oldChild.parentElement;

  if (parent === null || oldChild === null || newChild === null) {
    throw new Error('Can\'t replace unexisting elements');
  }

  parent.replaceChild(newChild, oldChild);
};

const isCtrlEnterEvent = (evt) => evt.ctrlKey && evt.keyCode === 13;

const isCmdEnterEvent = (evt) => evt.metaKey && evt.keyCode === 13;

export {
  RenderPlace,
  render,
  remove,
  createElement,
  isEscEvent,
  replace,
  isCtrlEnterEvent,
  isCmdEnterEvent
};
