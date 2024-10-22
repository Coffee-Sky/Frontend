import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationFlightComponent } from './creation-flight.component';

describe('CreationFlightComponent', () => {
  let component: CreationFlightComponent;
  let fixture: ComponentFixture<CreationFlightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreationFlightComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreationFlightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
