import { Link } from "react-router-dom";
import "./Dropdown.scss";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useTranslation } from "react-i18next";

type DropdownProps = {
  dropdownTrigger: JSX.Element;
  submenu: Array<{
    icon: JSX.Element;
    title: string;
    path: string;
    action?: () => void;
  }>;
};

const DropdownBasic = ({ dropdownTrigger, submenu }: DropdownProps) => {
  const { t } = useTranslation();

  return (
    <div className="dropdown">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>{dropdownTrigger}</DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content className="DropdownMenuContent" sideOffset={5}>
            {submenu.map(item => (
              <Link
                className="ignore-link-style"
                to={item.path}
                key={item.title}
                onClick={item.action}
              >
                <DropdownMenu.Item className="DropdownMenuItem">
                  {item.icon}
                  {t(item.title)}
                </DropdownMenu.Item>
              </Link>
            ))}
            <DropdownMenu.Separator className="DropdownMenuSeparator" />
            {/* <DropdownMenu.Arrow className="DropdownMenuArrow" /> */}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
};

export default DropdownBasic;
