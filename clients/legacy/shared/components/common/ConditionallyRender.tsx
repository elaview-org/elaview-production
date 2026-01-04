import { JSX, ReactNode } from "react";

type RenderFunc = () => JSX.Element;

type TargetElement =
  | JSX.Element
  | JSX.Element[]
  | ReactNode
  | RenderFunc
  | null;

interface IConditionallyRenderProps {
  condition: boolean;
  show: TargetElement;
  elseShow?: TargetElement;
}

function ConditionallyRender({
  condition,
  show,
  elseShow,
}: IConditionallyRenderProps): JSX.Element | null {
  if (condition) {
    return show as JSX.Element;
  }
  if (!condition && elseShow) {
    return elseShow as JSX.Element;
  }
  return null;
}

export default ConditionallyRender;
