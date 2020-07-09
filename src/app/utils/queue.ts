/*
A queue that can be of type T
Generics are great in any language
*/
export class Queue<T> {
    private items: T[] = [];
    /* Add and pop do the same thing
    One has the fat arrow syntax
    */
    public add = (item: T) => this.items.push(item);

    public pop(): T {
        return this.items.shift();
    }

    isEmpty(): boolean {
        return this.items.length == 0;
    }
}