import "./Logs.scss";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import LogsList from "../../components/Log/LogsList";
import Title from "../../components-basics/Title/Title";

export interface Log {
  name: string;
  size: number;
  creationDate: string;
  body: string;
}

export type Logs = Log[];

export default function Logs() {
  const { t } = useTranslation();

  useEffect(() => {}, []);

  return (
    <div className="logs-container">
      <Title title={t("logs.title")}></Title>

      <div className="logs-list-container">
        <LogsList></LogsList>
      </div>
    </div>
  );
}
