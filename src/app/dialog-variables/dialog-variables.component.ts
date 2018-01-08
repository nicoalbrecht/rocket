import { Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {Variable} from "../shared/variable";

@Component({
  selector: 'app-dialog-variables',
  templateUrl: './dialog-variables.component.html',
  styleUrls: ['./dialog-variables.component.css']
})
export class DialogVariablesComponent {

  constructor(public dialogRef: MatDialogRef <DialogVariablesComponent>,
    @Inject(MAT_DIALOG_DATA)public inputData : Array <Variable> ) {}


  onNoClick(): void{
    this.dialogRef.close();
  }


}
