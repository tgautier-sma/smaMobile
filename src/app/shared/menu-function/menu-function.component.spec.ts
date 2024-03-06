import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuFunctionComponent } from './menu-function.component';

describe('MenuFunctionComponent', () => {
  let component: MenuFunctionComponent;
  let fixture: ComponentFixture<MenuFunctionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuFunctionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MenuFunctionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
