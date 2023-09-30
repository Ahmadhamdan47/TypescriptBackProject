import "./LogsList.scss";
import { useEffect, useState } from "react";
import {
  useGetLogsQuery,
  useGetLogsFileByNameQuery,
  useDownloadAllFilesQuery,
  useDownloadSelectedFilesQuery,
  useDeleteAllLogsMutation,
  useDeleteLogsMutation,
} from "../../api/logsApiSlice";
import {
  BsFillTrash3Fill,
  BsFillEyeFill,
  BsCloudDownloadFill,
} from "react-icons/bs";
import Loader from "../../components-basics/Loader/Loader";
import { v4 as uuidv4 } from "uuid";
import CheckboxBasic from "../../components-basics/Checkbox/Checkbox";
import ButtonBasic from "../../components-basics/Button/Button";
import DialogBasic from "../../components-basics/Dialog/Dialog";
import CardBasic from "../../components-basics/Card/Card";
import ToastBasic from "../../components-basics/Toast/Toast";
import AlertDialogBasic from "../../components-basics/Alert/Alert";

import { useTranslation } from "react-i18next";

export default function Logs() {
  //Give a unique id to the div
  const uniqueId = uuidv4();

  const { t } = useTranslation();

  //state
  const [fileName, setFileName] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [isChecked, setIsChecked] = useState(false);
  const [numberOfLogFiles, setNumberOfLogFiles] = useState(0);
  const [openToast, setOpenToast] = useState({
    status: false,
    title: "",
    description: "",
    color: "",
  });

  enum DownloadType {
    One = "one",
    All = "all",
    Selected = "selected",
  }
  //API
  const { data: Logs, isLoading, isError } = useGetLogsQuery();
  const [logFiles, setLogFiles] = useState(Logs);

  const { data: logsFileByName } = useGetLogsFileByNameQuery(fileName);
  const { data: downloadAll } = useDownloadAllFilesQuery(fileName);
  const { data: downloadSelectedFiles } =
    useDownloadSelectedFilesQuery(fileName);
  const [deleteLogs] = useDeleteLogsMutation();
  const [deleteAllLogs] = useDeleteAllLogsMutation();

  useEffect(() => {
    setLogFiles(Logs);
    //Get the number of logs files
    logFiles ? setNumberOfLogFiles(logFiles.length) : setNumberOfLogFiles(0);
    console.log(selectedFiles);

    //If the checkbox "select all" is checked -> set selectedFiles with all the logs file.
    const selectAllFiles =
      isChecked && logFiles ? logFiles.slice(0, -1).map(log => log.name) : [];
    setSelectedFiles(selectAllFiles);
  }, [Logs, isChecked]);

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
          title: t("logs.download.success"),
          description: name + t("logs.download.successDescription"),
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
          title: t("logs.download.fail"),
          description: t("logs.download.failDescription"),
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
  const downloadLogsFile = (logName: any, type: DownloadType) => {
    switch (type) {
      case DownloadType.One: {
        setFileName(logName);
        const filename = logName + ".txt";
        const file = new Blob([logsFileByName], { type: "text" });
        return download(filename, file);
      }
      case DownloadType.All: {
        return download("logs", downloadAll);
      }
      case DownloadType.Selected: {
        setFileName(selectedFiles.join());
        return download("logs", downloadSelectedFiles);
      }
      default:
        break;
    }
  };

  //Manage the files which are selected or not
  //If the files is already selected, it is removed
  //Else we add it
  const manageSelectedFiles = (name: string) => {
    selectedFiles.includes(name)
      ? setSelectedFiles(selectedFiles.filter(x => x !== name))
      : setSelectedFiles([...selectedFiles, name]);
  };

  //Manage the checkbox
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleDeleteLogs = (isAllSelected: boolean, filesName: string) => {
    try {
      isAllSelected ? deleteAllLogs : deleteLogs(filesName);

      //Updates the logsFile list locally, filtering out the deleted item
      const filesNames = filesName.split(",");

      const updateLogs = logFiles?.filter(
        item => !filesNames.includes(item.name)
      );
      setLogFiles(updateLogs);
      setIsChecked(false);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="logs-container">
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
            <div className="logs-list-container">
              {logFiles ? (
                <div id={uniqueId}>
                  <div className="actions-onCheckbox-container">
                    {logFiles.length > 1 ? (
                      <CheckboxBasic
                        checked={isChecked}
                        onChange={handleCheckboxChange}
                      ></CheckboxBasic>
                    ) : (
                      ""
                    )}

                    {
                      /*Possible actions if some of the files are selected*/
                      selectedFiles.length > 0 &&
                      selectedFiles.length < numberOfLogFiles - 1 ? (
                        <div className="buttons-actions">
                          <ButtonBasic
                            title={t("logs.download.selectedFiles")}
                            onClick={() =>
                              downloadLogsFile("", DownloadType.Selected)
                            }
                            buttonlogo={<BsCloudDownloadFill />}
                          ></ButtonBasic>

                          <AlertDialogBasic
                            title={t("logs.delete.selectedFiles.alert")}
                            alertTrigger={
                              <ButtonBasic
                                title={t("logs.delete.selectedFiles.button")}
                                buttonlogo={
                                  <BsFillTrash3Fill className="actions-logs" />
                                }
                              ></ButtonBasic>
                            }
                            content={t("logs.delete.selectedFiles.warning")}
                            onConfirm={() =>
                              handleDeleteLogs(false, selectedFiles.join())
                            }
                          ></AlertDialogBasic>
                        </div>
                      ) : /*Possible actions if ALL the files are selected*/
                      selectedFiles.length === numberOfLogFiles - 1 ? (
                        <div className="buttons-actions">
                          <ButtonBasic
                            title={t("logs.download.all")}
                            onClick={() =>
                              downloadLogsFile("", DownloadType.All)
                            }
                            buttonlogo={<BsCloudDownloadFill />}
                          ></ButtonBasic>

                          <AlertDialogBasic
                            title={t("logs.delete.all.alert")}
                            alertTrigger={
                              <ButtonBasic
                                title={t("logs.delete.all.button")}
                                buttonlogo={
                                  <BsFillTrash3Fill className="actions-logs" />
                                }
                              ></ButtonBasic>
                            }
                            content={t("logs.delete.all.warning")}
                            onConfirm={() => handleDeleteLogs(true, "")}
                          ></AlertDialogBasic>
                        </div>
                      ) : (
                        ""
                      )
                    }
                  </div>

                  {logFiles.map((log, index, arr) => (
                    <div key={log.name} id={log.name}>
                      <CardBasic
                        portrait={false}
                        isSelected={selectedFiles.includes(log.name)}
                        color={"none"}
                        cardTitleContainer={
                          <div
                            className="card-title-container"
                            onClick={() => {
                              index == arr.length - 1
                                ? false
                                : manageSelectedFiles(log.name);
                            }}
                          >
                            <h1>{log.name}</h1>
                          </div>
                        }
                        cardContentContainer={
                          <div
                            className="card-content-container"
                            onClick={() => {
                              index === arr.length - 1
                                ? false
                                : manageSelectedFiles(log.name);
                            }}
                          >
                            <h2>{t("logs.size") + log.size}</h2>
                            <h2>{t("logs.creationdate") + log.creationDate}</h2>
                          </div>
                        }
                        cardActionsContainer={
                          <div
                            className="actions-logs-container"
                            onClick={() => setFileName(log.name)}
                          >
                            <DialogBasic
                              title={log.name}
                              description={logsFileByName}
                              dialogTrigger={
                                <BsFillEyeFill className="actions-logs" />
                              }
                            ></DialogBasic>

                            <BsCloudDownloadFill
                              className="actions-logs"
                              onClick={() =>
                                downloadLogsFile(log.name, DownloadType.One)
                              }
                            />
                            {index !== arr.length - 1 ? (
                              <AlertDialogBasic
                                title={t("logs.delete.oneFile.alert")}
                                alertTrigger={
                                  <BsFillTrash3Fill className="actions-logs" />
                                }
                                content={t("logs.delete.oneFile.warning")}
                                onConfirm={() =>
                                  handleDeleteLogs(false, log.name)
                                }
                              ></AlertDialogBasic>
                            ) : (
                              ""
                            )}
                          </div>
                        }
                      ></CardBasic>
                    </div>
                  ))}
                </div>
              ) : (
                <div>No logs file</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
