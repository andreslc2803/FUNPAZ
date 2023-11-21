import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicHistoryComponent } from './clinic-history.component';

describe('ClinicHistoryComponent', () => {
  let component: ClinicHistoryComponent;
  let fixture: ComponentFixture<ClinicHistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClinicHistoryComponent]
    });
    fixture = TestBed.createComponent(ClinicHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
