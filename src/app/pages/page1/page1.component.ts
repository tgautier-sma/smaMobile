import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MenuFunctionComponent } from '../../shared/menu-function/menu-function.component';
import { MenuItem } from 'primeng/api';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-page1',
  standalone: true,
  imports: [CommonModule,
    MenuFunctionComponent, CardModule],
  templateUrl: './page1.component.html',
  styleUrl: './page1.component.scss',
  providers: [MenuFunctionComponent]
})
export class Page1Component {
  optItems!: MenuItem[];
  activeOpt!: MenuItem;
  infItems!: MenuItem[];
  activeInf!: MenuItem;

  ngOnInit() {
    this.optItems = [
      { id: "fn1", label: 'Fonction 1', icon: 'pi pi-fw pi-home', badge: "3", badgeSeverity: "danger" },
      { id: "fn2", label: 'Fonction 2', icon: 'pi pi-fw pi-calendar' },
      { id: "fn3", label: 'Fonction 3', icon: 'pi pi-fw pi-pencil' },
      { id: "fn4", label: 'Fonction 4', icon: 'pi pi-fw pi-file' },
      { id: "fn5", label: 'Fonction 5', icon: 'pi pi-fw pi-cog' }
    ];
    this.activeOpt = this.optItems[0];
    this.infItems = [
      { id: "fn1", label: 'Fonction 1', icon: 'pi pi-fw pi-home', badge: "2", badgeSeverity: "info" },
      { id: "fn2", label: 'Fonction 2', icon: 'pi pi-fw pi-calendar' },
      { id: "fn5", label: 'Fonction 5', icon: 'pi pi-fw pi-cog' }
    ];
    this.activeInf = this.optItems[0];
  }
  applyItem(event: MenuItem) {
    this.activeOpt = event;
  }
  applyInfo(event: MenuItem) {
    this.activeInf = event;
  }
}
