import SmartView from './smart.js';
import Chart from 'chart.js';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {filter, FilterType} from '../utils/filter-utils.js';
import {getGenresSet, countFilmsByGenre, countTotalDuration, getFilmsByPeriod, Period} from '../utils/utils.js';

dayjs.extend(isBetween);

const createStatisticChart = (statisticCtx, data) => {
  const {films, dateFrom, dateTo} = data;
  const filmsByPeriod = getFilmsByPeriod(films, dateFrom, dateTo);
  const uniqGenres = Array.from(getGenresSet(filmsByPeriod));
  const filmsByGenreCount = uniqGenres.map((genre) => countFilmsByGenre(filmsByPeriod, genre));

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
  const {films, dateFrom, dateTo, currentPeriod} = filmsData;
  const filmsByPeriod = getFilmsByPeriod(films, dateFrom, dateTo);

  const countOverallWatchedFilms = filter[FilterType.HISTORY](filmsByPeriod).length;

  const totalDurationHours = Math.floor(countTotalDuration(filmsByPeriod).as('hours'));
  const totalDurationMinutes = countTotalDuration(filmsByPeriod).minutes();

  return (`<section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">Movie buff</span>
    </p>

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" ${currentPeriod === Period.ALL_TIME ? 'checked' : ''}>
      <label for="statistic-all-time" class="statistic__filters-label">All time</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today" ${currentPeriod === Period.TODAY ? 'checked' : ''}>
      <label for="statistic-today" class="statistic__filters-label">Today</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week" ${currentPeriod === Period.WEEK ? 'checked' : ''}>
      <label for="statistic-week" class="statistic__filters-label">Week</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month" ${currentPeriod === Period.MONTH ? 'checked' : ''}>
      <label for="statistic-month" class="statistic__filters-label">Month</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year" ${currentPeriod === Period.YEAR ? 'checked' : ''}>
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
    this._data = {
      films,
      dateFrom: (() => {
        const TWO = 2;
        return dayjs().subtract(TWO, 'year');
      })(),
      dateTo: dayjs(),
      currentPeriod: Period.ALL_TIME,
    };

    this._statisticChart = null;

    this._dateChangeHandler = this._dateChangeHandler.bind(this);

    this._setChart();
    this._setDateChangeHandler();
  }

  removeElement() {
    super.removeElement();
    if (this._statisticChart !== null) {
      this._statisticChart = null;
    }
  }

  _dateChangeHandler(evt) {
    switch (evt.target.value) {
      case Period.ALL_TIME:
        this.updateData({
          dateFrom: (() => {
            const TWO = 2;
            return dayjs().subtract(TWO, 'year');
          })(),
          currentPeriod: Period.ALL_TIME,
        });
        break;
      case Period.TODAY:
        this.updateData({
          dateFrom: dayjs().startOf('day'),
          currentPeriod: Period.TODAY,
        });
        break;
      case Period.WEEK:
        this.updateData({
          dateFrom: dayjs().startOf('week'),
          currentPeriod: Period.WEEK,
        });
        break;
      case Period.MONTH:
        this.updateData({
          dateFrom: dayjs().startOf('month'),
          currentPeriod: Period.MONTH,
        });
        break;
      case Period.YEAR:
        this.updateData({
          dateFrom: dayjs().startOf('year'),
          currentPeriod: Period.YEAR,
        });
        break;
    }
  }

  restoreHandlers() {
    this._setChart();
    this._setDateChangeHandler();

  }

  getTemplate() {
    return createStatisticsTemplate(this._data);
  }

  _setChart() {
    if (this._statisticChart !== null) {
      this._statisticChart = null;
    }
    const statisticCtx = this.getElement().querySelector('.statistic__chart');

    this._statisticChart = createStatisticChart(statisticCtx, this._data);
  }

  _setDateChangeHandler() {
    const statisticFilters = this.getElement().querySelectorAll('.statistic__filters');
    for(const statisticFilter of statisticFilters) {
      statisticFilter.addEventListener('change', this._dateChangeHandler);
    }
  }
}
