import { TestBed } from '@angular/core/testing';

import { MessageAppointmentService } from './message-appointment.service';

describe('MessageAppointmentService', () => {
  let service: MessageAppointmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessageAppointmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
