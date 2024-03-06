import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { TabMenuModule } from 'primeng/tabmenu';
import { ScrollerModule } from 'primeng/scroller';

@Component({
  selector: 'app-menu-function',
  standalone: true,
  imports: [CommonModule,
    TabMenuModule, BadgeModule,ScrollerModule
  ],
  templateUrl: './menu-function.component.html',
  styleUrl: './menu-function.component.scss'
})
export class MenuFunctionComponent {
  activeItem: MenuItem | undefined;
  @Input() items!: MenuItem[];
  @Output() setItem = new EventEmitter<MenuItem>();
  constructor() { }

  ngOnInit() {
    this.activeItem = this.items[0];
  }

  changeFunction(item: MenuItem) {
    // console.log("Active function", item);
    this.activeItem = item;
    this.setItem.emit(this.activeItem);
  }
}
