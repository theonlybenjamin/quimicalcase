import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendPendingItemComponent } from './send-pending-item.component';

describe('SendPendingItemComponent', () => {
  let component: SendPendingItemComponent;
  let fixture: ComponentFixture<SendPendingItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendPendingItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SendPendingItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
