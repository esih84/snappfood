export enum ConflictMessages {
  Category = 'این دسته بندی از قبل وجود دارد',
  supplier = 'این توزیع کننده از قبل وجد دارد',
  nationalCode = 'کد ملی قبلا استفاده شده است',
  email = 'ایمیل قبلا استفاده شده است',
}

export enum PublicMessage {
  Created = 'با موفقیت ایجاد شد',
  Deleted = 'با موفقیت حذف شد',
  Updated = 'با موفقیت ویرایش شد',
  CreatedCategory = ' دسته بندی  با موفقیت ایجاد شد ',
  SendOtpSuccessfully = 'کد با موفقیت ارسال شد',
}

export enum NotFoundMessage {
  category = 'دسته بندی یافت نشد',
  menu = ' منو یافت نشد',
}
export enum BadRequestMessage {
  Document = 'لطفا اسناد را کامل وارد کنید',
}

export enum UnauthorizedMessage {
  NotFoundAccount = 'کاربر وجود ندارد',
  login = 'لطفا وارد حساب کاربری خود شوید',
}

export enum ForbiddenMessage {
  UnacceptedAccount = ' حساب شما تایید نشده است با پشتیبانب تماس بگیرید',
}
