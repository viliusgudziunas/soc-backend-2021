export type ValidationResponseStatusType = 'success' | 'fail';

export interface ValidationResponseModel {
  status: ValidationResponseStatusType;
  data: unknown;
}
