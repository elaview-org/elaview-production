export interface ActionState<T> {
  success: boolean;
  message: string;
  data: T;
}
