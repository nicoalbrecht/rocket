import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  tiles = [
    {
      heading: 'Hi Sabrina',
      cols: 3,
      rows: 2,
      content: 'Heading'
    },
    {
      heading: 'Anstehende Events',
      cols: 1,
      rows: 4,
      content: 'Heading'
    },
    {
      heading: 'Todos',
      cols: 2,
      rows: 1,
      content: 'Heading'
    },
    {
      heading: 'Wetter',
      cols: 1,
      rows: 2,
      content: 'Heading'
    },
    {
      heading: 'Deadlines',
      cols: 2,
      rows: 1,
      content: 'Heading'
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}
