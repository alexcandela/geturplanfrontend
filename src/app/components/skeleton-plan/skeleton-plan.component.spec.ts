import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkeletonPlanComponent } from './skeleton-plan.component';

describe('SkeletonPlanComponent', () => {
  let component: SkeletonPlanComponent;
  let fixture: ComponentFixture<SkeletonPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkeletonPlanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkeletonPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
