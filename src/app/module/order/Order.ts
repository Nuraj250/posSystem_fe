export class Order {
  public constructor(
    public totalAmount: number,
    public totalDiscount: number,
    public customer: CustomerForOrder,
    public items: Array<ItemForOrder>
  ) {
  }
}

export class CustomerForOrder {
  public constructor(
    public id: number
  ) {
  }
}

export class ItemForOrder {
  public constructor(
    public item: number | undefined,
    public qty: number,
    public sub_total: number,
    public unit_price: number,
  ) {
  }
}
