import { useEffect, useMemo, useRef, useState } from "react";
import { Layout, Layouts, Responsive, WidthProvider } from "react-grid-layout";
import WidgetSelector, { WidgetProps, WidgetsProps } from "./Widget";
import { FaTimes } from "react-icons/fa";
import { DEFAULT_ROW_HEIGHT, calculateDefaultHeight } from "./DefaultLayouts";
import {
  selectForcedLoading,
  setForcedLoading,
} from "../../store/reducers/forcedLoadingSlice";
import { useAppDispatch, useAppSelector } from "../../store/storeTypedHooks";
import Loader from "../../components-basics/Loader/Loader";

type GridColumnsForBreakpoints = {
  [key: string]: number;
};

const DefaultGridColumnsForBreakpoints: GridColumnsForBreakpoints = {
  lg: 12,
  md: 10,
  sm: 6,
  xs: 4,
  xxs: 2,
};

export type DashboardProps = {
  layouts?: Layouts;
  widgets?: WidgetsProps;
};

function generateLayoutsWhithProperHeight(layouts: Layouts): Layouts {
  if (layouts["lg"].length > 1) return layouts;
  const soloDashboardLayouts: Layouts = { ...layouts };
  Object.keys(soloDashboardLayouts).forEach(breakpoint => {
    soloDashboardLayouts[breakpoint] = soloDashboardLayouts[breakpoint].map(
      layoutItem => {
        const defaultHeight = calculateDefaultHeight();
        switch (breakpoint) {
          case "lg":
            return { ...layoutItem, h: defaultHeight };
          case "md":
            return {
              ...layoutItem,
              h: Math.floor(defaultHeight * 0.85),
            };
          case "sm":
            return {
              ...layoutItem,
              h: Math.floor(defaultHeight * 0.7),
            };
          default:
            return {
              ...layoutItem,
              h: Math.floor(defaultHeight / 2),
            };
        }
      }
    );
  });
  return soloDashboardLayouts;
}

export function Dashboard(props: DashboardProps) {
  const layoutsSizeKeys = Object.keys(DefaultGridColumnsForBreakpoints);

  ////////////////////////////////////////////////////////////////
  // delay redering of the dashboard only the first load or if user reloads the page
  ////////////////////////////////////////////////////////////////
  const dispatch = useAppDispatch();
  const isForcedLoading = useAppSelector(selectForcedLoading);

  useEffect(() => {
    window.addEventListener("beforeunload", () => {
      dispatch(setForcedLoading(true));
    });

    if (!isForcedLoading) return;
    setTimeout(() => {
      dispatch(setForcedLoading(false));
    }, 350);

    return () => {
      window.removeEventListener("beforeunload", () => {
        console.log("remove beforeunload");
      });
    };
  }, []);

  ////////////////////////////////////////////////////////////////
  // Memoized
  ////////////////////////////////////////////////////////////////
  const ResponsiveGridLayout = useMemo(() => WidthProvider(Responsive), []);

  ////////////////////////////////////////////////////////////////
  // States
  ////////////////////////////////////////////////////////////////
  const [isStatic] = useState(true);

  const [layouts, setLayouts] = useState<Layouts>(() => {
    if (!props.layouts) throw new Error("Dashboard layouts is undefined");
    return generateLayoutsWhithProperHeight(props.layouts);
  });

  const [currentSize, setCurrentSize] = useState("lg"); // TODO_RS lg, md, sm, xs, xxs => default must depend on the screen size

  const [widgets, setWidgets] = useState<WidgetsProps>(() => {
    console.log(props.widgets);
    if (!props.widgets) throw new Error("Dashboard widgets is undefined");
    return Array.isArray(props.widgets) ? props.widgets : [props.widgets];
  });

  ////////////////////////////////////////////////////////////////
  // API
  ////////////////////////////////////////////////////////////////

  ////////////////////////////////////////////////////////////////
  // refs
  ////////////////////////////////////////////////////////////////
  const GridContainer = useRef<HTMLDivElement>(null);

  ////////////////////////////////////////////////////////////////
  // Effects
  ////////////////////////////////////////////////////////////////
  useEffect(() => {
    setLayouts(prev => {
      const layouts: Layouts = {};
      Object.keys(prev).forEach(layout => {
        layouts[layout] = prev[layout].map(item => {
          return { ...item, static: isStatic };
        });
      });
      return layouts;
    }); // Update the static property of all the layouts
  }, [isStatic]);

  useEffect(() => {
    console.log("layouts changed: ", layouts);
  }, [layouts]);

  useEffect(() => {
    console.log("props changed: ", props);
    setLayouts(generateLayoutsWhithProperHeight(props.layouts ?? {}));
  }, [props]);

  ////////////////////////////////////////////////////////////////
  // Functions
  ////////////////////////////////////////////////////////////////
  const layoutChanged = (currentLayout: Layout[], allLayouts: Layouts) => {
    console.log("currentLayout: ", currentLayout);
    console.log("allLayouts: ", allLayouts);
    setLayouts(allLayouts);
  };

  function findWidget(id: string, widgets: WidgetProps[]): WidgetProps {
    return Object.values(widgets).find(widget => widget.id == id) ?? { id: "" };
  }

  function deleteWidget(id: string) {
    setLayouts(prev => {
      const layouts: Layouts = {};
      Object.keys(prev).forEach(layout => {
        layouts[layout] = prev[layout].filter(item => item.i != id);
      });
      return layouts;
    });
    setWidgets(prev => {
      return prev.filter(widget => widget.id != id);
    });
  }

  return (
    <>
      <div className="dashboard-container">
        {(isForcedLoading && <Loader />) || (
          <>
            <div ref={GridContainer}>
              <ResponsiveGridLayout
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 540, xxs: 0 }}
                cols={DefaultGridColumnsForBreakpoints}
                rowHeight={DEFAULT_ROW_HEIGHT}
                layouts={layouts}
                onLayoutChange={layoutChanged}
                // isDroppable={!isStatic}
                onBreakpointChange={breakpoint => setCurrentSize(breakpoint)}
              >
                {/* To render the widgets themselves, we only need the list of items in the layouts,
                  no matter the size. Using the list of items for the first breakpoint arbitrarily seems
                  legit : the list is the same for every breakpoint, only the properties change. */}
                {layouts[layoutsSizeKeys[0]].map(item => {
                  return (
                    <div key={item.i} style={{ position: "relative" }}>
                      {/* inline style is the only way to override the react-grid-layout style */}
                      {!isStatic && (
                        <div
                          style={{
                            borderRadius: "50%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            position: "absolute",
                            top: 0,
                            right: 0,
                            width: "1.5rem",
                            height: "1.5rem",
                            background: "red",
                            color: "white",
                            cursor: "pointer",
                            transform: "translate(25%, -25%)",
                            zIndex: 100,
                          }}
                          onClick={() => deleteWidget(item.i)}
                        >
                          <FaTimes />
                        </div>
                      )}
                      <WidgetSelector
                        currentSize={currentSize}
                        {...findWidget(item.i, widgets)}
                      />
                    </div>
                  );
                })}
              </ResponsiveGridLayout>
            </div>
          </>
        )}
      </div>
    </>
  );
}
