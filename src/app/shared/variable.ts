export class Variable {
  constructor(
      public id: number,
      public name: string,
      public type: variableType
  ){ }
}

export enum variableType {
  STRING = 'string',
  NUMBER = 'number',
  DATE = 'date'
}
