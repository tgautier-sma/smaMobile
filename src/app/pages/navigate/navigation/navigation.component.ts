import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { MenusComponent } from '../menus/menus.component';
import { LoaderComponent } from '../../../shared/loader/loader.component';

import { Subscription, map } from 'rxjs';
import { EventEmitterService } from '../../../services/event-emitter.service';
import { SharedService } from '../../../services/shared.service';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { ScrollPanelModule } from 'primeng/scrollpanel';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterOutlet, 
    ToolbarModule, ButtonModule, AvatarModule, ScrollPanelModule,
    MenusComponent, LoaderComponent],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent {
  displayMenu = false;
  constructor(private event: EventEmitterService) { }
  ngOnInit() {
    this.event.dataEmitter.subscribe(data => {
      // console.log("Navigation :", data);
      this.displayMenu = data.menu;
    });
  }
}
