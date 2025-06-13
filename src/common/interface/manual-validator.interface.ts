export interface IManualValidator<T> {
  validate(arg: T): void;
}
