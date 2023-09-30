import "./System.scss";
import { useTranslation } from "react-i18next";
import Title from "../../components-basics/Title/Title";
import SystemList from "../../components/System/SystemList";

export default function Systems() {
  const { t } = useTranslation();
  return (
    <div className="system-container">
      <Title title={t("system.title")}></Title>
      <div>
        <SystemList />
      </div>
    </div>
  );
}
