import {Newable} from "./Newable.ts";

/**
 * This class defines the singleton (anti?) pattern, which is useful for background services
 */
export class Singleton<T> {
  private _type: Newable<T>;
  private _instance?: T;

  /**
   * The constructor function for the class.
   *
   *
   * @param type: Newable&lt;T&gt; Store the type of the class that is being injected
   *
   * @return An object of type factory&lt;t&gt;
   */
  constructor(type: Newable<T>) {
    this._type = type;
    this._instance = undefined;
  }

  /**
   * The instance function returns the singleton instance of the class.
   *
   * @return The instance of the type
   */
  public get instance(): T {
    if (!this._instance) {
      let type = this._type;
      this._instance = new type();
    }
    return this._instance;
  }
}