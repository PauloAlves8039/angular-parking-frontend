/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { StayService } from './Stay.service';

describe('Service: Stay', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StayService]
    });
  });

  it('should ...', inject([StayService], (service: StayService) => {
    expect(service).toBeTruthy();
  }));
});
