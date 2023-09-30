import "./BackupImport.scss";
import { useTranslation } from "react-i18next";
import { useUploadBackupFileMutation } from "../../api/backupRestoreApiSlice";
import * as Form from "@radix-ui/react-form";
import { useState } from "react";
import ButtonBasic from "../../components-basics/Button/Button";
import { BiImport } from "react-icons/bi";

export const BackupImport = () => {
  const { t } = useTranslation();

  const [selectedFile, setSelectedFile] = useState();
  const [selectedFileName, setSelectedFileName] = useState("");

  //API POST : upload a backup file : /databases/upload
  const [uploadBackupFile] = useUploadBackupFileMutation();

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    console.log(file);
    setSelectedFileName(file.name);
    setSelectedFile(file);
  };

  const handleUpload = () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);
      uploadBackupFile(formData);
    } else {
      console.log("pas de fichier selectionné");
    }
  };

  return (
    <Form.Root onSubmit={handleUpload}>
      <div className="import-container">
        <label className="custom-file-upload">
          {t("backup.import.title")}
          <input
            type="file"
            onChange={handleFileChange}
            className="input-import-container"
            accept=".backup"
          />
        </label>
        <div>{selectedFileName ? selectedFileName : ""}</div>
        {selectedFileName ? (
          <Form.Submit>
            <ButtonBasic
              title={t("backup.import.upload")}
              onClick={() => console.log("upload")}
              buttonlogo={<BiImport />}
            ></ButtonBasic>
          </Form.Submit>
        ) : (
          ""
        )}
      </div>
    </Form.Root>
  );
};
