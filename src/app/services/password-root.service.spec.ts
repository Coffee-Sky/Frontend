import { TestBed } from '@angular/core/testing';

import { PasswordRootService } from './password-root.service';

describe('PasswordRootService', () => {
  let service: PasswordRootService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PasswordRootService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
