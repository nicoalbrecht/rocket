import {Component, OnInit} from '@angular/core';
import {Report} from '../shared/report';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {HttpLink} from 'apollo-angular-link-http';
import {Apollo} from 'apollo-angular';
import * as url from 'url';
import gql from 'graphql-tag';
import {Input} from '@angular/core';
import {trigger, state, style, animate, transition} from '@angular/animations';
import query from 'apollo-cache-inmemory/lib/fragmentMatcherIntrospectionQuery';
import {ObservableQuery} from 'apollo-client';

/*const reportQuery = gql`
        query allReports {
                report {
                    id
                    name
                    code
                    variables
                }
            }
        }   
    `;

const submitRepository = gql`
        mutation submitRepository {
            submitRepository(repoFullname:"apollographql/apollo-client"){
            allReports [
                report: {
                    id,
                    name,
                    code,
                    variables
                }
            ]  
        }
      }`;
*/

@Component({
    selector: 'app-query-loader',
    templateUrl: './query-loader.component.html',
    styleUrls: ['./query-loader.component.css'],

    animations: [
        trigger('flyInOut2', [
            state('true', style({height: '*'})),
            state('false', style({height: '0px'})),
            transition('true => false', animate('5000ms ease-in')),
            transition('false => true', animate('5000ms ease-in'))
        ])
    ]
})
export class QueryLoaderComponent implements OnInit {

    constructor(/*private apollo: Apollo, private httpLink: HttpLink*/){ }

