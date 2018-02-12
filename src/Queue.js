class Queue {
    constructor(array) {
        this.array = Array.isArray(array) ? [...array] : [];
    }

    enqueue(item) {
        this.array.unshift(item);
    }

    dequeue() {
        return this.array.pop();
    }

    restack(item) {
        return this.array.push(item);
    }

    getLength() {
        return this.array.length;
    }
}

export default Queue;