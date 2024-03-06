import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';

import { PrimeNGConfig } from 'primeng/api';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { AvatarModule } from 'primeng/avatar';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet,
    SidebarModule, ButtonModule, ToolbarModule,AvatarModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: []
})
export class AppComponent implements OnInit {
  title = "sma-mobile";
  appVer = environment.version;
  sidebarVisible: boolean = false;
  constructor(private config: PrimeNGConfig,
    private router: Router,
   ) { }

  ngOnInit() {
  }
  goHome() {
    this.router.navigate(['/dashboard']);
  }
}