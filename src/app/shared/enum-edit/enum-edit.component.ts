import { Component, Input, SimpleChanges, ViewChild } from '@angular/core';
import { Enum } from '../classes/field';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-enum-edit',
  templateUrl: './enum-edit.component.html',
  styleUrls: ['./enum-edit.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class EnumEditComponent {
  @Input() data: string = "";
  items: Array<Enum> = [];
  item!: Enum;
  selectedItems!: Enum[] | null;
  submitted: boolean = false;
  itemDialog:boolean = false;
  countFilter: any;

  @ViewChild('dtEnum') dtEnum!: Table;                        // Table contain data to update

  constructor(private messageService: MessageService, private confirmationService: ConfirmationService) {}

    ngOnInit() {}
    ngOnChanges(changes: SimpleChanges): void {
      //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
      //Add '${implements OnChanges}' to the class.
      if (changes['data'] && changes['data'].currentValue) {
        this.items = JSON.parse(changes['data'].currentValue);
        console.log(this.items);
      }
    }

    openNew() {
        this.item = {label:"",value:""};
        this.items.push(this.item);
        this.submitted = false;
        this.itemDialog = false;
    }
    filterData(event: any) {
      this.dtEnum.filterGlobal(event.target.value, 'contains');
      setTimeout(() => {
        this.countFilter = this.dtEnum.filteredValue ? this.dtEnum.filteredValue.length : 0;
      }, 500);
    }

    deleteSelectedItems() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected items?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.items = this.items.filter((val) => !this.selectedItems?.includes(val));
                this.selectedItems = null;
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Items Deleted', life: 3000 });
            }
        });
    }

    editItem(item: Enum) {
        this.item = { ...item };
        this.itemDialog = true;
    }

    deleteItem(item: Enum) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + item.label + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.items = this.items.filter((val) => val.label !== item.label);
                this.item = {label:"",value:""};
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'item Deleted', life: 3000 });
            }
        });
    }

    hideDialog() {
        this.itemDialog = false;
        this.submitted = false;
    }

    saveItem() {
        this.submitted = true;
        if (this.item.label?.trim()) {
            if (this.item.value) {
                this.items[this.findIndexById(this.item.label)] = this.item;
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'item Updated', life: 3000 });
            } else {
                this.items.push(this.item);
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'item Created', life: 3000 });
            }

            this.items = [...this.items];
            this.itemDialog = false;
            this.item = {label:"",value:""};
        }
    }

    findIndexById(label: string): number {
        let index = -1;
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].label === label) {
                index = i;
                break;
            }
        }
        return index;
    }

    createId(): string {
        let id = '';
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (var i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }
}


