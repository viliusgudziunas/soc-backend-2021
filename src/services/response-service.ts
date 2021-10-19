type ResponseStatus = 'success' | 'fail';

interface ResponseBody {
  status: ResponseStatus;
  data: unknown;
}

export const ResponseService = {
  success: (data: unknown): ResponseBody => {
    const status: ResponseStatus = 'success';
    return { status, data };
  },

  missingFields: (fields: string[]): ResponseBody => {
    const status: ResponseStatus = 'fail';
    const data = { reason: 'Fields are missing', fields };

    return { status, data };
  },

  invalidEmail: (field = 'email'): ResponseBody => {
    const status: ResponseStatus = 'fail';
    const data = { reason: 'Email is not valid', fields: [field] };

    return { status, data };
  },

  emailInUse: (field = 'email'): ResponseBody => {
    const status: ResponseStatus = 'fail';
    const data = { reason: 'Email is already in use', fields: [field] };

    return { status, data };
  },

  passwordsDoNotMatch: (
    fields = ['password', 'confirmPassword']
  ): ResponseBody => {
    const status: ResponseStatus = 'fail';
    const data = { reason: 'Passwords do not match', fields };

    return { status, data };
  },

  incorrectLoginDetails: (fields = ['email', 'password']): ResponseBody => {
    const status: ResponseStatus = 'fail';
    const data = { reason: 'Incorrect login details', fields };

    return { status, data };
  },

  invalidTimeFormat: (field: string): ResponseBody => {
    const status: ResponseStatus = 'fail';
    const data = { reason: 'Invalid time format', fields: [field] };

    return { status, data };
  },

  invalidDateFormat: (field: string): ResponseBody => {
    const status: ResponseStatus = 'fail';
    const data = { reason: 'Invalid date format', fields: [field] };

    return { status, data };
  },

  dateNotInRange: (
    rangeStart: string,
    rangeEnd: string,
    field: string
  ): ResponseBody => {
    const status: ResponseStatus = 'fail';
    const data = {
      reason: `Date is not in range (${rangeStart} - ${rangeEnd})`,
      fields: [field],
    };

    return { status, data };
  },

  noAuth: (): ResponseBody => {
    const status: ResponseStatus = 'fail';
    const data = {
      reason: 'Missing authentication token',
      headers: ['Authorization'],
    };

    return { status, data };
  },

  invalidToken: (): ResponseBody => {
    const status: ResponseStatus = 'fail';
    const data = {
      reason: 'Invalid authentication token',
      headers: ['Authorization'],
    };

    return { status, data };
  },

  userNotFound: (param = 'userId'): ResponseBody => {
    const status: ResponseStatus = 'fail';
    const data = { reason: 'User not found', params: [param] };

    return { status, data };
  },
};
