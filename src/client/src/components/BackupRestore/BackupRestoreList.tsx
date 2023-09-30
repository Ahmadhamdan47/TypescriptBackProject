import "./BackupRestoreList.scss";
import { useEffect, useState } from "react";
import {
  Backup,
  useGetAllBackupQuery,
  useRestoreDatabaseMutation,
  useDeleteBackupMutation,
  useDownloadAllBackupFilesQuery,
  useDownloadSelectedBackupFilesQuery,
} from "../../api/backupRestoreApiSlice";
import Loader from "../../components-basics/Loader/Loader";
import ButtonBasic from "../../components-basics/Button/Button";
import CardBasic from "../../components-basics/Card/Card";
import AlertDialogBasic from "../../components-basics/Alert/Alert";
import { BiImport, BiSave, BiTimeFive } from "react-icons/bi";
import iconPlay from "~images/icon/icone play.svg";
import iconDelete from "~images/icon/icone supprimer.svg";
import iconDownload from "~images/icon/icone download.svg";
// import iconImport from "~images/icon/icone import.svg";
// import iconSave from "~images/icon/icone save.svg";
// import iconTime from "~images/icon/icone time.svg";
import DialogBasic from "../../components-basics/Dialog/Dialog";
import { useTranslation } from "react-i18next";
import { BackupForm } from "./BackupForm";
import { BackupImport } from "./BackupImport";
import CheckboxBasic from "../../components-basics/Checkbox/Checkbox";
import { BsFillTrash3Fill, BsCloudDownloadFill } from "react-icons/bs";
import ToastBasic from "../../components-basics/Toast/Toast";
import RadioBasic from "../../components-basics/Radio/Radio";

