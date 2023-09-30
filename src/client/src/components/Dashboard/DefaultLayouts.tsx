import { Layouts } from "react-grid-layout";

export const DEFAULT_ROW_HEIGHT = 30;

export const calculateDefaultHeight = () => {
  const rootH = window.innerHeight - 200;
  return Math.floor(rootH / (10 + DEFAULT_ROW_HEIGHT));
};

// Default layouts = message widget
export const DefaultLayouts: Layouts = {
  lg: [{ i: "1", x: 0, y: 0, w: 12, h: 24, minW: 6, minH: 9 }],
  md: [{ i: "1", x: 0, y: 0, w: 10, h: 24, minW: 6, minH: 9 }],
  sm: [{ i: "1", x: 0, y: 0, w: 6, h: 24, minW: 6, minH: 9 }],
  xs: [{ i: "1", x: 0, y: 0, w: 4, h: 24, minW: 2, minH: 9 }],
  xxs: [{ i: "1", x: 0, y: 0, w: 2, h: 15, minW: 2, minH: 9 }],
};

type WidgetLayouts = {
  [key: string]: {
    x: number;
    y: number;
    w: number;
    h: number;
    minW?: number;
    minH?: number;
  };
};

export const BlankWidgetLayouts: WidgetLayouts = {
  lg: { x: 0, y: 0, w: 4, h: 12 },
  md: { x: 0, y: 0, w: 3, h: 7 },
  sm: { x: 0, y: 0, w: 2, h: 5 },
  xs: { x: 0, y: 0, w: 1, h: 4 },
  xxs: { x: 0, y: 0, w: 1, h: 3 },
};

export const ImageWidgetLayouts: WidgetLayouts = {
  lg: { x: 0, y: 0, w: 4, h: 15, minW: 3, minH: 12 },
  md: { x: 0, y: 0, w: 4, h: 15, minW: 3, minH: 12 },
  sm: { x: 0, y: 0, w: 3, h: 12, minW: 2, minH: 10 },
  xs: { x: 0, y: 0, w: 3, h: 12, minW: 2, minH: 10 },
  xxs: { x: 0, y: 0, w: 2, h: 10, minW: 2, minH: 10 },
};

export const SynopticWidgetLayouts: WidgetLayouts = {
  lg: { x: 0, y: 0, w: 4, h: 15, minW: 3, minH: 12 },
  md: { x: 0, y: 0, w: 4, h: 15, minW: 3, minH: 12 },
  sm: { x: 0, y: 0, w: 3, h: 12, minW: 2, minH: 10 },
  xs: { x: 0, y: 0, w: 3, h: 12, minW: 2, minH: 10 },
  xxs: { x: 0, y: 0, w: 2, h: 10, minW: 2, minH: 10 },
};

export const MessagingWidgetLayouts: WidgetLayouts = {
  lg: { x: 0, y: 0, w: 12, h: 9, minW: 6, minH: 9 },
  md: { x: 0, y: 0, w: 10, h: 9, minW: 6, minH: 9 },
  sm: { x: 0, y: 0, w: 6, h: 9, minW: 6, minH: 9 },
  xs: { x: 0, y: 0, w: 4, h: 9, minW: 2, minH: 9 },
  xxs: { x: 0, y: 0, w: 2, h: 15, minW: 2, minH: 9 },
};
