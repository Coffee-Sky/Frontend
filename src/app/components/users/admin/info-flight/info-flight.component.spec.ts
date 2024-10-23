import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoFlightComponent } from './info-flight.component';

describe('InfoFlightComponent', () => {
  let component: InfoFlightComponent;
  let fixture: ComponentFixture<InfoFlightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoFlightComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoFlightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
