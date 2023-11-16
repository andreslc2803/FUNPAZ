import { TestBed } from '@angular/core/testing';

import { MessagePqrsService } from './message-pqrs.service';

describe('MessagePqrsService', () => {
  let service: MessagePqrsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessagePqrsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
