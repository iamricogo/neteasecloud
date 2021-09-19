import { debounce, throttle } from "lodash";
export const Debounce = (
  wait: number,
  options: any = {
    leading: true,
    trailing: false,
  }
) => (target: any, propertyKey: string | symbol, descriptor: any) => {
  descriptor.value = debounce(descriptor.value, wait, options);
  return descriptor;
};

export const Throttle = (
  wait: number,
  options: any = {
    leading: true,
    trailing: true,
  }
) => (target: any, propertyKey: string | symbol, descriptor: any) => {
  descriptor.value = throttle(descriptor.value, wait, options);
  return descriptor;
};
