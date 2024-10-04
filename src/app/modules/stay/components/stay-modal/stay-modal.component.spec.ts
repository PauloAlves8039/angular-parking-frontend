/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { StayModalComponent } from './stay-modal.component';

describe('StayModalComponent', () => {
  let component: StayModalComponent;
  let fixture: ComponentFixture<StayModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StayModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StayModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
