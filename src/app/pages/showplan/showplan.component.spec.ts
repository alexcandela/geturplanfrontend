import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowplanComponent } from './showplan.component';

describe('ShowplanComponent', () => {
  let component: ShowplanComponent;
  let fixture: ComponentFixture<ShowplanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowplanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowplanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
