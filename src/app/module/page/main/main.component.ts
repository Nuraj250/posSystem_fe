import {Component, OnInit} from '@angular/core';
import { AppService } from 'src/app/core/service/app.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {


  constructor(private appService: AppService) {
  }

  ngOnInit(): void {
  }

   getClasses(): any{
    const classes = {
      'pinned-sidebar': this.appService.getSidebarStat().isSidebarPinned,
      'toggeled-sidebar': this.appService.getSidebarStat().isSidebarToggeled
    };
    return classes;
  }

   toggleSidebar(): any {
    this.appService.toggleSidebar();
  }
}
