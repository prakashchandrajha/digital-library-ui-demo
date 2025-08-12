import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashboardContent } from './admin-dashboard-content';

describe('AdminDashboardContent', () => {
  let component: AdminDashboardContent;
  let fixture: ComponentFixture<AdminDashboardContent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDashboardContent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDashboardContent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
