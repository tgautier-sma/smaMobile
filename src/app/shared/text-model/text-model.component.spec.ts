import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextModelComponent } from './text-model.component';

describe('TextModelComponent', () => {
  let component: TextModelComponent;
  let fixture: ComponentFixture<TextModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TextModelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
