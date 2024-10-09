import { TestBed } from '@angular/core/testing';

import { DeleteAdminService } from './delete-admin.service';

describe('DeleteAdminService', () => {
  let service: DeleteAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeleteAdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
