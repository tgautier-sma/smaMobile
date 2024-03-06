import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { TYPES, FieldDefinition, Enum } from "../classes/field"

@Component({
  selector: 'app-ref-input',
  templateUrl: './ref-input.component.html',
  styleUrls: ['./ref-input.component.scss']
})
export class RefInputComponent {
  @Input() field!: string
  @Output() fieldDef: EventEmitter<FieldDefinition> = new EventEmitter(); // event when the current item is selectd
  fieldContent: FieldDefinition = new FieldDefinition();
  fieldType: Array<Enum> = [];
  enumValue: string = "";

  constructor() { }
  ngOnInit() {
    // Init Enum 
    TYPES.forEach(element => {
      const e: Enum = { label: element, value: element };
      this.fieldType.push(e);
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (changes){
      console.log(changes);
      this.fieldContent.field=changes['field'].currentValue;
    }
  }
  saveData() {
    // Convert enum value
    if (this.enumValue !== "") {
      this.fieldContent.enum = '';
      const a = this.enumValue.split('\n');
      const v: { name: string; code: string; }[]=[]
      a.forEach(row => {
        const item = row.split(":");
        if (item[0] !== "") {
          v.push({ "name": item[0], "code": item[1] });
        }
      });
      this.fieldContent.enum=JSON.stringify(v);
      this.fieldDef.emit(this.fieldContent);
    }
  }
}
