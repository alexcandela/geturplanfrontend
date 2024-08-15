import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicarPlanComponent } from './publicar-plan.component';

describe('PublicarPlanComponent', () => {
  let component: PublicarPlanComponent;
  let fixture: ComponentFixture<PublicarPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicarPlanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicarPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
