/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { VehicleService } from './Vehicle.service';

describe('Service: Vehicle', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VehicleService]
    });
  });

  it('should ...', inject([VehicleService], (service: VehicleService) => {
    expect(service).toBeTruthy();
  }));
});
