import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDachboard } from './order-dachboard';

describe('OrderDachboard', () => {
  let component: OrderDachboard;
  let fixture: ComponentFixture<OrderDachboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderDachboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderDachboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
