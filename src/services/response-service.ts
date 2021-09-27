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
};
