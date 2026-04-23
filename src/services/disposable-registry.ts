import { Disposable } from "vscode"

export default class DisposableRegistry {
  private static readonly disposables: Set<Disposable> = new Set<Disposable>();

  static disposeAll(): void {
    this.disposables.forEach(disposable => disposable.dispose());
  }

  static register(disposable: Disposable) {
    this.disposables.add(disposable);
  }

  static dismiss(disposable: Disposable) {
    if (!this.disposables.has(disposable))
      throw new Error("Disposable cannot be dismissed. It was not registered in extension lifecycle.");
    this.disposables.delete(disposable);
  }

  static dispose(disposable: Disposable) {
    this.disposables.delete(disposable);
    disposable.dispose();
  }
}