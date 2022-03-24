export class SelectedItem {
  public constructor(
    public  name: string,
    public qty: number,
    // tslint:disable-next-line:variable-name
    public sub_total: number,
    // tslint:disable-next-line:variable-name
    public unit_price: number,
    public  id?: number
  ) {
  }
}
