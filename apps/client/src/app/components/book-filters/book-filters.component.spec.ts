import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookFiltersComponent } from './book-filters.component';

describe('BookFiltersComponent', () => {
  let component: BookFiltersComponent;
  let fixture: ComponentFixture<BookFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookFiltersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BookFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
