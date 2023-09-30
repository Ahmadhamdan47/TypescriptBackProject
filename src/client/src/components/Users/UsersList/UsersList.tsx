import ReactCountryFlag from "react-country-flag";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
} from "../../../api/usersApiSlice";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import Loader from "../../../components-basics/Loader/Loader";
import "./UsersList.scss";
import CardBasic from "../../../components-basics/Card/Card";
import EditIcon from "~images/icon/icon_edit.svg";
import DeleteIcon from "~images/icon/icone supprimer.svg";
import DialogBasic from "../../../components-basics/Dialog/Dialog";
import { UsersForm } from "../UsersForm/UsersForm";
import { User, UserForm } from "../../../pages/Users/Users";
import AlertDialogBasic from "../../../components-basics/Alert/Alert";
import ListHead, {
  ListHeadColumnProps,
} from "../../../components-basics/ListHead/ListHead";
import CheckboxBasic from "../../../components-basics/Checkbox/Checkbox";
import { RxAvatar } from "react-icons/rx";

const COLUMNS_USERS_LIST: ListHeadColumnProps[] = [
  { name: "name", isSortable: true },
  { name: "description" },
  { name: "language", isSortable: true },
];

export enum SortDirection {
  ASC = "asc",
  DESC = "desc",
  DEFAULT = "default",
}

export default function UsersList() {
  const { t } = useTranslation();

  ////////////////////////////////////////////
  // API CALLS
  ////////////////////////////////////////////
  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUsersQuery();

  useEffect(() => {
    if (isError) {
      console.error("Error while loading users : ", error);
      throw error;
    }
  }, [isError, error]);

  const [deleteUser] = useDeleteUserMutation();

  ////////////////////////////////////////////
  // USERS LIST IN STATE
  // -> so we can sort it
  ////////////////////////////////////////////
  const [usersList, setUsersList] = useState<User[]>(users ?? []);

  useEffect(() => {
    setUsersList(users ?? []);
  }, [users]);

  const handleSort = (columnName: string, direction: string) => {
    if (direction !== SortDirection.DEFAULT) {
      const sortedUsers = [...usersList].sort((a, b) => {
        if (direction === SortDirection.ASC) {
          return a[columnName as keyof User] > b[columnName as keyof User]
            ? 1
            : -1;
        } else {
          return a[columnName as keyof User] < b[columnName as keyof User]
            ? 1
            : -1;
        }
      });
      setUsersList(sortedUsers);
    } else {
      setUsersList(users ?? []);
    }
  };

  ////////////////////////////////////////////
  // DIALOG
  ////////////////////////////////////////////
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);
  const handleCloseDialog = () => setIsDialogOpen(!isDialogOpen);

  const [userToEdit, setUserToEdit] = useState<UserForm>({
    id: "",
    name: "",
    password: "",
    language: "",
    description: "",
    time_zone: "",
  });

  const handleUserEdit = (userToEdit: User) => {
    setUserToEdit(userToEdit);
    openDialog(); // Could've been placed in the useEffect, but it would've
    // required an additional state and it works fine like this
    // -> async state update might happen during the dialog opening
  };

  ////////////////////////////////////////////
  // SELECTED USERS
  ////////////////////////////////////////////
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  //Manage the select all checkbox
  const [isSelectAllChecked, setIsSelectAllChecked] = useState(false);
  const handleSelectAllCheckboxChange = () => {
    setIsSelectAllChecked(!isSelectAllChecked);
  };

  useEffect(() => {
    if (isSelectAllChecked) {
      setSelectedUsers(usersList.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  }, [isSelectAllChecked]);

  const handleSingleSelect = (userId: string) => () => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleDeleteSelectedUsers = () => {
    selectedUsers.forEach(userId => deleteUser(userId));
    setSelectedUsers([]);
  };

  return (
    <>
      {(isLoading && <Loader />) ||
        (isSuccess && (
          <>
            <DialogBasic
              title={t("users.modify")}
              isOpen={isDialogOpen}
              onChange={handleCloseDialog}
              description={
                <UsersForm
                  infos={userToEdit}
                  submitType="modify"
                  closeFunction={closeDialog}
                />
              }
            />

            <div className="users-list-container">
              <div className="users-list-head-container">
                <div className="users-list-head-select-all">
                  {usersList.length > 1 ? (
                    <CheckboxBasic
                      checked={isSelectAllChecked}
                      onChange={handleSelectAllCheckboxChange}
                    />
                  ) : undefined}
                  {selectedUsers.length > 0 ? (
                    <AlertDialogBasic
                      title={t("users.deleteMultiple.title")}
                      alertTrigger={
                        <div className="users-list-head-select-all-actions">
                          <img
                            src={DeleteIcon}
                            className="users-list-head-select-all-action"
                          />
                        </div>
                      }
                      content={t("users.deleteMultiple.confirm")}
                      onConfirm={handleDeleteSelectedUsers}
                    />
                  ) : undefined}
                </div>
                <div className="users-list-head-columns">
                  <ListHead
                    columns={COLUMNS_USERS_LIST}
                    handleSort={handleSort}
                  />
                </div>
              </div>
              {usersList.map(user => (
                <CardBasic
                  key={user.id}
                  portrait={false}
                  color={"none"}
                  isSelected={selectedUsers.includes(user.id)}
                  cardTitleContainer={
                    <h4>
                      <RxAvatar />
                    </h4>
                  }
                  cardContentContainer={
                    <div
                      className="user-infos-container"
                      onClick={handleSingleSelect(user.id)}
                    >
                      <p className="user-info">{user.name}</p>
                      <p className="user-info">{user.description}</p>
                      <p className="user-info">
                        <span className="user-info-flag">
                          <ReactCountryFlag
                            countryCode={
                              user.language === "en" ? "gb" : user.language
                            }
                            alt={user.language}
                          />
                        </span>
                        {t(`languages.${user.language}`)}
                      </p>
                    </div>
                  }
                  cardActionsContainer={
                    <div
                      className="user-actions-container"
                      onClick={handleSingleSelect(user.id)}
                    >
                      <div key={user.id} onClick={() => handleUserEdit(user)}>
                        <img src={EditIcon} className="user-action" />
                      </div>
                      <AlertDialogBasic
                        title={t("users.delete.title")}
                        alertTrigger={
                          <div>
                            <img src={DeleteIcon} className="user-action" />
                          </div>
                        }
                        content={t("users.delete.confirm")}
                        onConfirm={() => deleteUser(user.id)}
                      />
                    </div>
                  }
                />
              ))}
            </div>
          </>
        ))}
    </>
  );
}
