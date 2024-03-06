import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService, PrimeNGConfig, SelectItem } from 'primeng/api';
import { RequesterService } from '../../services/requester.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { EditorModule } from 'primeng/editor';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';
import { XmlParserComponent } from '../xml-parser/xml-parser.component';
import { DataViewModule } from 'primeng/dataview';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';

export class MailModelInput {
  name: any = "";
  description: any = "";
  data_text: any = null;
  data_html: any = null;
}

@Component({
  selector: 'app-text-model',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule,
    ButtonModule, AccordionModule,
    TableModule, InputTextModule,
    ToastModule, TabViewModule, CalendarModule, DropdownModule, EditorModule, CardModule,
    DataViewModule, ConfirmDialogModule, DialogModule
  ],
  templateUrl: './text-model.component.html',
  styleUrls: ['./text-model.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class TextModelComponent implements OnInit {
  models: any = [];
  displayModal = false;
  selectedModel: any;           // selected model from the database, with id
  selectedModelId: any;         // selected record id for CRUD operations
  sortOptions!: SelectItem[];
  sortOrder!: number;
  sortField!: string;
  currentAdd = false;
  currentModel!: FormGroup;
  submitted = false;
  @ViewChild('ed') ed!: any;
  @ViewChild('edHtml') edHtml!: any;

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private request: RequesterService,
    private primengConfig: PrimeNGConfig,
    private router: Router,
    private sanitizer: DomSanitizer,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.currentModel = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(4)]],
      data_text: ['', Validators.required],
      data_html: ['', Validators.required],
      description: ['', Validators.required],
    });
    this.getModels();
  }
  getModels() {
    this.models = [];
    this.currentModel.reset();
    this.request.getStore('mail_model', true).subscribe((response: { data: any; }) => {
      console.log("Models", response);
      this.models = response.data;
    })
  }
  get f() { return this.currentModel.controls; }
  secureHtml(html: any) {
    return this.sanitizer.bypassSecurityTrustHtml(html)
  }
  onSortChange(event: any) {
    let value = event.value;
    if (value.indexOf('!') === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1, value.length);
    }
    else {
      this.sortOrder = 1;
      this.sortField = value;
    }
  }
  onSubmit() {
    this.submitted = true;
    if (this.currentModel.invalid) {
      return;
    }
    console.log(this.currentModel.value);
    this.updateModel()
  }

  setModel(event: any) {
    // console.log("Apply model", event);
    this.selectedModelId = event.id;
    this.selectedModel = event.attributes;
    this.currentModel.reset();
    this.currentModel.setValue(
      {
      name: this.selectedModel.name,
      description: this.selectedModel.description,
        data_text: this.selectedModel.data_text,
        data_html: this.selectedModel.data_html
      });
    this.currentAdd = false;
    this.displayModal = true;

  }
  addNewModel() {
    this.currentModel.reset();
    this.selectedModel = {
      app: "mail_model",
      name: "",
      description: "",
      json: null,
      model: null,
      data_text: "",
      data_html: ""
    };
    this.currentAdd = true;
    this.displayModal = true;
  }
  updateModel() {
    console.log("Current model updated", this.currentModel, this.selectedModel);
    this.selectedModel.name = this.currentModel.value.name;
    this.selectedModel.description = this.currentModel.value.description;
    //this.selectedModel.data_text = this.currentModel.value.data_text;
    this.selectedModel.data_text = this.sanitizer.sanitize(0, this.currentModel.value.data_text);
    this.selectedModel.data_html = this.sanitizer.sanitize(0, this.currentModel.value.data_html);
    if (this.currentAdd) {
      this.request.postStore(this.selectedModel).subscribe((response: any) => {
        // console.log(response);
        this.currentModel.reset()
        this.displayModal = false;
        this.messageService.add({ severity: 'info', summary: 'Ajout du modèle', detail: response });
        this.getModels();
      }, (error: any) => {
        console.log(error);
        this.messageService.add({ severity: 'error', summary: 'PAS de modification des données', detail: error });
        this.getModels();
      })
    } else {
      this.request.putStore(this.selectedModelId, this.selectedModel).subscribe((response: any) => {
        // console.log(response);
        this.currentModel.reset();
        this.displayModal = false;
        this.messageService.add({ severity: 'info', summary: 'Modification du modèles', detail: 'Données modifiées' });
        this.getModels();
      }, (error: any) => {
        console.log(error);
        this.messageService.add({ severity: 'error', summary: 'PAS de modification des données', detail: error });
        this.getModels();
      })
    }
  }
  deleteModel(event: any) {
    console.log(event);
    const id = event.id;
    this.confirmationService.confirm({
      message: `Are you sure you want to delete item #${id}?`,
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.request.delStore(event['id']).subscribe((response: any) => {
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: `Item #${id} Deleted`, life: 3000 });
          this.getModels();
        }, (error: any) => {
          console.log(error);
          this.messageService.add({ severity: 'erro', summary: 'Error', detail: 'Not deleted', life: 3000 });
          this.getModels();
        })
      }
    });
  }
  onTextChange(event: any) {
    // for debug only, analyse event on each change on text editor, made with QUIll
    // console.log(event);
  }

}
