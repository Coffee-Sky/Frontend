import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordRootComponent } from './password-root.component';

describe('PasswordRootComponent', () => {
  let component: PasswordRootComponent;
  let fixture: ComponentFixture<PasswordRootComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordRootComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PasswordRootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
