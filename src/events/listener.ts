export default interface Listener<E> {
  callback(event: E): void;
  dispose(): void;
}