    dummydata = [
        {
            'id': 0,
            'name': 'Test Abfrage 1',
            'code': `CREATE TABLE "topic" (
      "id" serial NOT NULL PRIMARY KEY,
      "forum_id" integer NOT NULL,
      "subject" varchar(255) NOT NULL
);
  ALTER TABLE "topic"
  ADD CONSTRAINT forum_id FOREIGN KEY ("forum_id")
  REFERENCES "forum" ("id");

-- Initials
  insert into "topic" ("forum_id", "subject")
  values (2, 'D''artagnian');`,
            'variables': [
                {
                    'id': 0,
                    'name': 'Vorname',
                    'type': 'string'
                },
                {
                    'id': 2,
                    'name': 'Nachname',
                    'type': 'string'
                },
                {
                    'id': 1,
                    'name': 'Startdatum',
                    'type': 'date'
                }
            ]
        },
        {
            'id': 1,
            'name': 'PEs mit fehlendem Betreuer Approval',
            'code': '/*\n' +
            ' *  Report: Alle Einsätze, die schon vom Ausbilder, aber noch nicht vom Betreuer approved wurden\n' +
            ' *  Parameters: \n' +
            ' *          keine\n' +
            ' */\n' +
            '\n' +
            'SELECT \n' +
            '    allocation.id AS assignmentID,\n' +
            '    training.id AS internshipID,\n' +
            '    student.firstname AS Vorname,\n' +
            '    student.lastname AS Nachname,\n' +
            '    student.hpmail AS Email,\n' +
            '    CONCAT(trainer.firstname, \' \', trainer.lastname) AS Ausbilder,\n' +
            '    allocation.title AS Titel, \n' +
            '\tallocation.startDate AS Start,\n' +
            '\tallocation.endDate AS Ende,\n' +
            '    training.mail AS Betreuer,\n' +
            '    pm.committedAt AS \'Ausbilder approved am\'\n' +
            'FROM\n' +
            '    allocation\n' +
            '    INNER JOIN approval seq ON allocation.approval = seq.id AND seq.committedAt IS NULL\n' +
            '    INNER JOIN approval pm ON seq.id = pm.parent AND pm.committedAt IS NOT NULL AND pm.discr = \'programManagerApproval\'\n' +
            '    INNER JOIN approval hm ON seq.id = hm.parent AND hm.committedAt IS NULL AND hm.discr = \'hostManagerApproval\'\n' +
            '    LEFT JOIN users ON allocation.usersid = users.id\n' +
            '    LEFT JOIN userData student ON users.id = student.usersID\n' +
            '    LEFT JOIN userData trainer ON users.trainer = trainer.usersID\n' +
            '    LEFT JOIN training ON allocation.trainingID = training.id\n' +
            'WHERE allocation.status = 8\n',
            'variables': [
                {
                    'id': 3,
                    'name': 'Deadline',
                    'type': 'date'
                },
                {
                    'id': 4,
                    'name': 'Studienjahr',
                    'type': 'number'
                },
                {
                    'id': 5,
                    'name': 'E-Mail',
                    'type': 'string'
                }
            ]
        },
        {
            'id': 2,
            'name': 'Verschlafene Abgaben',
            'code': ' USE [DIVE_R1]\n' +
            '\n' +
            ' \n' +
            ' /*\n' +
            '\tAbgabe Deadline der Noten im Format \'JJJJ-MM-DD\'\n' +
            ' */\n' +
            ' DECLARE @deadlineDate DATE\n' +
            ' SET @deadlineDate\n' +
            '\n' +
            ' SELECT \'PE Note\' AS Was\n' +
            '\t  ,CONCAT([dbo].[allocation].[hostManagerFirstname],\' \',[dbo].[allocation].[hostManagerLastname]) AS Betreuer\n' +
            '\t  ,CONCAT([dbo].[user].[firstName],\' \',[dbo].[user].[lastName]) AS Sünder\n' +
            '\t  ,[dbo].[allocation].[title] AS \'Details\'\n' +
            '\t  ,CAST([dbo].[allocation].[reviewdate] AS nvarchar(30)) AS Abgabe\n' +
            'FROM [dbo].[allocation]\n' +
            '\tLEFT JOIN [dbo].[user] ON [dbo].[allocation].[usersID] = [dbo].[user].[id]\n' +
            'WHERE [dbo].[allocation].[reviewdate] >= @deadlineDate AND [dbo].[user].[lastName] NOT LIKE \'A_%\'\n' +
            '\n' +
            'UNION\n' +
            '\n' +
            'SELECT \'Jahresgespräch Note\' AS Was\n' +
            '\t  ,CONCAT(mngr.[firstName],\' \',mngr.[lastName]) AS Betreuer\n' +
            '\t  ,CONCAT([dbo].[user].[firstName],\' \',[dbo].[user].[lastName]) AS Sünder\n' +
            '\t  ,CONCAT([dbo].[gradeYearEndMeeting].[trainingyear],\'\',\'. Jahr\') AS \'Details\'\n' +
            '\t  ,CAST([dbo].[gradeYearEndMeeting].[reviewdate] AS nvarchar(30))  AS Abgabe\n' +
            'FROM [dbo].[gradeYearEndMeeting]\n' +
            '\tLEFT JOIN [dbo].[user] ON [dbo].[gradeYearEndMeeting].[usersID] = [dbo].[user].[id]\n' +
            '\tLEFT JOIN [dbo].[bachelorStudent] ON [dbo].[gradeYearEndMeeting].[usersID] = [dbo].[bachelorStudent].[userID]\n' +
            '\tLEFT JOIN [dbo].[user] AS mngr ON [dbo].[bachelorStudent].[programManagerId] = mngr.[id] \n' +
            'WHERE [dbo].[gradeYearEndMeeting].[reviewdate] >= @deadlineDate AND [dbo].[user].[lastName] NOT LIKE \'A_%\'\n' +
            '\n' +
            'UNION\n' +
            '\n' +
            'SELECT \'Uni Note\' AS Was\n' +
            '\t,CONCAT(mngrY1.[firstName],\' \',mngrY1.[lastName]) AS Betreuer\n' +
            '\t,CONCAT(usrY1.[firstName],\' \',usrY1.[lastName]) AS Sünder\n' +
            '\t,CONCAT(gsY1.[trainingyear],\'\',\'. Jahr\') AS \'Details\'\n' +
            '\t,CAST((gsY1.[trainingyear] + [dbo].[ageGroup].[year]) AS nvarchar(30)) AS Abgabe\n' +
            'FROM [dbo].[ageGroup]\n' +
            '\tLEFT JOIN [dbo].[bachelorStudent] ON [dbo].[ageGroup].[id] = [dbo].[bachelorStudent].[groupID]\n' +
            '\tLEFT JOIN [dbo].[user] AS mngrY1 ON [dbo].[bachelorStudent].[programManagerId] = mngrY1.[id]\n' +
            '\tLEFT JOIN [dbo].[user] AS usrY1 ON [dbo].[bachelorStudent].[userID] = usrY1.[id]\n' +
            '\tINNER JOIN [dbo].[gradeSchool] AS gsY1 ON NOT EXISTS (SELECT id FROM [dbo].[gradeSchool] WHERE usersID = usrY1.[id] AND trainingyear = 1)\n' +
            'WHERE [dbo].[ageGroup].[year] = YEAR(@deadlineDate)-1 AND (gsY1.[trainingyear] + [dbo].[ageGroup].[year]) = YEAR(@deadlineDate) AND usrY1.[lastName] NOT LIKE \'A_%\'\n' +
            '\n' +
            'UNION\n' +
            '\n' +
            'SELECT \'Uni Note\' AS Was\n' +
            '\t,CONCAT(mngrY2.[firstName],\' \',mngrY2.[lastName]) AS Betreuer\n' +
            '\t,CONCAT(usrY2.[firstName],\' \',usrY2.[lastName]) AS Sünder\n' +
            '\t,CONCAT(gsY2.[trainingyear],\'\',\'. Jahr\') AS \'Details\'\n' +
            '\t,CAST((gsY2.[trainingyear] + [dbo].[ageGroup].[year]) AS nvarchar(30)) AS Abgabe\n' +
            'FROM [dbo].[ageGroup]\n' +
            '\tLEFT JOIN [dbo].[bachelorStudent] ON [dbo].[ageGroup].[id] = [dbo].[bachelorStudent].[groupID]\n' +
            '\tLEFT JOIN [dbo].[user] AS mngrY2 ON [dbo].[bachelorStudent].[programManagerId] = mngrY2.[id]\n' +
            '\tLEFT JOIN [dbo].[user] AS usrY2 ON [dbo].[bachelorStudent].[userID] = usrY2.[id]\n' +
            '\tINNER JOIN [dbo].[gradeSchool] AS gsY2 ON NOT EXISTS (SELECT id FROM [dbo].[gradeSchool] WHERE usersID = usrY2.[id] AND trainingyear = 2)\n' +
            'WHERE [dbo].[ageGroup].[year] = YEAR(@deadlineDate)-2 AND (gsY2.[trainingyear] + [dbo].[ageGroup].[year]) = YEAR(@deadlineDate) AND usrY2.[lastName] NOT LIKE \'A_%\'\n' +
            '\n' +
            'UNION\n' +
            '\n' +
            'SELECT \'Uni Note\' AS Was\n' +
            '\t,CONCAT(mngrY3.[firstName],\' \',mngrY3.[lastName]) AS Betreuer\n' +
            '\t,CONCAT(usrY3.[firstName],\' \',usrY3.[lastName]) AS Sünder\n' +
            '\t,CONCAT(gsY3.[trainingyear],\'\',\'. Jahr\') AS \'Details\'\n' +
            '\t,CAST((gsY3.[trainingyear] + [dbo].[ageGroup].[year]) AS nvarchar(30)) AS Abgabe\n' +
            'FROM [dbo].[ageGroup]\n' +
            '\tLEFT JOIN [dbo].[bachelorStudent] ON [dbo].[ageGroup].[id] = [dbo].[bachelorStudent].[groupID]\n' +
            '\tLEFT JOIN [dbo].[user] AS mngrY3 ON [dbo].[bachelorStudent].[programManagerId] = mngrY3.[id]\n' +
            '\tLEFT JOIN [dbo].[user] AS usrY3 ON [dbo].[bachelorStudent].[userID] = usrY3.[id] \n' +
            '\tINNER JOIN [dbo].[gradeSchool] AS gsY3 ON NOT EXISTS (SELECT id FROM [dbo].[gradeSchool] WHERE usersID = usrY3.[id] AND trainingyear = 3)\n' +
            'WHERE [dbo].[ageGroup].[year] = YEAR(@deadlineDate)-3 AND (gsY3.[trainingyear] + [dbo].[ageGroup].[year]) = YEAR(@deadlineDate) AND usrY3.[lastName] NOT LIKE \'A_%\'\n' +
            '\n' +
            'ORDER BY Sünder ASC',
            'variables': [
                {
                    'id': 6,
                    'name': 'Startdatum',
                    'type': 'date'
                },
                {
                    'id': 7,
                    'name': 'Enddatum',
                    'type': 'date'
                },
                {
                    'id': 8,
                    'name': 'Anzahl',
                    'type': 'number'
                }
            ]
        }
    ];
    selectedReport: Report;
    showCode: String = 'false';




    ngOnInit(){
       /* this.apollo.watchQuery({
            query: reportQuery
        }).valueChanges.subscribe( data => {
            console.log(data.loading);
            console.log(data.data);
        });*/
    }

  /*  newRepository(){
        this.apollo.mutate({
            mutation: submitRepository
        }).subscribe();
    }

*/
}
