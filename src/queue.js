class Queue {
  constructor(processes = []) {
    this.list = processes.sort((a, b) => a.arrivalTime - b.arrivalTime);
  }

  peek() {
    const value = this.list[0];
    return value;
  }

  isEmpty() {
    if (this.list.length === 0) {
      return true;
    } else {
      return false;
    }
  }

  enqueue(value) {
    this.list.push(value);
  }

  dequeue() {
    const value = this.list.shift();
    return value;
  }

  removeProcess(process) {
    this.list = this.list.filter((item) => item.name !== process.name);
  }
}

export default Queue;
