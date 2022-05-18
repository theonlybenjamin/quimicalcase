import { TestBed } from '@angular/core/testing';

import { EnviosDocService } from './envios-doc.service';

describe('EnviosDocService', () => {
  let service: EnviosDocService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnviosDocService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
