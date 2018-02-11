import Queue from './Queue';

describe('Queue', () => {
    describe('enqueue', () => {
        it('should continually add items to the beginning of the Queue', () => {
            const q = new Queue();
            q.enqueue(1);
            q.enqueue(2);
            expect(q.array).toEqual([2, 1])
        });
    });

    describe('remove', () => {
        it('if empty returns undefined', () => {
            const q = new Queue();
            expect(q.dequeue()).toBeUndefined();
        });

        it('should remove the object at the end of the Queue and return it', () => {
            const q = new Queue([1, 3, 5, 7]);
            expect(q.dequeue()).toBe(7);
            expect(q.dequeue()).toBe(5);
        });
    });

    describe('restack', () => {
        it('should add the object to the end of the Queue', () => {
            const testArray = [1, 2, 3, 4];
            const q = new Queue([...testArray]);
            q.restack(4);
            expect(q.array).toEqual([...testArray, 4]);
        });
    });
});