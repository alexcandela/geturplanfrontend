import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentreplyComponent } from './commentreply.component';

describe('CommentreplyComponent', () => {
  let component: CommentreplyComponent;
  let fixture: ComponentFixture<CommentreplyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentreplyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommentreplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
