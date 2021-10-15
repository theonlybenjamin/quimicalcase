import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrlMakerComponent } from './url-maker.component';

describe('UrlMakerComponent', () => {
  let component: UrlMakerComponent;
  let fixture: ComponentFixture<UrlMakerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UrlMakerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UrlMakerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
