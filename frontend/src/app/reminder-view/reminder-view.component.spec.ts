import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReminderViewComponent } from './reminder-view.component';

describe('ReminderViewComponent', () => {
  let component: ReminderViewComponent;
  let fixture: ComponentFixture<ReminderViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReminderViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReminderViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
