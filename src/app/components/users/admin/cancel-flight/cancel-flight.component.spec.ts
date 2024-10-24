import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelFlightComponent } from './cancel-flight.component';

describe('CancelFlightComponent', () => {
  let component: CancelFlightComponent;
  let fixture: ComponentFixture<CancelFlightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CancelFlightComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CancelFlightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
