export enum ConflictMessages {
  Category = 'این دسته بندی از قبل وجود دارد',
  supplier = 'این توزیع کننده از قبل وجد دارد',
  nationalCode = 'کد ملی قبلا استفاده شده است',
  email = 'ایمیل قبلا استفاده شده است',
  discount = 'این کد تخفیف از قبل وجود دارد',
}

export enum PublicMessage {
  Created = 'با موفقیت ایجاد شد',
  Deleted = 'با موفقیت حذف شد',
  Updated = 'با موفقیت ویرایش شد',
  CreatedCategory = ' دسته بندی  با موفقیت ایجاد شد ',
  SendOtpSuccessfully = 'کد با موفقیت ارسال شد',
  AddToBasket = 'با موفقیت به سبد خرید اضافه شد',
  RemoveFromBasket = 'آیتم مورد نظر حذف شد',
  PaymentSuccessfully = 'پرداخت با موفقیت انجام شد',
}

export enum NotFoundMessage {
  category = 'دسته بندی یافت نشد',
  menu = ' منو یافت نشد',
  food = ' غذا یافت نشد',
  discount = ' کد تخفیف یافت نشد',
  foodInBasket = 'آیتم مورد نظر در سبد خرید وجود ندارد',
  Address = 'آدرس یافت نشد',
  Order = 'سفارش یافت نشد',
}
export enum BadRequestMessage {
  Document = 'لطفا اسناد را کامل وارد کنید',
  discount = 'شما باید یکی از فیلدهای قیمت یا درصد را وارد کنید',
  BasketDiscount = 'شما نمیتوانید از این کد تخفیف روی این سبد خرید استفاده کنید',
  SeveralDiscount = 'شما نمیتوانید چندبار از کد تخفیف رستوران استفاده کنید',
  ZarinnpalConnection = 'ارتباط با زرین پال برقرار نشد',
  OrderFoodList = 'لیست غذا خالی است',
  PaymentFailed = ' پرداخت انجام نشد',
}

export enum UnauthorizedMessage {
  NotFoundAccount = 'کاربر وجود ندارد',
  login = 'لطفا وارد حساب کاربری خود شوید',
}

export enum ForbiddenMessage {
  UnacceptedAccount = ' حساب شما تایید نشده است با پشتیبانب تماس بگیرید',
}
