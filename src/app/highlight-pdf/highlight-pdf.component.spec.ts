import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HighlightPdfComponent } from './highlight-pdf.component';

describe('HighlightPdfComponent', () => {
  let component: HighlightPdfComponent;
  let fixture: ComponentFixture<HighlightPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HighlightPdfComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HighlightPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
