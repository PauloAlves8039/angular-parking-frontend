/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CustomerVehicleService } from './CustomerVehicle.service';

describe('Service: CustomerVehicle', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomerVehicleService]
    });
  });

  it('should ...', inject([CustomerVehicleService], (service: CustomerVehicleService) => {
    expect(service).toBeTruthy();
  }));
});
