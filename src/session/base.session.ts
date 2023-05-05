import { NotFoundException } from '@nestjs/common';

import ExceptionMessage from '@dto/socket/exception.message';

class BaseSession<T> {
  protected store = new Map<number, T>();

  public sequence = 0;

  public getNextSequence() {
    return ++this.sequence;
  }

  public size(): number {
    return this.store.size;
  }

  public get(key: number, isRough = false): T {
    if (!isRough && !this.store.has(key))
      throw new NotFoundException(ExceptionMessage.NOT_FOUND);
    return this.store.get(key);
  }

  public set(key: number, value: T): void {
    this.store.set(key, value);
  }

  public delete(key: number) {
    this.store.delete(key);
  }

  public has(key: number): boolean {
    return this.store.has(key);
  }

  public values(): IterableIterator<T> {
    return this.store.values();
  }
}

export default BaseSession;
