import "./DefaultErrorPage.scss";
import { useTranslation } from "react-i18next";
import { IoIosWarning } from "react-icons/io";

export default function DefaultErrorPage() {
  const { t } = useTranslation();

  return (
    <div className="default-error-container">
      <h1>
        <IoIosWarning /> {t("error.default")}
      </h1>
    </div>
  );
}
