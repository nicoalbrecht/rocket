import {AfterViewInit, Component, OnInit} from '@angular/core';

import {Variable, variableType} from './../shared/variable';
import {HttpClient} from "@angular/common/http";
import {Report} from "../shared/report";

@Component({
  selector: 'app-query-builder',
  templateUrl: './query-builder.component.html',
  styleUrls: ['./query-builder.component.css']
})
export class QueryBuilderComponent implements OnInit, AfterViewInit {

  constructor(private ajax: HttpClient) { }

  cursor = 0;
  memory_stack = [];
  found_vars: Array<Variable> = [];

  reportNameInput: string;
  queryTfInput: string = "DECLARE @deadlineDate1 DATE\n" +
    "DECLARE @deadlineDate2 DATE\n" +
    "DECLARE @deadlineDate3 NUMBER\n" +
    "DECLARE @deadlineDate4 \n" +
    "DECLARE @deadlineDate5 DATE";

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  saveButtonClick(){
    const one_line_input = this.queryTfInput.replace(/(\r\n|\n|\r)/gm," ");
    this.readVariablesFromSQLText(one_line_input);
    const new_report = new Report(0, this.reportNameInput, one_line_input, this.found_vars);
    this.ajax.post('url zur api', new_report).subscribe()
    console.log(new_report);
  }

  readVariablesFromSQLText(one_line_input: string){
    // Zeilenumbrüche entfernen und durch Leerzeichen ersetzten,
    // das Ergebnis dann an Leerzeichen aufspalten und in Array (words_array) speichern
    const words_array = one_line_input.split(' ');

    //Durch die einzelnen Wörter durchgehen, bis DECLARE gefunden wurde
    for(let i = 0; i < words_array.length; i++){

      if(words_array[i].trim() === "DECLARE"){
        //Nach DECLARE steht ein Name mit @ am Anfang
        if(words_array[i+1].trim().charAt(0) === "@"){
          //Werte aus Text auslesen und in neuem Variablen-Objekt speichern
          let v = new Variable(i, words_array[i+1].trim(), variableType[words_array[i+2].trim()]);
          this.found_vars.push(v);
          //Überspringt den Name und Typ, da kein DECLARE
          i = i +2;
        }
      }
    }
    console.log(this.found_vars);
  }

}
