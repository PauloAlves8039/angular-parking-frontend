/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CheckZipCodeService } from './CheckZipCode.service';

describe('Service: CheckZipCode', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CheckZipCodeService]
    });
  });

  it('should ...', inject([CheckZipCodeService], (service: CheckZipCodeService) => {
    expect(service).toBeTruthy();
  }));
});
