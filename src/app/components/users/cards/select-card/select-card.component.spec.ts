import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectCardComponent } from './select-card.component';

describe('SelectCardComponent', () => {
  let component: SelectCardComponent;
  let fixture: ComponentFixture<SelectCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
