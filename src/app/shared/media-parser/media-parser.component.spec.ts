import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaParserComponent } from './media-parser.component';

describe('MediaParserComponent', () => {
  let component: MediaParserComponent;
  let fixture: ComponentFixture<MediaParserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MediaParserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MediaParserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
