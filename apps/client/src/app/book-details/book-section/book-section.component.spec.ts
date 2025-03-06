import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookSectionComponent } from './book-section.component';

describe('BookSectionComponent', () => {
  let component: BookSectionComponent;
  let fixture: ComponentFixture<BookSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookSectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BookSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
