import { ReactNode } from "react";

type Props<T> = {
  data: T[];
  placeholder: ReactNode;
  children?: ReactNode;
};

export default function MaybePlaceholder<T>({
  data,
  placeholder,
  children,
}: Props<T>) {
  return data && data.length > 0 ? children : placeholder;
}
