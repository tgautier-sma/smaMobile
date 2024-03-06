import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnumEditComponent } from './enum-edit.component';

describe('EnumEditComponent', () => {
  let component: EnumEditComponent;
  let fixture: ComponentFixture<EnumEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EnumEditComponent]
    });
    fixture = TestBed.createComponent(EnumEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
