// importing scheduling algorithms
import fcfs from './src/algorithms/fcfs.js';
import nonPreemptiveSJF from './src/algorithms/non-preemptive-sjf.js';
import preemptiveSJF from './src/algorithms/preemptive-sjf.js';
import nonPreemptivePriority from './src/algorithms/non-preemptive-priority.js';
import preemptivePriority from './src/algorithms/preemptive-priority.js';
import roundRobin from './src/algorithms/round-robin.js';

// global variable containing all the processes
let PROCESSES = [];

// global variable for all the options
let OPTIONS = {
  algorithm: 'fcfs',
  contextSwitchingTime: 0,
  mode: 'preemptive',
  timeQuantum: 4,
};

window.onload = function () {
  // get processes from localstorage
  let processes = localStorage.getItem('processes');

  if (!processes) {
    return;
  }

  // parse json
  processes = JSON.parse(processes);

  // update processes
  PROCESSES = [...processes];

  // display processes
  displayProcesses();
};

// selecting modal submit button
const processSubmitButton = document.querySelector('#add-new-process-btn');

// selecting clear processes button
const clearProcessesButton = document.querySelector('#clear-processes');

// selecting scheduling algorithm selector
const selectAlgorithm = document.querySelector('#scheduling-algorithm');

// selecting the mode
const mode = document.querySelector('#scheduling-mode');

// selecting context switching time
const contextSwitch = document.querySelector('#context-switching-time');

// selecting time quantum
const timeQuantum = document.querySelector('#time-quantum');

// selecting the schedule process button
const scheduleProcessesButton = document.querySelector('#schedule-processes');

// event listeners
processSubmitButton.addEventListener('click', addNewProcess);
clearProcessesButton.addEventListener('click', clearProcesses);
selectAlgorithm.addEventListener('change', changeSchedulingAlgorithm);
contextSwitch.addEventListener('change', changeContextSwitchingTime);
mode.addEventListener('change', changeMode);
scheduleProcessesButton.addEventListener('click', scheduleProcesses);

// event function for adding new processes
function addNewProcess() {
  // getting the values
  const process = {
    name: document.querySelector('#process-name').value,
    arrivalTime: parseInt(document.querySelector('#process-arrival').value),
    estimateCPUBurstTime: parseInt(
      document.querySelector('#process-burst').value
    ),
    priority: parseInt(document.querySelector('#process-priority').value),
  };

  // check for duplicate process
  if (PROCESSES.find((p) => p.name === process.name)) {
    alert('Process name already taken');
    return;
  }

  // check if all the values are correct
  for (let key in process) {
    if (
      process[key] === null ||
      process[key] === undefined ||
      process[key] === '' ||
      isNaN(process[key])
    ) {
      alert('Fill all the details');
      return;
    }
    if (typeof process[key] === 'number' && process[key] < 0) {
      alert('Negative time not allowed');
      return;
    }
  }

  // add process to global processes
  PROCESSES.push(process);

  // update localstorage
  updateLocalStorage();

  // display the processes
  displayProcesses();
}

// event function to change scheduling algorithm
function changeSchedulingAlgorithm(e) {
  // get the value from the select element
  const algorithm = e.target.value;

  // change the algorithm
  OPTIONS.algorithm = algorithm;
}

// event function to change context switching time
function changeContextSwitchingTime(e) {
  // get time
  const time = parseInt(e.target.value);

  // change options
  OPTIONS.contextSwitchingTime = time;
}

// event function to change time quantum
function changeTimeQuantum(e) {
  // get time
  const time = parseInt(e.target.value);

  // change options
  OPTIONS.timeQuantum = time;
}

// event function to change the mode
function changeMode(e) {
  // get the mode
  const mode = e.target.value;

  // change the options
  OPTIONS.mode = mode;
  console.log(OPTIONS);
}

// event function to schedule all the proccess
function scheduleProcesses() {
  // select the method
  let method = null;
  switch (OPTIONS.algorithm) {
    case 'fcfs':
      method = fcfs;
      break;
    case 'sjf':
      if (OPTIONS.mode === 'preemptive') {
        method = preemptiveSJF;
      } else {
        method = nonPreemptiveSJF;
      }
      break;
    case 'priority':
      if (OPTIONS.mode === 'preemptive') {
        method = preemptivePriority;
      } else {
        method = nonPreemptivePriority;
      }
      break;
    case 'round-robin':
      method = roundRobin;
      break;
  }

  // run the method
  let output = null;
  if (OPTIONS.algorithm === 'round-robin') {
    output = method(
      PROCESSES,
      OPTIONS.timeQuantum,
      OPTIONS.contextSwitchingTime
    );
  } else {
    output = method(PROCESSES, OPTIONS.contextSwitchingTime);
  }

  const average = calculateAverage(output);

  displayResults(output, average);
}

