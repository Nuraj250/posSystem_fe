export class Item {
  public constructor(
    public  name: string,
    public qty: number,
    // tslint:disable-next-line:variable-name
    public unit_price: number,
    public  id?: number
  ) {
  }
}
