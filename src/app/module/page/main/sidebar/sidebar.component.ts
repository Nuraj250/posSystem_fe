import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  collapes = true;

  constructor() {
  }

  ngOnInit(): void {
  }

  async collape(collapes: boolean, icon: HTMLElement): Promise<any> {
    this.collapes = !collapes;
  }

}
