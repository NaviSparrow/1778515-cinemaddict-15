export const generateFilters = (films) => {
  const filtersForFilms = {
    all: () => films.length,
    watchList: () => films.filter((film) => film.isAddtoWatchList).length,
    history: () => films.filter((film) => film.isWhatched).length,
    favorite: () => films.filter((film) => film.isFavorite).length,
  };
  return filtersForFilms;
};

