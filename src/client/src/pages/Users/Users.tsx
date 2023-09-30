import "./Users.scss";
import UsersList from "../../components/Users/UsersList/UsersList";
import { useTranslation } from "react-i18next";
import Title from "../../components-basics/Title/Title";
import { useState } from "react";
import { FaPlusSquare } from "react-icons/fa";
import ButtonBasic from "../../components-basics/Button/Button";
import DialogBasic from "../../components-basics/Dialog/Dialog";
import { UsersForm } from "../../components/Users/UsersForm/UsersForm";

// TODO_RS : use Zod to validate data
export type User = {
  id: string;
  name: string;
  password: string;
  language: string;
  description: string;
  time_zone: string;
  createdAt: string;
  updatedAt: string;
  roles: string[];
  managementAreas: string[];
};

// I Pick more than I would Omit but I prefer to be explicit
export type UserForm = Pick<
  User,
  "id" | "name" | "password" | "language" | "description" | "time_zone"
>;

export default function Users() {
  const { t } = useTranslation();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);
  const handleCloseDialog = () => setIsDialogOpen(!isDialogOpen);

  return (
    <>
      <Title title={t("users.title")}></Title>
      <UsersList />
      <div className="add-user-wrapper">
        <DialogBasic
          title={t("users.new")}
          dialogTrigger={
            <ButtonBasic
              buttonlogo={<FaPlusSquare />}
              title={t("users.new")}
              onClick={openDialog}
            />
          }
          isOpen={isDialogOpen}
          onChange={handleCloseDialog}
          description={
            <UsersForm
              infos={{
                id: "",
                password: "",
                name: "",
                language: "en", // <select> default value
                description: "",
                time_zone: "UTC", // <select> default value
              }}
              closeFunction={closeDialog}
              submitType="add"
            />
          }
        />
      </div>
    </>
  );
}
