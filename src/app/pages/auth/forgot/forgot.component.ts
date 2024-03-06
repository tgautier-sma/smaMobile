import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { ImageModule } from 'primeng/image';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { RequesterService } from '../../../services/requester.service';

@Component({
  selector: 'app-forgot',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule, CardModule, DialogModule, ImageModule, ToastModule],
  templateUrl: './forgot.component.html',
  styleUrl: './forgot.component.scss',
  providers: [MessageService]
})
export class ForgotComponent {
  form!: FormGroup;
  constructor(
    private request: RequesterService,
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
  ) { }
  ngOnInit() {
    this.form = this.formBuilder.group({
      username: ['', Validators.required]
    });
  }
  onSubmit() {
    this.router.navigate(['/signin']);
  }
  onCancel() {
    console.log("Cancel forgot");
    this.router.navigate(['/home']);
  }
}