export default function BackupRestoreList() {
  const { t } = useTranslation();
  enum DownloadType {
    One = "one",
    All = "all",
    Selected = "selected",
  }

  const filesChoice = {
    choiceOne: "manual",
    choiceTwo: "scheduled",
  };
  //state
  const [fileName, setFileName] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [openToast, setOpenToast] = useState({
    status: false,
    title: "",
    description: "",
    color: "",
  });

  const [isChecked, setIsChecked] = useState(false);
  const [numberOfBackupFiles, setNumberOfBackupFiles] = useState(0);
  const [selectedRadioValue, setSelectedRadioValue] = useState(
    filesChoice.choiceOne
  );

  //API
  //API GET all backup files depending on the type
  //databases/backupNames/manual
  const {
    data: AllBackupManual,
    isLoading,
    isError,
  } = useGetAllBackupQuery(filesChoice.choiceOne);
  //databases/backupNames/scheduled
  const { data: AllBackupScheduled } = useGetAllBackupQuery(
    filesChoice.choiceTwo
  );
  const [filesBackup, setFilesBackup] = useState<Backup[] | undefined>();

  //API POST Restore database : /databases/restore
  const [restoreDatabaseMutation] = useRestoreDatabaseMutation();

  //API GET download all the backup files depending on the type : /databases/all/${type}
  const { data: downloadAllBackupFiles } =
    useDownloadAllBackupFilesQuery(selectedRadioValue);

  //API GET download the selected backup file depending on the type : /databases/files/${args[0]}/${args[1]}
  const { data: downloadSelectedBackupFiles } =
    useDownloadSelectedBackupFilesQuery([selectedRadioValue, fileName]);

  //API DELETE a backup file : /databases/files/${filenames}
  const [deleteBackup] = useDeleteBackupMutation();

  useEffect(() => {
    //Arrays of manual backup files and scheduled backup files
    const backupManualArray = AllBackupManual && Object.values(AllBackupManual);
    const backupScheduledArray =
      AllBackupScheduled && Object.values(AllBackupScheduled);

    //Choose the array depending on the radio button value
    selectedRadioValue == filesChoice.choiceOne
      ? setFilesBackup(backupManualArray)
      : setFilesBackup(backupScheduledArray);

    filesBackup
      ? setNumberOfBackupFiles(filesBackup.length)
      : setNumberOfBackupFiles(0);

    const selectAllFiles =
      isChecked && filesBackup ? filesBackup.map(backup => backup.name) : [];
    setSelectedFiles(selectAllFiles);
  }, [AllBackupManual, AllBackupScheduled, isChecked, selectedRadioValue]);

  //Function which create the element to download a file
  const download = (name: string, file: any) => {
    try {
      const element = document.createElement("a");
      element.href = URL.createObjectURL(file);
      element.download = name;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

      setTimeout(() => {
        setOpenToast({
          status: true,
          title: t("backup.download.success"),
          description: name + t("backup.download.successDescription"),
          color: "green",
        });
      }, 800);
      setOpenToast({
        status: false,
        title: "",
        description: "",
        color: "",
      });
    } catch {
      setTimeout(() => {
        setOpenToast({
          status: true,
          title: t("backup.download.fail"),
          description: t("backup.download.failDescription"),
          color: "red",
        });
      }, 800);
      setOpenToast({
        status: false,
        title: "",
        description: "",
        color: "",
      });
    }
  };

  //Function to download or one file or a zip with all the files
  const downloadBackupFile = (backupName: any, type: DownloadType) => {
    switch (type) {
      case DownloadType.One: {
        setFileName(backupName);
        const file = new Blob([], { type: "application/octet-stream" });
        return download(backupName, file);
      }
      case DownloadType.All: {
        return download("backup", downloadAllBackupFiles);
      }
      case DownloadType.Selected: {
        setFileName(selectedFiles.join());
        return download("backup", downloadSelectedBackupFiles);
      }
      default:
        break;
    }
  };

  //Manage the checkbox
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  //Manage the files which are selected or not
  //If the files is already selected, it is removed
  //Else we add it
  const manageSelectedFiles = (name: string) => {
    selectedFiles.includes(name)
      ? setSelectedFiles(selectedFiles.filter(x => x !== name))
      : setSelectedFiles([...selectedFiles, name]);
  };

  //Handle the database restore
  const handleRestoreDatabase = (backupName: string) => {
    try {
      console.log("Restore database backup : ", backupName);
      restoreDatabaseMutation(backupName);
    } catch (err) {
      console.log("Error restoring database: ", err);
    }
  };

  //Handle the deleting of the backup file
  const handleDeleteBackup = (backupName: string) => {
    try {
      deleteBackup(backupName);
      const backupNames = backupName.split(",");
      const updateBackup = filesBackup?.filter(
        item => !backupNames.includes(item.name)
      );

      setFilesBackup(updateBackup);
      setIsChecked(false);
    } catch (err) {
      console.log("Error deleting backup: ", err);
    }
  };

  function handleRadioChange(value: string) {
    setIsChecked(false);
    setSelectedRadioValue(value);
  }
  return (
    <div className="backup-container">
      {openToast ? (
        <ToastBasic
          title={openToast.title}
          description={openToast.description}
          manageOpen={openToast.status}
          color={openToast.color}
        ></ToastBasic>
      ) : (
        ""
      )}
      {isError ? (
        <div>Error</div> //Faire un truc mieux
      ) : (
        <div>
          {isLoading ? (
            <Loader></Loader>
          ) : (
            <div className="backup-actions-list-container">
              <div className="actions-backup-restore">
                <DialogBasic
                  title={t("backup.import.title")}
                  description={<BackupImport></BackupImport>}
                  dialogTrigger={
                    <ButtonBasic
                      title={t("backup.import.button")}
                      onClick={() => console.log("Import")}
                      buttonlogo={<BiImport />}
                    ></ButtonBasic>
                  }
                ></DialogBasic>

                <DialogBasic
                  title={t("backup.save.title")}
                  description={<BackupForm></BackupForm>}
                  dialogTrigger={
                    <ButtonBasic
                      title={t("backup.save.button")}
                      onClick={() => console.log("Save")}
                      buttonlogo={<BiSave />}
                    ></ButtonBasic>
                  }
                ></DialogBasic>
              </div>
              <div className="choice-manual-scheduled">
                <RadioBasic
                  choiceOne={filesChoice.choiceOne}
                  choiceTwo={filesChoice.choiceTwo}
                  onValueChange={handleRadioChange}
                ></RadioBasic>
              </div>
              {filesBackup ? (
                <div>
                  <div className="actions-checkbox-container">
                    {filesBackup.length > 0 ? (
                      <CheckboxBasic
                        checked={isChecked}
                        onChange={handleCheckboxChange}
                      ></CheckboxBasic>
                    ) : (
                      <div>{t("backup.noFiles")}</div>
                    )}

                    {
                      /*Possible actions if some of the files are selected*/
                      selectedFiles.length > 1 &&
                      selectedFiles.length < numberOfBackupFiles ? (
                        <div className="buttons-actions">
                          <ButtonBasic
                            title={t("backup.download.selectedFiles")}
                            onClick={() =>
                              downloadBackupFile("", DownloadType.Selected)
                            }
                            buttonlogo={<BsCloudDownloadFill />}
                          ></ButtonBasic>

                          <AlertDialogBasic
                            title={t("backup.delete.selectedFiles.alert")}
                            alertTrigger={
                              <ButtonBasic
                                title={t("backup.delete.selectedFiles.button")}
                                buttonlogo={
                                  <BsFillTrash3Fill className="actions-backup" />
                                }
                              ></ButtonBasic>
                            }
                            content={t("backup.delete.selectedFiles.warning")}
                            onConfirm={() =>
                              handleDeleteBackup(selectedFiles.join())
                            }
                          ></AlertDialogBasic>
                        </div>
                      ) : /*Possible actions if ALL the files are selected*/

                      selectedFiles.length === numberOfBackupFiles &&
                        numberOfBackupFiles > 0 ? (
                        <div className="buttons-actions">
                          <ButtonBasic
                            title={t("backup.download.all")}
                            onClick={() =>
                              downloadBackupFile("", DownloadType.All)
                            }
                            buttonlogo={<BsCloudDownloadFill />}
                          ></ButtonBasic>
                        </div>
                      ) : (
                        ""
                      )
                    }
                  </div>

                  {filesBackup.map(
                    (backup: { name: string; creationDate: string }) => (
                      <div
                        id={backup.name}
                        key={backup.name}
                        className="card-files-container"
                      >
                        <CardBasic
                          portrait={false}
                          isSelected={selectedFiles.includes(backup.name)}
                          color={"none"}
                          cardTitleContainer={
                            <div
                              className="card-title-container"
                              onClick={() => {
                                manageSelectedFiles(backup.name);
                              }}
                            >
                              <div>{backup.name}</div>
                            </div>
                          }
                          cardContentContainer={
                            <div className="backup-creation-date">
                              {/* <img src={iconTime} /> */}
                              <BiTimeFive />
                              <div
                                onClick={() => {
                                  manageSelectedFiles(backup.name);
                                }}
                              >
                                {backup.creationDate}
                              </div>
                            </div>
                          }
                          cardActionsContainer={
                            <div
                              className="actions-backup-container"
                              onClick={() => setFileName(backup.name)}
                            >
                              <AlertDialogBasic
                                title={t("backup.restore.title")}
                                alertTrigger={
                                  <img
                                    src={iconPlay}
                                    className="action-backup"
                                  ></img>
                                }
                                content={t("backup.restore.warning")}
                                onConfirm={() => {
                                  handleRestoreDatabase(backup.name);
                                }}
                              ></AlertDialogBasic>
                              <img
                                src={iconDownload}
                                className="action-backup"
                                onClick={() =>
                                  downloadBackupFile(
                                    backup.name,
                                    DownloadType.One
                                  )
                                }
                              ></img>

                              <AlertDialogBasic
                                title={
                                  t("backup.delete.oneFile.alert") +
                                  " : " +
                                  backup.name
                                }
                                alertTrigger={
                                  <img
                                    src={iconDelete}
                                    className="action-backup"
                                  ></img>
                                }
                                content={t("backup.delete.oneFile.warning")}
                                onConfirm={() =>
                                  handleDeleteBackup(backup.name)
                                }
                              ></AlertDialogBasic>
                            </div>
                          }
                        ></CardBasic>
                      </div>
                    )
                  )}
                </div>
              ) : (
                ""
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
