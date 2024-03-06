import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaNasaComponent } from './media-nasa.component';

describe('MediaNasaComponent', () => {
  let component: MediaNasaComponent;
  let fixture: ComponentFixture<MediaNasaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MediaNasaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MediaNasaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
