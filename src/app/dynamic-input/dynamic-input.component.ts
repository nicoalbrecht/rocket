import {Component, Input, OnInit} from '@angular/core';
import {Variable, variableType} from "../shared/variable";

@Component({
  selector: 'app-dynamic-input',
  templateUrl: './dynamic-input.component.html',
  styleUrls: ['./dynamic-input.component.css']
})
export class DynamicInputComponent implements OnInit {

  constructor() {}

  @Input('variable') variable: Variable;
  showDatepicker: boolean;

  ngOnInit() {
    this.showDatepicker = this.variable.type === variableType.DATE;
    console.log(this.variable);
  }

}

