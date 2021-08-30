export const generateFilters = (films) => (
  {
    countFilmsInAll: () => films.length,
    countFilmsInWatchList: () => films.filter((film) => film.isInWatchList).length,
    countFilmsInHistory: () => films.filter((film) => film.isWatched).length,
    countFilmsInFavorite: () => films.filter((film) => film.isFavorite).length,
  });

