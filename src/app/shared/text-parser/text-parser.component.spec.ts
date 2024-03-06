import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextParserComponent } from './text-parser.component';

describe('TextParserComponent', () => {
  let component: TextParserComponent;
  let fixture: ComponentFixture<TextParserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextParserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TextParserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
