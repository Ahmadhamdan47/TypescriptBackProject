import { EventServerInterface } from "../interfaces/event.server";
import { Observer } from "./event.server.observer";

export interface Subject {
  observers: Observer[];
  addObserver(observer: Observer): void;
  deleteObserver(observer: Observer): void;
  notifyObservers(events: EventServerInterface[]): void;
}

export class EventSubject implements Subject {
  public observers: Observer[] = [];

  public addObserver(observer: Observer): void {
    this.observers.push(observer);
  }

  public deleteObserver(observer: Observer): void {
    const n: number = this.observers.indexOf(observer);
    n != -1 && this.observers.splice(n, 1);
  }

  public notifyObservers(events: EventServerInterface[]): void {
    this.observers.forEach(observer => observer.notify(events));
  }
}
