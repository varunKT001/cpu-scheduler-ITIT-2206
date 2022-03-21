import Queue from '../queue.js';

function arrivedProcesses(readyQueue, timer) {
  // create a new array containing the process that are arrived and also not terminated
  const arrived = readyQueue.list.filter((process) => {
    if (process.arrivalTime <= timer && !process.terminated) {
      return process;
    }
  });
  return arrived;
}

function maximumPriority(readyQueue) {
  // find the maximum priority of all process currently arrived
  const maximum = Math.max(...readyQueue.map((process) => process.priority));

  // return the process having the maximum priority (calculated above)
  for (let index = 0; index < readyQueue.length; index++) {
    const process = readyQueue[index];
    if (process.priority === maximum) {
      return process;
    }
  }
}

function priority(processes, contextSwitchingTime = 0) {
  // timer will keep track of the time each process is ran
  // timer will start from 0
  let timer = 0;

  // create a copy of original data
  let tempProcesses = processes.map((process) => {
    return { ...process };
  });

  // creating a ready queue
  // sort the processes according to the arival times
  let readyQueue = new Queue(tempProcesses);

  // output array is used to display the output
  let output = [];

  // keeping track of previous process
  let prev = null;

  // iterating over each process
  while (!readyQueue.isEmpty()) {
    // get the process from the ready queue
    let process = readyQueue.peek();

    // check if the process arrived or not
    if (process.arrivalTime > timer) {
      timer++;
      continue;
    }

    // check for context switching time and increment the timer
    if (process.name !== prev) {
      timer += contextSwitchingTime;
    }

    // update previous process
    prev = process.name;

    process = maximumPriority(arrivedProcesses(readyQueue, timer));
    process = readyQueue.list.find((p) => p.name === process.name);

    // if no process found, update
    if (!process) {
      timer++;
      continue;
    }

    // check if the process arrived or not
    if (process.arrivalTime > timer) {
      timer++;
      continue;
    }

    // give the response time
    if (process.responseTime === null || process.responseTime === undefined) {
      process.responseTime = timer - process.arrivalTime;
    }

    // run the process for the CPU Burst time
    timer += 1;
    process.estimateCPUBurstTime = process.estimateCPUBurstTime - 1;

    if (process.estimateCPUBurstTime === 0) {
      // process completion time
      process.completionTime = timer;

      // turn-around time
      process.turnAroundTime = process.completionTime - process.arrivalTime;

      // waiting time
      process.waitingTime =
        process.turnAroundTime -
        processes.find((p) => p.name === process.name).estimateCPUBurstTime;

      // terminate the process
      process.terminated = true;

      // update previous process
      prev = process.name;

      // remove from ready queue
      readyQueue.removeProcess(process);

      // put in the output array
      output.push(process);
    }
  }

  console.table(output.sort((a, b) => a.arrivalTime - b.arrivalTime));

  return output.sort((a, b) => a.arrivalTime - b.arrivalTime);
}

export default priority;
