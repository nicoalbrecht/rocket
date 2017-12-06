import {Variable} from "./variable";

export class Report {
  constructor(public id: number,
              public name: string,
              public code: string,
              public variables: Array<Variable>) {
  }
}
