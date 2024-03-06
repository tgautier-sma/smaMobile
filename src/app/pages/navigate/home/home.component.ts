import { Component, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

import { SignInComponent } from '../auth/sign-in/sign-in.component';
import { MessageService } from 'primeng/api';
import { EventEmitterService } from '../../services/event-emitter.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ButtonModule, DynamicDialogModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  providers: [DialogService, MessageService]
})
export class HomeComponent {
  ref: DynamicDialogRef | undefined;
  constructor(
    private router: Router,
    public dialogService: DialogService,
    public messageService: MessageService,
    private activatedRoute: ActivatedRoute,
    private event: EventEmitterService
  ) {
    // console.log("Home", this.activatedRoute.snapshot.data);
    this.event.sendData({ menu: this.activatedRoute.snapshot.data['menu'] });
  }

  signIn() {
    this.router.navigate(['/signin']);
    /* this.ref = this.dialogService.open(SignInComponent, {
      header: 'Sign In',
      width: '40vw',
      closable: true,
      closeOnEscape: true,
      contentStyle: { overflow: 'auto' },
      breakpoints: {
        '960px': '50vw',
        '640px': '95vw'
      },
      baseZIndex: 10000,
      maximizable: true
    });
    this.ref.onClose.subscribe((data: any) => {
      if (data) {
        this.messageService.add({ severity: 'info', summary: 'Sign In info', detail: data });
      }
    }); */
  }
  dashboard() {
    this.router.navigate(['/dashboard']);
  }
}
