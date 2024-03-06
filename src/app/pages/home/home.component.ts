import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { AccordionModule } from 'primeng/accordion';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,
    AccordionModule, ButtonModule, AvatarModule, BadgeModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  activeIndex: number | undefined = 0;

  activeIndexChange(index: any) {
    console.log("Change Index:", index);
    this.activeIndex = index
  }

}
