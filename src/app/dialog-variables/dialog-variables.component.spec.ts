import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogVariablesComponent } from './dialog-variables.component';

describe('DialogVariablesComponent', () => {
  let component: DialogVariablesComponent;
  let fixture: ComponentFixture<DialogVariablesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogVariablesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogVariablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
