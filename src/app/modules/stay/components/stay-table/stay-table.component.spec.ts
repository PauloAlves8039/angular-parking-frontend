/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { StayTableComponent } from './stay-table.component';

describe('StayTableComponent', () => {
  let component: StayTableComponent;
  let fixture: ComponentFixture<StayTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StayTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StayTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
