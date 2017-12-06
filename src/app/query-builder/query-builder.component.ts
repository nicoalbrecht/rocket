import {AfterViewInit, Component, ElementRef,  OnInit} from '@angular/core';

import {Variable, variableType} from './../shared/variable';
import {HttpClient} from "@angular/common/http";
import {Report} from "../shared/report";

@Component({
  selector: 'app-query-builder',
  templateUrl: './query-builder.component.html',
  styleUrls: ['./query-builder.component.css']
})
export class QueryBuilderComponent implements OnInit, AfterViewInit {

  constructor(private el: ElementRef, private ajax: HttpClient) { }

  cursor = 0;
  memory_stack = [];
  found_vars: Array<Variable> = [];
  dummydata = [
    {
      'id':0,
      'name':'Test Abfrage 1',
      'code':'/*<br>' +
      ' *  Report: Anzahl der Praktika, die Studenten ab einem gewissen Datum zugeteilt sind<br>' +
      ' *  Parameters: <br>' +
      ' *          @ab: ab wann Praktika gezählt werden (Startdatum nach dem gestzten Datum)<br>' +
      ' */<br>' +
      '<br>' +
      'DECLARE @ab VARCHAR(20)<br>' +
      'SET @ab = \'2017-05-01\'<br>' +
      '<br>' +
      'SELECT <br>' +
      '    CONCAT(trainer.firstname, \'  \', trainer.lastname) AS Ausbilder,<br>' +
      '    student.firstname AS Vorname, <br>' +
      '    student.lastname AS Nachname, <br>' +
      '    student.hpmail AS Email,<br>' +
      '    count.PEcount AS \'Anzahl zukünfitge PE\', <br>' +
      '    ageGroup.year AS Jahrgang, <br>' +
      '    career.abbreviation AS Studiengang,<br>' +
      '    school.name AS DH,<br>' +
      '    location.city AS Standort<br>' +
      'FROM (<br>' +
      '    SELECT <br>' +
      '        users.id AS usersID, <br>' +
      '        count(allocation.id) AS PEcount<br>' +
      '    FROM users<br>' +
      '    LEFT JOIN allocation ON (allocation.usersid = users.id AND allocation.status = 2 AND allocation.startDate > @ab)<br>' +
      '    GROUP BY users.ID <br>' +
      ') count <br>' +
      'LEFT JOIN userData student ON count.usersID = student.usersID<br>' +
      'LEFT JOIN users ON count.usersid = users.id<br>' +
      'LEFT JOIN ageGroup ON users.agegroupid = agegroup.id<br>' +
      'LEFT JOIN career ON agegroup.careerid = career.id<br>' +
      'LEFT JOIN userData trainer ON users.trainer = trainer.usersid<br>' +
      'LEFT JOIN school ON agegroup.schoolID = school.id<br>' +
      'LEFT JOIN location ON agegroup.locationID = location.id<br>' +
      'WHERE agegroup.year >= 2014 AND student.lastname NOT LIKE \'A\\_%\' ESCAPE \'\\\'<br>' +
      'ORDER BY ageGroup.year, career.abbreviation, count.PEcount<br>',
      'variables': [
        {
          'id':0,
          'name':'Var0',
          'type':0
        },
        {
          'id':1,
          'name':'Var1',
          'type':1
        },
        {
          'id':2,
          'name':'Var2',
          'type':0
        }
      ]
    },
    {
      'id':1,
      'name':'Test Abfrage 2',
      'code':'/*<br>' +
      ' *  Report: Alle Einsätze, die schon vom Ausbilder, aber noch nicht vom Betreuer approved wurden<br>' +
      ' *  Parameters: <br>' +
      ' *          keine<br>' +
      ' */<br>' +
      '<br>' +
      'SELECT <br>' +
      '    allocation.id AS assignmentID,<br>' +
      '    training.id AS internshipID,<br>' +
      '    student.firstname AS Vorname,<br>' +
      '    student.lastname AS Nachname,<br>' +
      '    student.hpmail AS Email,<br>' +
      '    CONCAT(trainer.firstname, \' \', trainer.lastname) AS Ausbilder,<br>' +
      '    allocation.title AS Titel, <br>' +
      '\tallocation.startDate AS Start,<br>' +
      '\tallocation.endDate AS Ende,<br>' +
      '    training.mail AS Betreuer,<br>' +
      '    pm.committedAt AS \'Ausbilder approved am\'<br>' +
      'FROM<br>' +
      '    allocation<br>' +
      '    INNER JOIN approval seq ON allocation.approval = seq.id AND seq.committedAt IS NULL<br>' +
      '    INNER JOIN approval pm ON seq.id = pm.parent AND pm.committedAt IS NOT NULL AND pm.discr = \'programManagerApproval\'<br>' +
      '    INNER JOIN approval hm ON seq.id = hm.parent AND hm.committedAt IS NULL AND hm.discr = \'hostManagerApproval\'<br>' +
      '    LEFT JOIN users ON allocation.usersid = users.id<br>' +
      '    LEFT JOIN userData student ON users.id = student.usersID<br>' +
      '    LEFT JOIN userData trainer ON users.trainer = trainer.usersID<br>' +
      '    LEFT JOIN training ON allocation.trainingID = training.id<br>' +
      'WHERE allocation.status = 8<br>',
      'variables': [
        {
          'id':3,
          'name':'Var3',
          'type':0
        },
        {
          'id':4,
          'name':'Var4',
          'type':1
        },
        {
          'id':5,
          'name':'Var5',
          'type':0
        }
      ]
    },
    {
      'id':2,
      'name':'Test Abfrage 3',
      'code':' USE [DIVE_R1]<br>' +
      '<br>' +
      ' <br>' +
      ' /*<br>' +
      '\tAbgabe Deadline der Noten im Format \'JJJJ-MM-DD\'<br>' +
      ' */<br>' +
      ' DECLARE @deadlineDate DATE<br>' +
      ' SET @deadlineDate<br>' +
      '<br>' +
      ' SELECT \'PE Note\' AS Was<br>' +
      '\t  ,CONCAT([dbo].[allocation].[hostManagerFirstname],\' \',[dbo].[allocation].[hostManagerLastname]) AS Betreuer<br>' +
      '\t  ,CONCAT([dbo].[user].[firstName],\' \',[dbo].[user].[lastName]) AS Sünder<br>' +
      '\t  ,[dbo].[allocation].[title] AS \'Details\'<br>' +
      '\t  ,CAST([dbo].[allocation].[reviewdate] AS nvarchar(30)) AS Abgabe<br>' +
      'FROM [dbo].[allocation]<br>' +
      '\tLEFT JOIN [dbo].[user] ON [dbo].[allocation].[usersID] = [dbo].[user].[id]<br>' +
      'WHERE [dbo].[allocation].[reviewdate] >= @deadlineDate AND [dbo].[user].[lastName] NOT LIKE \'A_%\'<br>' +
      '<br>' +
      'UNION<br>' +
      '<br>' +
      'SELECT \'Jahresgespräch Note\' AS Was<br>' +
      '\t  ,CONCAT(mngr.[firstName],\' \',mngr.[lastName]) AS Betreuer<br>' +
      '\t  ,CONCAT([dbo].[user].[firstName],\' \',[dbo].[user].[lastName]) AS Sünder<br>' +
      '\t  ,CONCAT([dbo].[gradeYearEndMeeting].[trainingyear],\'\',\'. Jahr\') AS \'Details\'<br>' +
      '\t  ,CAST([dbo].[gradeYearEndMeeting].[reviewdate] AS nvarchar(30))  AS Abgabe<br>' +
      'FROM [dbo].[gradeYearEndMeeting]<br>' +
      '\tLEFT JOIN [dbo].[user] ON [dbo].[gradeYearEndMeeting].[usersID] = [dbo].[user].[id]<br>' +
      '\tLEFT JOIN [dbo].[bachelorStudent] ON [dbo].[gradeYearEndMeeting].[usersID] = [dbo].[bachelorStudent].[userID]<br>' +
      '\tLEFT JOIN [dbo].[user] AS mngr ON [dbo].[bachelorStudent].[programManagerId] = mngr.[id] <br>' +
      'WHERE [dbo].[gradeYearEndMeeting].[reviewdate] >= @deadlineDate AND [dbo].[user].[lastName] NOT LIKE \'A_%\'<br>' +
      '<br>' +
      'UNION<br>' +
      '<br>' +
      'SELECT \'Uni Note\' AS Was<br>' +
      '\t,CONCAT(mngrY1.[firstName],\' \',mngrY1.[lastName]) AS Betreuer<br>' +
      '\t,CONCAT(usrY1.[firstName],\' \',usrY1.[lastName]) AS Sünder<br>' +
      '\t,CONCAT(gsY1.[trainingyear],\'\',\'. Jahr\') AS \'Details\'<br>' +
      '\t,CAST((gsY1.[trainingyear] + [dbo].[ageGroup].[year]) AS nvarchar(30)) AS Abgabe<br>' +
      'FROM [dbo].[ageGroup]<br>' +
      '\tLEFT JOIN [dbo].[bachelorStudent] ON [dbo].[ageGroup].[id] = [dbo].[bachelorStudent].[groupID]<br>' +
      '\tLEFT JOIN [dbo].[user] AS mngrY1 ON [dbo].[bachelorStudent].[programManagerId] = mngrY1.[id]<br>' +
      '\tLEFT JOIN [dbo].[user] AS usrY1 ON [dbo].[bachelorStudent].[userID] = usrY1.[id]<br>' +
      '\tINNER JOIN [dbo].[gradeSchool] AS gsY1 ON NOT EXISTS (SELECT id FROM [dbo].[gradeSchool] WHERE usersID = usrY1.[id] AND trainingyear = 1)<br>' +
      'WHERE [dbo].[ageGroup].[year] = YEAR(@deadlineDate)-1 AND (gsY1.[trainingyear] + [dbo].[ageGroup].[year]) = YEAR(@deadlineDate) AND usrY1.[lastName] NOT LIKE \'A_%\'<br>' +
      '<br>' +
      'UNION<br>' +
      '<br>' +
      'SELECT \'Uni Note\' AS Was<br>' +
      '\t,CONCAT(mngrY2.[firstName],\' \',mngrY2.[lastName]) AS Betreuer<br>' +
      '\t,CONCAT(usrY2.[firstName],\' \',usrY2.[lastName]) AS Sünder<br>' +
      '\t,CONCAT(gsY2.[trainingyear],\'\',\'. Jahr\') AS \'Details\'<br>' +
      '\t,CAST((gsY2.[trainingyear] + [dbo].[ageGroup].[year]) AS nvarchar(30)) AS Abgabe<br>' +
      'FROM [dbo].[ageGroup]<br>' +
      '\tLEFT JOIN [dbo].[bachelorStudent] ON [dbo].[ageGroup].[id] = [dbo].[bachelorStudent].[groupID]<br>' +
      '\tLEFT JOIN [dbo].[user] AS mngrY2 ON [dbo].[bachelorStudent].[programManagerId] = mngrY2.[id]<br>' +
      '\tLEFT JOIN [dbo].[user] AS usrY2 ON [dbo].[bachelorStudent].[userID] = usrY2.[id]<br>' +
      '\tINNER JOIN [dbo].[gradeSchool] AS gsY2 ON NOT EXISTS (SELECT id FROM [dbo].[gradeSchool] WHERE usersID = usrY2.[id] AND trainingyear = 2)<br>' +
      'WHERE [dbo].[ageGroup].[year] = YEAR(@deadlineDate)-2 AND (gsY2.[trainingyear] + [dbo].[ageGroup].[year]) = YEAR(@deadlineDate) AND usrY2.[lastName] NOT LIKE \'A_%\'<br>' +
      '<br>' +
      'UNION<br>' +
      '<br>' +
      'SELECT \'Uni Note\' AS Was<br>' +
      '\t,CONCAT(mngrY3.[firstName],\' \',mngrY3.[lastName]) AS Betreuer<br>' +
      '\t,CONCAT(usrY3.[firstName],\' \',usrY3.[lastName]) AS Sünder<br>' +
      '\t,CONCAT(gsY3.[trainingyear],\'\',\'. Jahr\') AS \'Details\'<br>' +
      '\t,CAST((gsY3.[trainingyear] + [dbo].[ageGroup].[year]) AS nvarchar(30)) AS Abgabe<br>' +
      'FROM [dbo].[ageGroup]<br>' +
      '\tLEFT JOIN [dbo].[bachelorStudent] ON [dbo].[ageGroup].[id] = [dbo].[bachelorStudent].[groupID]<br>' +
      '\tLEFT JOIN [dbo].[user] AS mngrY3 ON [dbo].[bachelorStudent].[programManagerId] = mngrY3.[id]<br>' +
      '\tLEFT JOIN [dbo].[user] AS usrY3 ON [dbo].[bachelorStudent].[userID] = usrY3.[id] <br>' +
      '\tINNER JOIN [dbo].[gradeSchool] AS gsY3 ON NOT EXISTS (SELECT id FROM [dbo].[gradeSchool] WHERE usersID = usrY3.[id] AND trainingyear = 3)<br>' +
      'WHERE [dbo].[ageGroup].[year] = YEAR(@deadlineDate)-3 AND (gsY3.[trainingyear] + [dbo].[ageGroup].[year]) = YEAR(@deadlineDate) AND usrY3.[lastName] NOT LIKE \'A_%\'<br>' +
      '<br>' +
      'ORDER BY Sünder ASC',
      'variables': [
        {
          'id':6,
          'name':'Var6',
          'type':0
        },
        {
          'id':7,
          'name':'Var7',
          'type':1
        },
        {
          'id':8,
          'name':'Var8',
          'type':0
        }
      ]
    }
  ];
  selectedReport: Report;


  reportNameInput: string;
  queryTfInput: string = "DECLARE @deadlineDate1 DATE\n" +
    "DECLARE @deadlineDate2 DATE\n" +
    "DECLARE @deadlineDate3 NUMBER\n" +
    "DECLARE @deadlineDate4 \n" +
    "DECLARE @deadlineDate5 DATE";

  ngOnInit() {
    console.log(this.dummydata);
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
