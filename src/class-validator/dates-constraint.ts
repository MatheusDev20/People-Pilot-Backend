import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { isDateValid } from 'src/helpers/dates';

@ValidatorConstraint({ async: false })
export class IsDateYYYYMMDDConstraint implements ValidatorConstraintInterface {
  validate(date: any) {
    if (typeof date !== 'string') {
      return false;
    }

    if (!isDateValid(date)) {
      return false;
    }

    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(date);
  }

  defaultMessage() {
    return 'Date format is not valid';
  }
}

export function IsDateYYYYMMDD(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsDateYYYYMMDDConstraint,
    });
  };
}
