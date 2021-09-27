export class Utils {
  static isSet = (value: unknown): boolean => {
    const isValueIsNull = value === null;
    const isValueIsUndefined = value === undefined;

    return !(isValueIsNull || isValueIsUndefined);
  };
}
