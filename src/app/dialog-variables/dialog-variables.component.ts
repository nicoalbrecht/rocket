import { Component, OnInit } from '@angular/core';
import {variableType} from "../shared/variable";
import {Input} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-dialog-variables',
  templateUrl: './dialog-variables.component.html',
  styleUrls: ['./dialog-variables.component.css']
})
export class DialogVariablesComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef <DialogVariablesComponent>) { }
  @Input('variableType')variableType : any;

  onNoClick(): void{
    this.dialogRef.close();
  }

  ngOnInit() {
  }

}
