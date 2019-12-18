import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckindialogComponent } from './checkindialog.component';

describe('CheckindialogComponent', () => {
  let component: CheckindialogComponent;
  let fixture: ComponentFixture<CheckindialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckindialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckindialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
