import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { SidebarData } from "./SidebarData";
import { FiMoon, FiSun } from "react-icons/fi";
import { FaBars } from "react-icons/fa";
import { useState } from "react";
import { setForcedLoading } from "../../store/reducers/forcedLoadingSlice";
import { selectTheme, toggleTheme } from "../../store/reducers/themeSlice";
import "~styles/fade-animation.css";
import { useAppDispatch, useAppSelector } from "../../store/storeTypedHooks";
import {
  FADE_IN_OUT_ANIMATION_DURATION,
  FadeProps,
} from "../../styles/fadeAnimationProps";
import { useTranslation } from "react-i18next";
import DropdownBasic from "../../components-basics/Dropdown/Dropdown";

export default function Sidebar() {
  const { t } = useTranslation();

  const isThemeDark = useAppSelector(selectTheme);
  const dispatch = useAppDispatch();

  const [fade, setFade] = useState<FadeProps>("fade-in");

  const animateIconChange = () => {
    setFade("fade-out");
    setTimeout(() => {
      dispatch(toggleTheme());
      setFade("fade-in");
    }, FADE_IN_OUT_ANIMATION_DURATION);
  };

  const animateDashboardFadeInOut = () => {
    document.querySelector(".dashboard-container")?.classList.add("fade-out");
    setTimeout(() => {
      dispatch(setForcedLoading(true));
    }, 250);
    setTimeout(() => {
      dispatch(setForcedLoading(false));
      document
        .querySelector(".dashboard-container")
        ?.classList.remove("fade-out");
    }, 350);
  };

  const toggleSidebar = () => {
    animateDashboardFadeInOut();

    const sidebar = document.querySelector(".sidebar");
    sidebar?.classList.toggle("show-sidebar");

    const header = document.querySelector(".header");
    header?.classList.toggle("body-padding");

    const root = document.querySelector(".root");
    root?.classList.toggle("body-padding");
  };

  return (
    <>
      <div className="sidebar">
        <Nav>
          <div>
            <div onClick={toggleSidebar} className="sidebar-icon">
              <FaBars />
            </div>
            {SidebarData.map(item => {
              return (
                <div key={item.title}>
                  <Nav.Link key={item.title} to={item.path} as={NavLink}>
                    {item.submenu ? (
                      <DropdownBasic
                        dropdownTrigger={
                          <div className={"dropdown-btn"}>
                            <span className="fs-4">{item.icon}</span>
                            <span className="ms-4">{t(item.title)}</span>
                          </div>
                        }
                        submenu={item.submenu}
                      ></DropdownBasic>
                    ) : (
                      <div>
                        <span className="fs-4">{item.icon}</span>
                        <span className="ms-4">{t(item.title)}</span>
                      </div>
                    )}
                  </Nav.Link>
                </div>
              );
            })}
          </div>
          <div>
            <div
              onClick={animateIconChange}
              className={fade + " fs-4 sidebar-icon mb-3"}
            >
              {isThemeDark ? <FiSun /> : <FiMoon />}
            </div>
          </div>
        </Nav>
      </div>
    </>
  );
}
