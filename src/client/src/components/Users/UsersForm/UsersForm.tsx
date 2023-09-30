import * as Form from "@radix-ui/react-form";
import "./UsersForm.scss";
import { UserForm } from "../../../pages/Users/Users";
import { useTranslation } from "react-i18next";
import ReactCountryFlag from "react-country-flag";
import { FormEvent, useState } from "react";
import {
  useAddUserMutation,
  useModifyUserMutation,
} from "../../../api/usersApiSlice";
import { ImSpinner8 } from "react-icons/im";

export type UsersFormProps = {
  infos: UserForm;
  submitType: "add" | "modify"; // Same form for add and modify
  closeFunction: () => void; // If we need to manually handle closing the Dialog containing the Form
};

export const UsersForm = (props: UsersFormProps) => {
  const { t } = useTranslation();

  const [inputValue, setInputValue] = useState<UserForm>(props.infos);

  const [addUser, { isLoading: isAddingUser }] = useAddUserMutation();
  const [modifyUser, { isLoading: isModifyingUser }] = useModifyUserMutation();

  const handleAddOrModifyUser = async (e: FormEvent) => {
    e.preventDefault();
    if (!isAddingUser && !isModifyingUser) {
      try {
        const queryFunction = props.submitType === "add" ? addUser : modifyUser;
        const queryBody = {
          id: props.infos.id,
          name: inputValue.name,
          password: inputValue.password,
          language: inputValue.language,
          description: inputValue.description,
          time_zone: inputValue.time_zone,
        };
        await queryFunction(queryBody).unwrap();
      } catch (error) {
        console.error("error: ", error);
        throw error;
      }
    } else {
      console.error("can not add new user");
    }
    props.closeFunction();
  };

  return (
    <Form.Root className="form-root" onSubmit={e => handleAddOrModifyUser(e)}>
      <Form.Field className="form-field" name="username">
        <div className="label-message-wrapper">
          <Form.Label className="form-label">{t("users.name")}</Form.Label>
          <Form.Message className="form-message" match="valueMissing">
            {t("users.errors.nameMissing")}
          </Form.Message>
          <Form.Message className="form-message" match="typeMismatch">
            {t("users.errors.nameInvalid")}
          </Form.Message>
        </div>
        <Form.Control asChild>
          <input
            className="form-input"
            value={inputValue.name}
            onChange={e =>
              setInputValue({ ...inputValue, name: e.target.value })
            }
            required
          />
        </Form.Control>
      </Form.Field>

      <Form.Field className="form-field" name="password">
        <div className="label-message-wrapper">
          <Form.Label className="form-label">{t("users.password")}</Form.Label>
          <Form.Message className="form-message" match="valueMissing">
            {t("users.errors.passwordMissing")}
          </Form.Message>
          <Form.Message className="form-message" match="typeMismatch">
            {t("users.errors.passwordInvalid")}
          </Form.Message>
        </div>
        <Form.Control asChild>
          <input
            className="form-input"
            type="password"
            value={inputValue.password}
            onChange={e =>
              setInputValue({ ...inputValue, password: e.target.value })
            }
            required
          />
        </Form.Control>
      </Form.Field>

      <Form.Field className="form-field" name="description">
        <div className="label-message-wrapper">
          <Form.Label className="form-label">
            {t("users.description")}
          </Form.Label>
          <Form.Message className="form-message" match="typeMismatch">
            {t("users.errors.descriptionInvalid")}
          </Form.Message>
        </div>
        <Form.Control asChild>
          <textarea
            className="form-textarea"
            value={inputValue.description}
            onChange={e =>
              setInputValue({ ...inputValue, description: e.target.value })
            }
          />
        </Form.Control>
      </Form.Field>

      <Form.Field className="form-field" name="timezone">
        <Form.Label className="form-label">{t("users.timezone")}</Form.Label>
        <Form.Control asChild>
          <select
            className="form-input"
            defaultValue={inputValue.time_zone}
            onChange={e =>
              setInputValue({ ...inputValue, time_zone: e.target.value })
            }
          >
            <option value="UTC">UTC</option>
            <option value="UTC+1">UTC+1</option>
          </select>
        </Form.Control>
      </Form.Field>

      <Form.Field className="form-field" name="language">
        <Form.Label className="form-label">{t("users.language")}</Form.Label>
        <Form.Control asChild>
          <select
            className="form-input"
            defaultValue={inputValue.language}
            onChange={e =>
              setInputValue({ ...inputValue, language: e.target.value })
            }
          >
            <option value="gb">
              <ReactCountryFlag countryCode="gb" />
              &nbsp;&nbsp; {t("languages.en")}
            </option>
            <option value="fr">
              <ReactCountryFlag countryCode="fr" />
              &nbsp;&nbsp; {t("languages.fr")}
            </option>
          </select>
        </Form.Control>
      </Form.Field>

      <Form.Submit asChild>
        <button className="form-submit">
          {isAddingUser || isModifyingUser ? <ImSpinner8 /> : t("buttons.save")}
        </button>
      </Form.Submit>
    </Form.Root>
  );
};
