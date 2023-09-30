import "./BackupRestore.scss";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import BackupRestoreList from "../../components/BackupRestore/BackupRestoreList";
import Title from "../../components-basics/Title/Title";

export default function BackupRestore() {
  const { t } = useTranslation();

  useEffect(() => {}, []);

  return (
    <div className="backup-container">
      <Title title={t("backup.title")}></Title>

      <div className="backup-list-container">
        <BackupRestoreList></BackupRestoreList>
      </div>
    </div>
  );
}
