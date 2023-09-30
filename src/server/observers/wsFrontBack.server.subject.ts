import { FrontEventServerInterface } from "../interfaces/event.server";
import { Observer } from "./wsFrontBack.server.observer";

export interface Subject {
  observers: Observer[];
  addObserver(observer: Observer): void;
  deleteObserver(observer: Observer): void;
  notifyObservers(messages: FrontEventServerInterface[]): void;
}

export class WsFrontBackSubject implements Subject {
  public observers: Observer[] = [];

  public addObserver(observer: Observer): void {
    this.observers.push(observer);
  }

  public deleteObserver(observer: Observer): void {
    const n: number = this.observers.indexOf(observer);
    n != -1 && this.observers.splice(n, 1);
  }

  public notifyObservers(messages: FrontEventServerInterface[]): void {
    this.observers.forEach(observer => observer.notify(messages));
  }
}
