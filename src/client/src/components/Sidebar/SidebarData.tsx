import { RxDashboard } from "react-icons/rx";
import { RiUserSettingsLine } from "react-icons/ri";
import { BsFillGearFill } from "react-icons/bs";
import {
  MdSpeakerNotes,
  MdStickyNote2,
  MdOutlineRestore,
} from "react-icons/md";

export const SidebarData = [
  {
    title: "home",
    path: "/",
    icon: <RxDashboard />,
  },
  {
    title: "users.users",
    path: "/users",
    icon: <RiUserSettingsLine />,
  },
  {
    title: "maintenance.title",
    path: "/logs",
    icon: <MdSpeakerNotes />,
    submenu: [
      {
        title: "maintenance.submenus.logs",
        path: "/logs",
        icon: <MdStickyNote2 />,
      },
      {
        title: "maintenance.submenus.backup",
        path: "/Backup",
        icon: <MdOutlineRestore />,
      },
    ],
  },
  {
    title: "System",
    path: "/system",
    icon: <BsFillGearFill />,
  },
];
