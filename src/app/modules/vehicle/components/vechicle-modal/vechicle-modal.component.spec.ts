/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { VechicleModalComponent } from './vechicle-modal.component';

describe('VechicleModalComponent', () => {
  let component: VechicleModalComponent;
  let fixture: ComponentFixture<VechicleModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VechicleModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VechicleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
