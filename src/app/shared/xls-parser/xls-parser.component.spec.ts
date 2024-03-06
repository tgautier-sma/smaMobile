import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XlsParserComponent } from './xls-parser.component';

describe('XlsParserComponent', () => {
  let component: XlsParserComponent;
  let fixture: ComponentFixture<XlsParserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [XlsParserComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(XlsParserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
