import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackidComponent } from './trackid.component';

describe('TrackidComponent', () => {
  let component: TrackidComponent;
  let fixture: ComponentFixture<TrackidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrackidComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