// fucntion to calculate average times
function calculateAverage(output) {
  //calculate sum
  const average = output.reduce(
    (prev, current) => {
      prev.averageTurnAroundTime += current.turnAroundTime;
      prev.averageWaitingTime += current.waitingTime;
      prev.averageResponseTime += current.responseTime;
      prev.averageCompletionTime += current.completionTime;
      return prev;
    },
    {
      averageTurnAroundTime: 0,
      averageWaitingTime: 0,
      averageResponseTime: 0,
      averageCompletionTime: 0,
    }
  );

  // calculate average
  for (let key in average) {
    average[key] = average[key] / output.length;
  }

  // return average
  return average;
}

// function to display processes to dom
function displayProcesses() {
  // get the table
  const table = document.querySelector('#all-processes tbody');

  // clear the table
  table.innerHTML = '';

  PROCESSES.forEach((process) => {
    // create a row
    const row = document.createElement('tr');

    // create data
    const rowData1 = document.createElement('td');
    const rowData2 = document.createElement('td');
    const rowData3 = document.createElement('td');
    const rowData4 = document.createElement('td');

    // insert data
    rowData1.innerText = process.name;
    rowData2.innerText = process.arrivalTime;
    rowData3.innerText = process.estimateCPUBurstTime;
    rowData4.innerText = process.priority;

    // append data to row
    row.append(rowData1);
    row.append(rowData2);
    row.append(rowData3);
    row.append(rowData4);

    // append row to table
    table.append(row);
  });
}

function displayResults(output, average) {
  // get the table
  const table = document.querySelector('#output-table tbody');

  // clear the table
  table.innerHTML = '';

  output.forEach((process) => {
    // create a row
    const row = document.createElement('tr');

    // create data
    const rowData1 = document.createElement('td');
    const rowData2 = document.createElement('td');
    const rowData3 = document.createElement('td');
    const rowData4 = document.createElement('td');
    const rowData5 = document.createElement('td');

    // insert data
    rowData1.innerText = process.name;
    rowData2.innerText = process.completionTime;
    rowData3.innerText = process.turnAroundTime;
    rowData4.innerText = process.waitingTime;
    rowData5.innerText = process.responseTime;

    // append data to row
    row.append(rowData1);
    row.append(rowData2);
    row.append(rowData3);
    row.append(rowData4);
    row.append(rowData5);

    // append row to table
    table.append(row);
  });
  displayAverage(average);
}

// function to display average data
function displayAverage(average) {
  // get the table
  const table = document.querySelector('#output-table tbody');

  // create a row
  const row = document.createElement('tr');

  // create data
  const rowData1 = document.createElement('th');
  const rowData2 = document.createElement('th');
  const rowData3 = document.createElement('th');
  const rowData4 = document.createElement('th');
  const rowData5 = document.createElement('th');

  // insert data
  rowData1.innerText = 'Average';
  rowData2.innerText = average.averageCompletionTime;
  rowData3.innerText = average.averageTurnAroundTime;
  rowData4.innerText = average.averageWaitingTime;
  rowData5.innerText = average.averageResponseTime;

  // append data to row
  row.append(rowData1);
  row.append(rowData2);
  row.append(rowData3);
  row.append(rowData4);
  row.append(rowData5);

  // append row to table
  table.append(row);
}

// function to update localstorage
function updateLocalStorage() {
  // convert processes object to string
  const processes = JSON.stringify(PROCESSES);

  // store in localstorage
  localStorage.setItem('processes', processes);
}

// function to clear all processes
function clearProcesses() {
  // clear processes
  PROCESSES = [];

  // update localstorage
  updateLocalStorage();

  // display processes
  displayProcesses();
}

// function to check if number is NaN
function isNaN(value) {
  return (
    value.toString() === 'NaN' &&
    typeof value !== 'string' &&
    typeof value === 'number'
  );
}
