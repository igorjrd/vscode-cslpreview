export default interface Command<T> {
  execute(): Promise<T>;
}