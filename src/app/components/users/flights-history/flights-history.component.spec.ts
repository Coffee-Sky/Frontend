import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightsHistoryComponent } from './flights-history.component';

describe('FlightsHistoryComponent', () => {
  let component: FlightsHistoryComponent;
  let fixture: ComponentFixture<FlightsHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlightsHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlightsHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
