import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ImageModule } from 'primeng/image';
import { RequesterService } from '../../../services/requester.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

import { environment } from '../../../../environments/environment';
import { LocalStorageService } from '../../../services/local-storage.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule, CardModule, DialogModule, ImageModule, ToastModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  providers: [MessageService]
})
export class RegisterComponent {
  qrCode: any;
  visudialog: boolean = false;
  form!: FormGroup;
  formCheck!: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private request: RequesterService,
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private storage: LocalStorageService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.form = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
    this.formCheck = this.formBuilder.group({
      token: ['', Validators.required]
    });
  }
  get f() { return this.form.controls; }
  get fc() { return this.formCheck.controls; }
  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    this.loading = true;
    console.log(this.form.value)
    this.getMfa();
  }

  getMfa() {
    const url = environment.auth.server + "/api/auth/register";
    const data = {
      "name": this.form.value.firstName + " " + this.form.value.lastName.toUpperCase(),
      "email": this.form.value.username,
      "password": this.form.value.password
    };
    this.request.postRequest(url, data).subscribe(response => {
      console.log(response);
      if (response.status === 'ok') {
        this.qrCode = response.qrCode;
        this.loading = false;
        this.visudialog = true;
      } else {
        this.messageService.add({ severity: 'error', summary: 'Register', detail: response.message });
        this.qrCode = null;
        this.loading = false;
        this.visudialog = false;
      }
    }, error => {
      this.messageService.add({ severity: 'error', summary: 'Register', detail: error });
    })
  }
  onCheck() {
    const url = environment.auth.server + "/api/auth/login";
    const data = {
      "email": this.form.value.username,
      "password": this.form.value.password,
      "token": this.formCheck.value.token
    };
    this.loading = true;
    this.request.postRequest(url, data).subscribe(response => {
      console.log("OK", response);
      this.messageService.add({ severity: 'success', summary: 'Login', detail: response.token });
      this.storage.setItem(environment.keyToken, response.token);
      this.submitted = false;
      this.loading = false;
      this.visudialog = false;
      this.router.navigate(['/dashboard']);
    }, error => {
      console.log("ERROR", error);
      this.messageService.add({ severity: 'error', summary: 'Login', detail: error.error });
      this.storage.removeItem(environment.keyToken);
      this.submitted = false;
      this.loading = false;
      this.visudialog = false;
      this.router.navigate(['/register']);
    })
  }
  onCancel() {
    this.router.navigate(['/home']);
  }
}
