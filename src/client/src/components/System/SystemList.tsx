import "./SystemList.scss";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  SystemList,
  useGetAllSystemQuery,
  useDeleteSystemMutation,
} from "../../api/systemApiSlice";
import CardBasic from "../../components-basics/Card/Card";
import { FaEdit } from "react-icons/fa";
import { ImBin } from "react-icons/im";
import { MdAddCircle } from "react-icons/md";
import ButtonBasic from "../../components-basics/Button/Button";
import DialogBasic from "../../components-basics/Dialog/Dialog";
import { SystemForm } from "./SystemForm";
import { CheckIcon } from "@radix-ui/react-icons";
import * as Checkbox from "@radix-ui/react-checkbox";
import AlertDialogBasic from "../../components-basics/Alert/Alert";
import ToastBasic from "../../components-basics/Toast/Toast";

export interface ActionFilter {
  id: string;
  title: string;
  isChecked: boolean;
  kind: string;
}
export default function BackupRestoreList() {
  const { t } = useTranslation();

  /*-----Constante-----*/
  const connectedState = "Connected";
  const actionsFilter = [
    {
      id: "1",
      title: "Interphonie",
      isChecked: false,
      kind: "Interphonie",
    },
    {
      id: "2",
      title: "Text message",
      isChecked: false,
      kind: "Text message",
    },
  ];
  let filteredSystems: SystemList[] | undefined;

  /*-----State-----*/
  const [checkboxStates, setCheckboxStates] =
    useState<ActionFilter[]>(actionsFilter);
  const [filtersChecked, setFiltersChecked] = useState<ActionFilter[]>();
  const [systemToEdit, setSystemToEdit] = useState<SystemList>();

  //Manage the dialog to edit a system
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const openEditDialog = () => setIsEditDialogOpen(true);
  const closeEditDialog = () => setIsEditDialogOpen(false);
  const updateEditDialog = () => setIsEditDialogOpen(!isEditDialogOpen);

  //Manage the dialog to add a system
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const openAddDialog = () => setIsAddDialogOpen(true);
  const closeAddDialog = () => setIsAddDialogOpen(false);
  const updateAddDialog = () => setIsAddDialogOpen(!isAddDialogOpen);

  //Manage the toast
  const [openToast, setOpenToast] = useState({
    status: false,
    title: "",
    description: "",
    color: "",
  });

  const [systems, setSystems] = useState<SystemList[]>();

  /*-----API-----*/
  const {
    data: AllSystems,
    isError: isErrorGetAllSystem,
    error: errorGetAllSystem,
  } = useGetAllSystemQuery();
  const [deleteSystem, isSuccess] = useDeleteSystemMutation();

  useEffect(() => {
    setSystems(AllSystems);
    //If a filter is checked, update the systems list with the system that match the filter
    filteredSystems =
      filtersChecked && filtersChecked.length > 0
        ? systems?.filter(system => {
            return filtersChecked.some(filter => filter.kind === system.kind);
          })
        : AllSystems;

    setSystems(filteredSystems);
  }, [AllSystems, filtersChecked, open]);

  useEffect(() => {
    if (isErrorGetAllSystem) throw errorGetAllSystem; // Error is handled by the ErrorBoundary component
  }, [errorGetAllSystem]);

  /**
   * Manages the selection of checkboxes to filter and display relevant systems.
   * @param id - The ID of the checkbox that triggered the change.
   */
  const handleCheckboxChange = (id: string) => {
    const updatedStates = checkboxStates.map(state => {
      if (state.id === id) {
        return {
          ...state,
          isChecked: !state.isChecked,
        };
      }
      return state;
    });
    setCheckboxStates(updatedStates);
    setFiltersChecked(updatedStates.filter(state => state.isChecked));
  };

  /**
   * Handles the deleting of the system.
   * Delete a system based on the given system ID
   * And handle the opening of the toast
   * @param systemId - The ID of the system that will be deleted.
   */
  const handleDeleteSystem = async (systemId: string) => {
    try {
      await deleteSystem(systemId);
      isSuccess
        ? setTimeout(() => {
            setOpenToast({
              status: true,
              title: t("system.delete.success"),
              description: t("system.delete.successDescription"),
              color: "green",
            });
          }, 800)
        : setTimeout(() => {
            setOpenToast({
              status: true,
              title: t("system.delete.fail"),
              description: t("system.delete.failDescription"),
              color: "red",
            });
          }, 800);

      setOpenToast({
        status: false,
        title: "",
        description: "",
        color: "",
      });
    } catch (err) {
      console.log("Error deleting system: ", err);
    }
  };

  /**
   * Display a toast notification indicating whether
   * the addition of a new system was successful or not.
   * @param name - The name of the system that was added.
   * @param isSuccess - A boolean flag indicating whether the addition was successful (true) or failed (false).
   */
  const handleFormSubmit = (name: string, isSuccess: boolean) => {
    isSuccess
      ? setTimeout(() => {
          setOpenToast({
            status: true,
            title: t("system.add.success") + name,
            description: t("system.add.successDescription"),
            color: "green",
          });
        }, 800)
      : setTimeout(() => {
          setOpenToast({
            status: true,
            title: t("system.add.fail"),
            description: t("system.add.failDescription"),
            color: "red",
          });
        }, 800);

    setOpenToast({
      status: false,
      title: "",
      description: "",
      color: "",
    });
  };

  /**
   * Handles the editing of a system.
   * Set the system to be edited and open the edit dialog.
   * @param system - The system object to be edited.
   */
  const handleSystemEdit = (system: SystemList) => {
    setSystemToEdit(system);
    openEditDialog();
  };

  return (
    <div className="systemList-container">
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
      <DialogBasic
        title={t("system.form.title")}
        description={
          <SystemForm
            system={systemToEdit}
            isNew={false}
            onSubmit={handleFormSubmit}
            closeFunction={closeEditDialog}
          ></SystemForm>
        }
        isOpen={isEditDialogOpen}
        onChange={updateEditDialog}
      ></DialogBasic>
      <div className="filtersContainer">
        <div>{t("system.filter.title")} </div>
        {actionsFilter.map(option => (
          <div key={option.id} className="checkboxFilters">
            <div className="checkbox-filter-icon" key={option.id}>
              <Checkbox.Root
                className="CheckboxRoot"
                checked={
                  checkboxStates.find(state => state.id === option.id)
                    ?.isChecked || false
                }
                onCheckedChange={() => handleCheckboxChange(option.id)}
              >
                <Checkbox.Indicator className="CheckboxIndicator">
                  <CheckIcon />
                </Checkbox.Indicator>
              </Checkbox.Root>
            </div>
            <label>{option.title}</label>
          </div>
        ))}
      </div>
      {systems ? (
        <div className="system-cards">
          {systems.map(system => (
            <div key={system.id}>
              <CardBasic
                portrait={true}
                isSelected={false}
                color={system.state === connectedState ? "#09a368" : "#E70027"}
                cardTitleContainer={
                  <div className="system-title">{system.name}</div>
                }
                cardContentContainer={
                  <div className="system-content">
                    <div
                      className="status-systems-cards"
                      style={{
                        border:
                          system.state === connectedState
                            ? "2px solid #09a368"
                            : "2px solid #E70027",
                      }}
                    >
                      <div className="state-system-title">
                        {t("system.cards.state")}
                      </div>
                      <div
                        className="state-system"
                        style={{
                          backgroundColor:
                            system.state === connectedState
                              ? "#09a368"
                              : "#E70027",
                        }}
                      >
                        {system.state}
                      </div>
                    </div>
                    <h4>{t("system.cards.modified")}</h4>
                    <h2>
                      {new Date(system.updatedAt).toISOString().split("T")[0]}
                    </h2>
                    <h2>
                      {
                        new Date(system.updatedAt)
                          .toISOString()
                          .split("T")[1]
                          .split(".")[0]
                      }
                    </h2>
                    <h4>{t("system.cards.equipments")}</h4>
                    <h2>{system.kind}</h2>
                    <h4>{t("system.cards.brand")}</h4>
                    <h2>{system.brand}</h2>
                  </div>
                }
                cardActionsContainer={
                  <div className="system-actions">
                    <FaEdit
                      className="action"
                      onClick={() => handleSystemEdit(system)}
                    />
                    <AlertDialogBasic
                      title={t("system.delete.alert")}
                      alertTrigger={<ImBin className="action" />}
                      content={t("system.delete.warning")}
                      onConfirm={() => handleDeleteSystem(system.id.toString())}
                    ></AlertDialogBasic>
                  </div>
                }
              ></CardBasic>
            </div>
          ))}
        </div>
      ) : (
        ""
      )}
      <div>
        <DialogBasic
          title={t("system.form.title")}
          description={
            <SystemForm
              isNew={true}
              onSubmit={handleFormSubmit}
              closeFunction={closeAddDialog}
            ></SystemForm>
          }
          dialogTrigger={
            <ButtonBasic
              title={"Add a system"}
              onClick={openAddDialog}
              buttonlogo={<MdAddCircle />}
            ></ButtonBasic>
          }
          isOpen={isAddDialogOpen}
          onChange={updateAddDialog}
        ></DialogBasic>
      </div>
    </div>
  );
}
