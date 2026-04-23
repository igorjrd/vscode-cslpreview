import { Event, Disposable } from 'vscode';
import DisposableRegistry from '../services/disposable-registry';
import Listener from './listener';

export default abstract class BaseListener<T> implements Listener<T> {
  protected disposable: Disposable;

  protected constructor(event: Event<T>) {
    this.disposable = event(this.callback);
    DisposableRegistry.register(this.disposable);
  }

  abstract callback(event: T): void;

  dispose(): void {
    this.disposable.dispose();
  }
}