import { EMAIL_REGEX } from './constants';

export class ValidationUtils {
  static getMissingFields = (
    payload: unknown,
    requiredFields: string[]
  ): string[] => {
    const missingFields = [];

    requiredFields.forEach((field) => {
      const isFieldInBody = !!payload[field];
      if (!isFieldInBody) {
        missingFields.push(field);
      }
    });

    return missingFields;
  };

  static checkEmail = (email: string): boolean => {
    const isEmailValid = EMAIL_REGEX.test(String(email).toLowerCase());

    return isEmailValid;
  };
}
