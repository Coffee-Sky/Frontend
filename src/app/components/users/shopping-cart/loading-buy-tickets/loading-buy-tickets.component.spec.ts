import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingBuyTicketsComponent } from './loading-buy-tickets.component';

describe('LoadingBuyTicketsComponent', () => {
  let component: LoadingBuyTicketsComponent;
  let fixture: ComponentFixture<LoadingBuyTicketsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingBuyTicketsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadingBuyTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
