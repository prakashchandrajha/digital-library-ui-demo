import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicationCrudComponent } from './publication-crud-component';

describe('PublicationCrudComponent', () => {
  let component: PublicationCrudComponent;
  let fixture: ComponentFixture<PublicationCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicationCrudComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicationCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
