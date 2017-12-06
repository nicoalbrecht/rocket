export class Variable {
  constructor(
      public id: number,
      public name: string,
      public type: variableType
  ){ }
}

export enum variableType {
  STRING = 0,
  NUMBER = 1,
  DATE = 2
}
