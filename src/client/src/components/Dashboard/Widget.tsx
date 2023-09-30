import InfoThread from "../InfoThread/InfoThread";

export interface WidgetProps {
  id: string;
  type?: string;
  content?: string;
}

export type WidgetsProps = WidgetProps[];

export interface WidgetSelectorProps extends WidgetProps {
  currentSize: string;
}

export default function WidgetSelector(props: WidgetSelectorProps) {
  const infoThreadMode =
    props.currentSize === "xs" || props.currentSize === "xxs"
      ? "compact"
      : "wide";

  switch (props.type) {
    case "info-thread":
      return <InfoThread mode={infoThreadMode} />;

    default:
      throw new Error("unknown widget type");
  }
}
