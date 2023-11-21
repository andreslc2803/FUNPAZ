import { TestBed } from '@angular/core/testing';

import { ClinicHistoryService } from './clinic-history.service';

describe('ClinicHistoryService', () => {
  let service: ClinicHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClinicHistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
