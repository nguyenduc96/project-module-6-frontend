import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteStatusComponent } from './delete-status.component';

describe('DeleteStatusComponent', () => {
  let component: DeleteStatusComponent;
  let fixture: ComponentFixture<DeleteStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
