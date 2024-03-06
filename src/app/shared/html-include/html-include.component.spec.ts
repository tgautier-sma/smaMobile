import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HtmlIncludeComponent } from './html-include.component';

describe('HtmlIncludeComponent', () => {
  let component: HtmlIncludeComponent;
  let fixture: ComponentFixture<HtmlIncludeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HtmlIncludeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HtmlIncludeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
