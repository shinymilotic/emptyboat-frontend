import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTestDialogComponent } from './edit-test-dialog.component';

describe('EditTestDialogComponent', () => {
  let component: EditTestDialogComponent;
  let fixture: ComponentFixture<EditTestDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditTestDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditTestDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
