export type FoodItemInBasket = {
  name: string;
  foodId: number;
  description?: string;
  count: number;
  image?: string;
  price: number;
  total_amount: number;
  discount_amount: number;
  payment_amount: number;
  discountCode?: string;
  supplierId: number;
  supplierName?: string;
  //TODO add supplier image
};

export type BasketType = {
  total_amount: number;
  total_discount_amount: number;
  payment_amount: number;
  foodList: FoodItemInBasket[];
  generalDiscountDetail: any;
};
