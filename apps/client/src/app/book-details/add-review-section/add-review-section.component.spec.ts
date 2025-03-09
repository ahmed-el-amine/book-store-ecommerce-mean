import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddReviewSectionComponent } from './add-review-section.component';

describe('AddReviewSectionComponent', () => {
  let component: AddReviewSectionComponent;
  let fixture: ComponentFixture<AddReviewSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddReviewSectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddReviewSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
