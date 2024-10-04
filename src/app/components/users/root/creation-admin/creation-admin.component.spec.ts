import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationAdminComponent } from './creation-admin.component';

describe('CreationAdminComponent', () => {
  let component: CreationAdminComponent;
  let fixture: ComponentFixture<CreationAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreationAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreationAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
