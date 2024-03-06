import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestSelectComponent } from './request-select.component';

describe('RequestSelectComponent', () => {
  let component: RequestSelectComponent;
  let fixture: ComponentFixture<RequestSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestSelectComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RequestSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
