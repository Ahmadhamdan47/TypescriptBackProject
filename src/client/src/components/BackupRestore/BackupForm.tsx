import * as Form from "@radix-ui/react-form";
import "./BackupForm.scss";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import ButtonBasic from "../../components-basics/Button/Button";
import { BiSave } from "react-icons/bi";
import { useBackupDatabaseMutation } from "../../api/backupRestoreApiSlice";

export const BackupForm = () => {
  const { t } = useTranslation();

  const [dbName, setDbName] = useState("XtVisionConfig_dev");
  const [backupName, setBackupName] = useState("");
  const [description, setDescription] = useState("");

  const [backupDatabaseMutation] = useBackupDatabaseMutation();

  const handleDatabaseChange = (event: { target: { value: string } }) => {
    setDbName(event.target.value);
  };

  const handleBackupNameChange = (event: { target: { value: string } }) => {
    setBackupName(event.target.value);
  };

  const handleDescriptionChange = (event: { target: { value: string } }) => {
    setDescription(event.target.value);
  };

  const handleSubmit = async () => {
    console.log(
      "Database:",
      dbName,
      "Backup Name:",
      backupName,
      "Description:",
      description
    );
    const body = {
      dbName: dbName,
      backupName: backupName,
      description: description,
    };
    try {
      await backupDatabaseMutation(body);
    } catch {
      console.log("err");
    }
  };

  return (
    <Form.Root onSubmit={handleSubmit} className="form-root-backup">
      <div>
        <Form.Field name="database" className="form-field-backup">
          <Form.Label>{t("backup.form.database")}</Form.Label>
          <select
            value={dbName}
            onChange={handleDatabaseChange}
            className="select-database"
          >
            <option value="XtVisionConfig_dev">XtVisionConfig_dev</option>
            <option value="XtVisionExploit_dev">XtVisionExploit_dev</option>
          </select>
        </Form.Field>
      </div>
      <div>
        <Form.Field name="backupName" className="form-field-backup">
          <Form.Label>{t("backup.form.name")}</Form.Label>
          <input
            className="input-form-backup"
            type="text"
            value={backupName}
            onChange={handleBackupNameChange}
          />
        </Form.Field>
      </div>
      <div>
        <Form.Field name="description" className="form-field-backup">
          <Form.Label>{t("backup.form.description")}</Form.Label>
          <input
            className="input-form-backup"
            type="text"
            value={description}
            onChange={handleDescriptionChange}
          />
        </Form.Field>
      </div>

      <Form.Submit>
        <ButtonBasic title="Save" buttonlogo={<BiSave />}></ButtonBasic>
      </Form.Submit>
    </Form.Root>
  );
};
