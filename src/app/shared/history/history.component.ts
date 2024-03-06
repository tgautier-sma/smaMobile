import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { LocalStorageService } from '../../services/local-storage.service';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TableColDef, TableViewComponent } from '../table-view/table-view.component';
import { PanelModule } from 'primeng/panel';
import { Menu, MenuModule } from 'primeng/menu';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, FormsModule,
    ToastModule, TableModule, TooltipModule, InputSwitchModule, PanelModule, MenuModule, SelectButtonModule,
    ConfirmDialogModule,
    TableViewComponent
  ],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
  providers: [MessageService, ConfirmationService, DynamicDialogRef, DynamicDialogConfig]
})
export class HistoryComponent implements OnInit {
  data!: any;
  dataKeys!: any;
  requests!: any;
  selectedHistory = []
  selectedKeys = []
  editedHistory: any;
  cols!: any[];
  colsKeys!: any[];
  exportColumns!: any[];
  editVisible = false;
  stateOptions: any[] = [{ label: 'Historique', value: false }, { label: 'Stockage local', value: true }];
  displayAll = false;
  tsRefresh!: Date;
  itemsRequest!: MenuItem[];
  itemsKeys!: MenuItem[];
  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private localservice: LocalStorageService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.itemsRequest = [
      { label: 'Refresh', icon: 'pi pi-refresh', command: () => this.getData() },
      { label: 'Delete all', icon: 'pi pi-times', command: () => this.clearAllRequests(true) }
    ];
    this.itemsKeys = [
      { label: 'Refresh', icon: 'pi pi-refresh', command: () => this.getData() },
      { label: 'Delete all', icon: 'pi pi-times', command: () => this.clearAll(true) }
    ];
    this.getData();
    this.cols = [
      { code: 'ts', label: 'Ts', type: 'text' },
      { code: 'request', label: 'Requête', type: 'text', link: false, linkField: '', linkUrl: '' },
      { code: 'method', label: 'Methode', type: 'text', link: false, linkField: '', linkUrl: '' },
      { code: 'size', label: 'Taille (o)', type: 'text', link: false, linkField: '', linkUrl: '' },
      { code: 'status', label: 'Status', type: 'text', link: false, linkField: '', linkUrl: '' }
    ];
    this.colsKeys = [
      { code: 'key', label: 'Clé', type: 'text' },
      { code: 'value', label: 'Valeur', type: 'text', link: false, linkField: '', linkUrl: '' }
    ];
  }
  getData() {
    this.data = this.localservice.getAll();
    this.dataKeys = []
    this.data.forEach((element:any) => {
      for (let key of Object.keys(element)) {
        this.dataKeys.push({ key: key, value: element[key] });
      }  
    });
    this.requests = this.localservice.getJsonItem('requests');
    this.tsRefresh = new Date();
    // console.log(this.data);
    // console.log(this.requests);
  }
  getValue(value: any) {
    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2)
    } else {
      return value
    }
  }
  setSelected(event: any) {
    console.log('Selected items', event);
    this.selectedHistory = event;
  }
  setSelectedKey(event: any) {
    console.log('Selected items', event);
    this.selectedKeys = event;
  }
  selectedEdit() {
    console.log("Edit selected", this.selectedHistory);
    if (this.selectedHistory.length == 1) {
      this.editedHistory = this.selectedHistory[0];
      this.editedHistory.text = JSON.stringify(this.editedHistory.data, null, 2);
      this.editVisible = true;
      console.log("Data to edit", this.editedHistory);
    }
  }
  clearSelectedRequests(event: any) {
    // this.localservice.removeItem('requests');
    this.selectedHistory.forEach((elt: any) => {
      let num = this.requests.findIndex((item: any) => { return item === elt; });
      console.log("Delete index",num);
      if (num >= 0) {
        this.requests.splice(num, 1);
      }
    });
    console.log(this.requests);
    this.localservice.setItem('requests', JSON.stringify(this.requests));
    this.getData();
  }
  clearAllRequests(event: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete all requests history ?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.localservice.removeItem('requests');
        this.getData();
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Request history cleared.', life: 3000 });
      }
    });

  }
  clearKeySelected(event: any) {
    // this.localservice.removeItem('requests');
    this.selectedKeys.forEach((element:any) => {
      this.localservice.removeItem(element.key)
    });
    this.getData();
  }
  clearAll(event: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete all local storage ? If yes, you must login again.',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.localservice.clear();
        this.getData();
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Local storage cleared.', life: 3000 });
      }
    });
  }
}
