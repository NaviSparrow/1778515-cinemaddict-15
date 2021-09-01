const FilterType = {
  ALL: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITES: 'favorites',
};

const filter = {
  [FilterType.ALL]: (films) => films.length,
  [FilterType.WATCHLIST]: (films) => films.filter((film) => film.isInWatchList).length,
  [FilterType.HISTORY]: (films) => films.filter((film) => film.isWatched).length,
  [FilterType.FAVORITES]: (films) => films.filter((film) => film.isFavorite).length,

};

export {
  FilterType,
  filter
};
