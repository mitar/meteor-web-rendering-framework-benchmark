import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import async from 'async';
import Highcharts from 'highcharts-more-node';

import profile from './profile';

import './main.html';

import BlazeBackend from './blaze/main';
import ManualDomBackend from './manual-dom/main';
import ReactStatefulBackend from './react-stateful/main';
import VueStatefulBackend from './vue-stateful/main';

const BENCHMARK_LOOPS = 15;
const BACKENDS = [BlazeBackend, ManualDomBackend, ReactStatefulBackend, VueStatefulBackend];

let latest = {
  backend: null,
  selection: null,
};

const renderResults = new ReactiveVar(new Map());

let inProgress = false;

Template.sidebar.events({
  'click button.individual'(event, template) {
    const $currentTarget = $(event.currentTarget);
    renderOne($currentTarget.data('backend'), $currentTarget.data('selection'));
  },

  'click button.measure'(event, template) {
    const $currentTarget = $(event.currentTarget);
    const backendId = $currentTarget.data('backend');
    let backends = null;
    if (backendId === 'all') {
      backends = BACKENDS;
    }
    else {
      backends = [getBackend(backendId)];
    }
    benchmark(backends);
  },
});

Template.sidebar.helpers({
  backends() {
    return BACKENDS.map((backend) => {
      return {id: backend.getId(), name: backend.getName()};
    });
  },

  style() {
    const results = renderResults.get();
    if (results && results.size) {
      return {
        style: 'width: 100%; height: 400px;'
      }
    }
  }
});

function computeMedian(sortedValues) {
  let median;
  let beforeValues;
  let afterValues;
  if (sortedValues.length % 2 === 0) {
    median = (sortedValues[sortedValues.length / 2] + sortedValues[(sortedValues.length / 2) - 1]) / 2;
    beforeValues = sortedValues.slice(0, sortedValues.length / 2);
    afterValues = sortedValues.slice(sortedValues.length / 2);
  }
  else {
    median = sortedValues[Math.floor(sortedValues.length / 2)];
    beforeValues = sortedValues.slice(0, Math.floor(sortedValues.length / 2));
    afterValues = sortedValues.slice(Math.ceil(sortedValues.length / 2));
  }

  return [median, beforeValues, afterValues];
}

function computeSummaries(values) {
  values.sort();

  const minimum = values[0];
  const maximum = values[values.length - 1];

  const [median, beforeValues,  afterValues] = computeMedian(values);
  const [q1] = computeMedian(beforeValues);
  const [q3] = computeMedian(afterValues);

  return [minimum, q1, median, q3, maximum];
}

Template.sidebar.onRendered(function () {
  this.autorun((computation) => {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }

    const results = renderResults.get();

    if (!results || !results.size) {
      return;
    }

    const series = [];
    const categories = [];
    for (let [backendId, measurements] of results) {
      const backend = getBackend(backendId);

      series.push({
        name: backend.getName(),
        data: [],
        animation: false
      });

      for (let [measurement, values] of measurements) {
        if (!categories.includes(measurement)) {
          categories.push(measurement);
        }

        series[series.length - 1].data[categories.indexOf(measurement)] = computeSummaries(values);
      }
    }

    this.chart = Highcharts.chart(this.$('#results').get(0), {
      chart: {
        type: 'boxplot',
        animation: false
      },
      title: {
        text: 'Benchmark for web rendering frameworks available in Meteor'
      },
      credits: {
        enabled: false
      },
      xAxis: {
        categories
      },
      yAxis: {
        min: 1,
        title: {
          text: 'Time to render (less is better) [ms]'
        }
      },
      tooltip: {
        valueSuffix: ' ms'
      },
      plotOptions: {
        column: {
          grouping: false,
          shadow: false
        }
      },
      series
    });
  });
});

Template.sidebar.onDestroyed(function () {
  if (this.chart) {
    this.chart.destroy();
    this.chart = null;
  }
});

function getBackend(backendId) {
  for (let backend of BACKENDS) {
    if (backend.getId() === backendId) {
       return backend;
    }
  }

  throw new Error(`Unknown backend '${backendId}'.`);
}

function renderOne(backendId, selection, callback) {
  if (inProgress) {
    throw new Error("Rendering already in progress.");
  }

  if ((latest.backend && latest.backend.constructor.getId()) === backendId && latest.selection === selection) {
    console.log("Already rendered.");
    return;
  }

  let backend = null;

  inProgress = true;

  if (latest.backend && latest.backend.constructor.getId() === backendId) {
    backend = latest.backend;
  }
  else {
    if (latest.backend) {
      latest.backend.cleanup();
    }

    latest.backend = null;
    latest.selection = null;

    const backendClass = getBackend(backendId);

    backend = new backendClass($('#content').get(0), null);
  }

  profile.startMeasurement(function (duration) {
    const previousSelection = latest.selection;

    console.log(`${backendId}: ${previousSelection} -> ${selection}: ${duration} ms`);
    
    latest.backend = backend;
    latest.selection = selection;

    inProgress = false;

    if (callback) {
      callback(previousSelection, duration);
    }
  });
  backend.render(selection);
}

function benchmark(backends) {
  // Remove any existing shown results.
  renderResults.set(new Map());
  Tracker.flush();

  console.log("Benchmark started.", new Date());

  const results = new Map();

  const queue = async.queue(function(task, callback) {
    renderOne(task.backendId, task.selection, function (previousSelection, duration) {
      if (!task.ignore) {
        const measurement = `${previousSelection} -> ${task.selection}`;

        if (!results.has(task.backendId)) results.set(task.backendId, new Map());
        if (!results.get(task.backendId).has(measurement)) results.get(task.backendId).set(measurement, []);

        results.get(task.backendId).get(measurement).push(duration);
      }

      // Delay between tasks.
      Meteor.setTimeout(callback, 3000); // ms
    });
  });

  queue.drain = function drain(error) {
    console.log("Benchmark ended.", new Date());
    if (error) {
      console.error("Benchmark error", error);
      return;
    }

    const baseline = new Map();

    if (results.has('manual')) {
      for (let [measurement, durations] of results.get('manual')) {
        const sum = durations.reduce((a, b) => a + b, 0);
        const average = sum / durations.length;
        baseline.set(measurement, average);
      }
    }

    for (let [type, measurements] of results) {
      for (let [measurement, durations] of measurements) {
        const sum = durations.reduce((a, b) => a + b, 0);
        const average = sum / durations.length;
        console.log("Result", type, measurement, average, average / baseline.get(measurement));
      }
    }

    renderResults.set(results);
  };

  queue.error = function error(error, task) {
    console.error(error, task);
  };

  for (let backend of backends) {
    queue.push({backendId: backend.getId(), selection: 'other', ignore: true});

    for (let i = 0; i < BENCHMARK_LOOPS; i++) {
      queue.push({backendId: backend.getId(), selection: 'table1'});
      queue.push({backendId: backend.getId(), selection: 'other'});
    }
    for (let i = 0; i < BENCHMARK_LOOPS; i++) {
      queue.push({backendId: backend.getId(), selection: 'recursive'});
      queue.push({backendId: backend.getId(), selection: 'other'});
    }

    queue.push({backendId: backend.getId(), selection: 'table1', ignore: true});

    for (let i = 0; i < BENCHMARK_LOOPS; i++) {
      queue.push({backendId: backend.getId(), selection: 'table3'});
      queue.push({backendId: backend.getId(), selection: 'table1'});
    }
  }
}
