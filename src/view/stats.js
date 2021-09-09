import SmartView from './smart.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {filter, FilterType} from '../utils/filter-utils.js';
import {getGenresSet, countFilmsByGenre, countTotalDuration} from '../utils/utils.js';

const createStatisticChart = (statisticCtx, films) => {
  const uniqGenres = Array.from(getGenresSet(films));
  const filmsByGenreCount = uniqGenres.map((genre) => countFilmsByGenre(films, genre));

  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: uniqGenres,
      datasets: [{
        data: filmsByGenreCount,
        backgroundColor: '#ffe800',
        hoverBackgroundColor: '#ffe800',
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20,
          },
          color: '#ffffff',
          anchor: 'start',
          align: 'start',
          offset: 40,
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#ffffff',
            padding: 100,
            fontSize: 20,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 24,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};


const createStatisticsTemplate = (filmsData) => {
  const countOverallWatchedFilms = filter[FilterType.HISTORY](filmsData).length;
  const totalDurationHours = Math.floor(countTotalDuration(filmsData).as('hours'));
  const totalDurationMinutes = countTotalDuration(filmsData).minutes();

  const uniqGenres = Array.from(getGenresSet(filmsData));
  const filmsByGenreCount = uniqGenres.map((genre) => countFilmsByGenre(filmsData, genre));


  return (`<section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">Movie buff</span>
    </p>

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" checked>
      <label for="statistic-all-time" class="statistic__filters-label">All time</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today">
      <label for="statistic-today" class="statistic__filters-label">Today</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week">
      <label for="statistic-week" class="statistic__filters-label">Week</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month">
      <label for="statistic-month" class="statistic__filters-label">Month</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year">
      <label for="statistic-year" class="statistic__filters-label">Year</label>
    </form>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${countOverallWatchedFilms} <span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${totalDurationHours} <span class="statistic__item-description">h</span> ${totalDurationMinutes} <span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">Sci-Fi</p>
      </li>
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>

  </section>`);
};

export default class Statistics extends SmartView {
  constructor(films) {
    super();
    this._filmsData = films;

    this._statisticChart = null;

    this._setChart();
  }

  removeElement() {
    super.removeElement();
    if (this._statisticChart !== null) {
      this._statisticChart = null;
    }
  }

  //TODO _dateChangeHandler() {}

  restoreHandlers() {
    this._setChart();
  }

  getTemplate() {
    return createStatisticsTemplate(this._filmsData);
  }

  _setChart() {
    if (this._statisticChart !== null) {
      this._statisticChart = null;
    }
    const statisticCtx = this.getElement().querySelector('.statistic__chart');

    this._statisticChart = createStatisticChart(statisticCtx, this._filmsData);
  }
}
