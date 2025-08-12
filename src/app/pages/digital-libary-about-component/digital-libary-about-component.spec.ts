import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalLibaryAboutComponent } from './digital-libary-about-component';

describe('DigitalLibaryAboutComponent', () => {
  let component: DigitalLibaryAboutComponent;
  let fixture: ComponentFixture<DigitalLibaryAboutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DigitalLibaryAboutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DigitalLibaryAboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
