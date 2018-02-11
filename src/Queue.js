class Queue {
    constructor(array) {
        this.array = Array.isArray(array) ? array : [];
    }

    add(item) {
        this.array.unshift(item);
    }

    remove() {
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