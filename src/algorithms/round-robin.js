import Queue from '../queue.js';

function roundRobin(processes, timeQuantum, contextSwitchingTime = 0) {
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

    // give the response time
    if (process.responseTime === null || process.responseTime === undefined) {
      process.responseTime = timer - process.arrivalTime;
    }

    // run the process for the CPU Burst time
    if (process.estimateCPUBurstTime <= timeQuantum) {
      timer += process.estimateCPUBurstTime;
      process.estimateCPUBurstTime = 0;
    } else {
      timer += timeQuantum;
      process.estimateCPUBurstTime = process.estimateCPUBurstTime - timeQuantum;
    }

    // update the ready queue
    readyQueue.enqueue(readyQueue.dequeue());

    if (process.estimateCPUBurstTime <= 0) {
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

export default roundRobin;
