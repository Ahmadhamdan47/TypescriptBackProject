import "./Home.scss";
import { useTranslation } from "react-i18next";
import { Dashboard } from "../../components/Dashboard/Dashboard";
import { useGetAllDashboardsQuery } from "../../api/dashboardsApiSlice";
import { Layouts } from "react-grid-layout";
import { useEffect, useLayoutEffect, useState } from "react";
import { WidgetsProps } from "../../components/Dashboard/Widget";
import { useGetUserDataMutation } from "../../api/homeApiSlice";
import {
  selectCurrentUser,
  setCurrentUser,
} from "../../store/reducers/currentUserSlice";
import { useAppDispatch, useAppSelector } from "../../store/storeTypedHooks";
import Loader from "../../components-basics/Loader/Loader";
import DropdownBasic from "../../components-basics/Dropdown/Dropdown";

export default function Home() {
  const { t, i18n } = useTranslation();
  const [getUserData] = useGetUserDataMutation();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);

  const [skip, setSkip] = useState<boolean>(true);
  const urlCode = new URLSearchParams(window.location.search).get("code");

  //////////////////////////////////////////////////////////////
  // Specific case : user is not logged in / just logged in
  //////////////////////////////////////////////////////////////
  useLayoutEffect(() => {
    if (urlCode) {
      (async () => {
        console.log("code: ", urlCode);
        const userData = await getUserData(urlCode).unwrap();
        dispatch(setCurrentUser(userData));
      })();
    } else {
      console.log("no code");
    }
  }, []);

  useLayoutEffect(() => {
    console.log("currentUser changed", currentUser);
    setSkip(
      currentUser.access_token === undefined ||
        (currentUser.access_token === "" && urlCode !== null)
    ); // dashboard query get delayed while user infos are not set or there's a code in the url
    if (
      currentUser.access_token !== undefined &&
      currentUser.access_token !== ""
    ) {
      i18n.changeLanguage(currentUser.language);
      if (window.location.search) {
        window.location.href = window.location.origin;
      }
    }
  }, [currentUser]);

  //////////////////////////////////////////////////////////////
  // Normal dashboard loading
  //////////////////////////////////////////////////////////////
  const {
    data: dashboards,
    isLoading,
    isError,
    error,
  } = useGetAllDashboardsQuery(undefined, { skip: skip });
  const [currentLayouts, setCurrentLayouts] = useState<Layouts | undefined>(
    undefined
  );

  const [currentWidgets, setCurrentWidgets] = useState<
    WidgetsProps | undefined
  >(undefined);

  const readyToRenderDashboard =
    dashboards !== undefined &&
    dashboards.length > 0 &&
    currentLayouts !== undefined &&
    currentWidgets !== undefined;

  useEffect(() => {
    if (
      dashboards !== undefined &&
      dashboards.length > 0 &&
      currentLayouts === undefined
    ) {
      setCurrentLayouts(JSON.parse(dashboards[0].layout));
      setCurrentWidgets(JSON.parse(dashboards[0].widgets));
    }
  }, [dashboards]);

  useEffect(() => {
    if (isError) throw error; // Error is handled by the ErrorBoundary component
  }, [error]);

  return (
    <>
      {((skip || isLoading) && <Loader />) ||
        (readyToRenderDashboard && (
          <>
            <div className="home-dropdown-container">
              <DropdownBasic
                dropdownTrigger={
                  <div className="home-dropdown-trigger">
                    {t("dashboard.dropdownTitle")}
                  </div>
                }
                submenu={dashboards.map(dashboard => {
                  return {
                    title: dashboard.name,
                    icon: <></>,
                    path: "#",
                    action: () => {
                      setCurrentLayouts(JSON.parse(dashboard.layout));
                      setCurrentWidgets(JSON.parse(dashboard.widgets));
                    },
                  };
                })}
              />
            </div>
            <Dashboard layouts={currentLayouts} widgets={currentWidgets} />
          </>
        ))}
    </>
  );
}
