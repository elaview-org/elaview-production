import type { JSX, ReactNode } from "react";

interface IConditionalRenderProps {
  condition: boolean;
  show: ReactNode;
  elseShow?: ReactNode;
}

function ConditionalRender({
  condition,
  show,
  elseShow,
}: IConditionalRenderProps): JSX.Element | null {
  if (condition) {
    return show as JSX.Element;
  }
  if (!condition && elseShow) {
    return elseShow as JSX.Element;
  }
  return null;
}

export default ConditionalRender;
