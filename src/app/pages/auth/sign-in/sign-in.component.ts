import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';

import { environment } from '../../../../environments/environment';
import { AccountService } from '../../../services/account.service';
import { EventEmitterService } from '../../../services/event-emitter.service';
import { LocalStorageService } from '../../../services/local-storage.service';
import { RequesterService } from '../../../services/requester.service';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    CheckboxModule, ButtonModule, InputTextModule,
    CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule,
    CardModule, ToastModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
  providers: [MessageService, DynamicDialogRef]
})
export class SignInComponent {
  form!: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private request: RequesterService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private storage: LocalStorageService,
    private emitter: EventEmitterService,
    private accountService: AccountService,
    private ref: DynamicDialogRef,
    private activatedRoute: ActivatedRoute,
    private event: EventEmitterService
  ) {
    //console.log("Home", this.activatedRoute.snapshot.data);
    this.event.sendData({ menu: this.activatedRoute.snapshot.data['menu'] });
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      token: ['', Validators.required]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  onSubmit() {
    if (this.form.invalid) {
      this.submitted = false;
      return;
    }
    this.submitted = true;
    const url = environment.auth.server + "/api/auth/login";
    const data = {
      email: this.form.value.username,
      password: this.form.value.password,
      token: this.form.value.token
    }
    this.loading = true;
    this.request.postRequest(url, data).subscribe(response => {
      console.log("Login OK", response);
      this.messageService.add({ severity: 'success', summary: 'Login', detail: response.token });
      this.submitted = false;
      this.loading = false;
      this.storage.setItem(environment.keyToken, response.token);
      this.emitter.sendData({ logged: true });
      this.router.navigate(['/dashboard']);
    }, error => {
      console.log("Login ERROR", error);
      this.messageService.add({ severity: 'error', summary: 'Login', detail: error });
      this.submitted = false;
      this.loading = false;
      this.storage.removeItem(environment.keyToken);
      this.emitter.sendData({ logged: false });
    })
    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }
  }
  onRegister() {
    this.ref.close();
    this.router.navigate(['/register']);
  }
  onForgot() {
    this.ref.close();
    this.router.navigate(['/forgot']);
  }
  onCancel() {
    this.ref.close();
    this.router.navigate(['/home']);
  }
}
