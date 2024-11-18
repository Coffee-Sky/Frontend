import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstTimePasswordComponent } from './first-time-password.component';

describe('FirstTimePasswordComponent', () => {
  let component: FirstTimePasswordComponent;
  let fixture: ComponentFixture<FirstTimePasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FirstTimePasswordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FirstTimePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
