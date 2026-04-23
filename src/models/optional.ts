export default class Optional<T> {
  content: T;
  private static EMPTY_OPTIONAL: Optional<unknown> = new Optional(undefined);

  private constructor(value: T) {
    this.content = value;
  }

  public static of<T>(value: T): Optional<T> {
    if (value == null)
      throw new Error("Optional value must not be null. Use Optional.ofNullable(value) instead.");

    return new Optional(value);
  }

  public static empty<T>(): Optional<T> {
    return this.EMPTY_OPTIONAL as Optional<T>;
  }

  public static ofNullable<T>(value: T): Optional<T> {
    return value == null || value == undefined
      ? this.empty<T>()
      : this.of(value);
  }

  public isPresent(): boolean {
    return this != Optional.EMPTY_OPTIONAL;
  }

  public isEmpty(): boolean {
    return !this.isPresent();
  }

  public get(): T {
    if (this.content == undefined)
      throw new Error("No object contained in Optional instance");

    return this.content;
  }
}