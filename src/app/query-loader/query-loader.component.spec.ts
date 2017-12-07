import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryLoaderComponent } from './query-loader.component';

describe('QueryLoaderComponent', () => {
  let component: QueryLoaderComponent;
  let fixture: ComponentFixture<QueryLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueryLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
