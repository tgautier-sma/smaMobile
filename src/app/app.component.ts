import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { PrimeNGConfig } from 'primeng/api';
import { NavigationComponent } from './pages/navigate/navigation/navigation.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet,NavigationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers:[]
})
export class AppComponent implements OnInit {
  title="sma-mobile";
  constructor(private config: PrimeNGConfig) {}

  ngOnInit() {   
  }
}