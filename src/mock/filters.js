export const generateFilters = (films) => (
  {
    countFilmsInAll: () => films.length,
    countFilmsInWatchList: () => films.filter((film) => film.isAddtoWatchList).length,
    countFilmsInHistory: () => films.filter((film) => film.isWhatched).length,
    countFilmsInFavorite: () => films.filter((film) => film.isFavorite).length,
  });

