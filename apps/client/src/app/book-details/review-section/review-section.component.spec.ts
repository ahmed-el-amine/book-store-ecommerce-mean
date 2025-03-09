import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReviewSectionComponent } from './review-section.component';

describe('ReviewSectionComponent', () => {
  let component: ReviewSectionComponent;
  let fixture: ComponentFixture<ReviewSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewSectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReviewSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
