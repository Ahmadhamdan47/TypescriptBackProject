import "./Topbar.scss";
import { useState } from "react";
import logo from "~images/castel-logo.svg";
import DropdownBasic from "../../components-basics/Dropdown/Dropdown";
import { FaSearch, FaEdit, FaSignOutAlt } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { MdOutlineNotificationsNone } from "react-icons/md";
import { IoNotificationsCircleSharp } from "react-icons/io5";
import { useLogoutMutation } from "../../api/homeApiSlice";
import { persistor } from "../../store/store";

export default function Topbar() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [processLogout] = useLogoutMutation();

  const manageLogout = async () => {
    console.log("now logging out");
    try {
      await processLogout().unwrap();
    } catch (logoutLegitError: any) {
      // logoutLegitError is a FetchBaseQueryError but I can't specify it in a catch clause
      if (!logoutLegitError.data || typeof logoutLegitError.data !== "string")
        throw new Error("No data in logout response");
      window.location.replace(logoutLegitError.data);
      // Reset user data
      persistor.purge();
    }
  };

  const actionProfile = [
    {
      icon: <FaEdit />,
      title: t("topbar.actionsProfile.edit"),
      path: "/editProfile",
    },
    {
      icon: <FaSignOutAlt />,
      title: t("topbar.actionsProfile.logout"),
      path: "#logout",
      action: () => manageLogout(),
    },
  ];

  const actionNotification = [
    {
      icon: <IoNotificationsCircleSharp />,
      title: "Notification 1",
      path: "#notification1",
    },
    {
      icon: <IoNotificationsCircleSharp />,
      title: "Notification 2",
      path: "#notification2",
    },
  ];

  const handleInputChange = (e: any) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = () => {
    //Implémenter la logique de recherche quand on l'aura déterminé
    console.log("Recherche", searchTerm);
  };

  return (
    <div className="top-bar-container">
      <img src={logo} alt="Logo" className="img-container" />
      <div className="topbar">
        <div className="research-bar-container">
          <input
            type="text"
            className="research-bar"
            value={searchTerm}
            onChange={handleInputChange}
            placeholder={t("topbar.searchBarPlaceholder") ?? undefined}
          ></input>
          <FaSearch onClick={handleSearch} className="logo-research"></FaSearch>
        </div>

        <div style={{ marginRight: "10px" }}>
          <DropdownBasic
            dropdownTrigger={
              <div className="icon-btn">
                <MdOutlineNotificationsNone />
              </div>
            }
            submenu={actionNotification}
          />
        </div>

        <DropdownBasic
          dropdownTrigger={<div className="icon-btn">CR</div>}
          submenu={actionProfile}
        />
      </div>
    </div>
  );
}
