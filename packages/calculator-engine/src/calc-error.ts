export class CalcError extends Error {
  constructor(public readonly code: string) {
    super(code);
    this.name = "CalcError";
  }
}
