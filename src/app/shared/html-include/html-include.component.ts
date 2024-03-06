import { Component, Input, SimpleChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-html-include',
  standalone: true,
  imports: [],
  templateUrl: './html-include.component.html',
  styleUrl: './html-include.component.scss'
})
export class HtmlIncludeComponent {
  @Input() sourceUrl!: string;
  frameUrl!: any;
  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    // this.frameUrl = this.sanitizer.bypassSecurityTrustResourceUrl("https://www.example.com");
  }
  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    for (let propName in changes) {
      if (propName === "sourceUrl") {
        let chng = changes[propName];
        if (chng.currentValue.length >= 3) {
          this.frameUrl = this.sanitizer.bypassSecurityTrustResourceUrl(chng.currentValue);
        }
      }
    }
  }
}
