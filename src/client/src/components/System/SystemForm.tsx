import { FormEvent, useEffect, useState } from "react";
import * as Form from "@radix-ui/react-form";
import "./SystemForm.scss";
import { useTranslation } from "react-i18next";
import ButtonBasic from "../../components-basics/Button/Button";
import { BiSave } from "react-icons/bi";
import {
  SystemList,
  NewSystem,
  useGetAuthModesQuery,
  useGetBrandsQuery,
  useAddSystemMutation,
  useUpdateSystemMutation,
} from "../../api/systemApiSlice";

export interface SystemFormProps {
  system?: SystemList;
  isNew: boolean;
  onSubmit: (values: string, isSuccess: boolean) => void;
  closeFunction: () => void;
}

export const SystemForm = ({
  system,
  isNew,
  onSubmit,
  closeFunction,
}: SystemFormProps) => {
  const { t } = useTranslation();

  /*-----API-----*/
  const {
    data: getAuthMode,
    isError: isErrorGetAuthModes,
    error: errorGetAuthModes,
  } = useGetAuthModesQuery();

  const { data: getBrand } = useGetBrandsQuery();

  //API to add a system
  const [addSystemMutation] = useAddSystemMutation();
  const [editSystemMutation] = useUpdateSystemMutation();

  /*-----Constante-----*/
  const systemToEdit = system;
  const form = {
    authmode: "authmode",
    brand: "brand",
    address: "address",
    kind: "kind",
    port: "port",
    name: "name",
    managementarea: "managementarea",
    catgeory: "category",
    user: "user",
    password: "password",
  };

  /*-----State-----*/
  //Initialize the parameters to edit a system
  const [updatedValues, setUpdatedValues] = useState<NewSystem>(
    systemToEdit
      ? {
          address: systemToEdit.address,
          authMode: systemToEdit.authMode,
          kind: systemToEdit.kind,
          name: systemToEdit.name,
          port: systemToEdit.port,
          managementArea: systemToEdit.managementArea,
          category: systemToEdit.category,
          brand: systemToEdit.brand,
          createdBy: "xtvision",
          user: systemToEdit.user,
          password: systemToEdit.password,
        }
      : {
          address: "",
          authMode: getAuthMode ? getAuthMode[0] : "",
          kind: "",
          name: "",
          port: "",
          managementArea: "",
          category: "",
          brand: getBrand ? getBrand[0] : "",
          createdBy: "xtvision",
          user: "",
          password: "",
        }
  );

  useEffect(() => {
    if (isErrorGetAuthModes) throw errorGetAuthModes; // Error is handled by the ErrorBoundary component
  }, [errorGetAuthModes, systemToEdit]);

  /**
   * Handles the changes of input fields in the form.
   * @param event - The event object that contains the `name` and `value` of the modified input field.
   */
  const handleChange = (event: { target: { value: string; name: string } }) => {
    const { name, value } = event.target;
    const updatedValuesCopy = { ...updatedValues } as NewSystem;
    updatedValuesCopy[name as keyof NewSystem] = value;
    setUpdatedValues(updatedValuesCopy);
  };

  /**
   * Handles the form submission for updating or adding a system.
   * This function is triggered when the user submits the form to either update an existing
   * system or add a new one.
   * @param e - The form submission event.
   */
  const handleSubmitForm = async (e: FormEvent) => {
    e.preventDefault();
    let bodyEdit: Partial<NewSystem> = {};
    const body = {
      name: updatedValues.name,
      kind: updatedValues.kind,
      address: updatedValues.address,
      brand: updatedValues.brand
        ? updatedValues.brand
        : getBrand
        ? getBrand[0]
        : "",
      category: updatedValues.category,
      managementArea: updatedValues.managementArea,
      port: updatedValues.port,
      createdBy: "xtvision", //TODO : update with users value
      authMode: updatedValues.authMode
        ? updatedValues.authMode
        : getAuthMode
        ? getAuthMode[0]
        : "",
      user: updatedValues.user,
      password: updatedValues.password,
    } as NewSystem;

    // Editing existing system
    if (systemToEdit && !isNew) {
      Object.keys(updatedValues).forEach(key => {
        const creationSystemKey = key as keyof NewSystem;
        if (
          updatedValues[creationSystemKey] !== systemToEdit[creationSystemKey]
        ) {
          // Only add key-value pairs for properties that have changed
          bodyEdit[creationSystemKey] = updatedValues[creationSystemKey];
        }
      });
    }

    closeFunction();

    try {
      isNew
        ? await addSystemMutation(body)
            .unwrap()
            .then(() => onSubmit(updatedValues.name, true))
            .catch(error => onSubmit(error.status, false))
        : await editSystemMutation({
            body: bodyEdit,
            id: systemToEdit ? systemToEdit.id.toString() : "",
          });
    } catch (e: any) {
      console.log("err");
      onSubmit(e, false);
    }
  };

  return (
    <Form.Root onSubmit={handleSubmitForm} className="form-root-system">
      <div>
        <Form.Field name={form.authmode} className="form-field-system">
          <Form.Label>{t("system.form.authmode")}</Form.Label>
          <select
            disabled={!isNew}
            value={updatedValues.authMode}
            name={form.authmode}
            onChange={handleChange}
            className="select-input"
          >
            {getAuthMode?.map(auth => (
              <option key={auth} value={auth}>
                {auth}
              </option>
            ))}
          </select>
        </Form.Field>
      </div>
      <div>
        <Form.Field name={form.brand} className="form-field-system">
          <Form.Label>{t("system.form.brand")}</Form.Label>
          <select
            disabled={!isNew}
            value={updatedValues.brand}
            name={form.brand}
            onChange={handleChange}
            className="select-input"
          >
            {getBrand?.map(brandOption => (
              <option key={brandOption} value={brandOption}>
                {brandOption}
              </option>
            ))}
          </select>
        </Form.Field>
      </div>
      <div>
        <Form.Field name={form.address} className="form-field-system">
          <Form.Label>{t("system.form.address")}</Form.Label>
          <input
            className="input-form-system"
            type="text"
            name={form.address}
            value={updatedValues.address}
            onChange={handleChange}
          />
        </Form.Field>
      </div>
      <div>
        <Form.Field name={form.kind} className="form-field-system">
          <Form.Label>{t("system.form.kind")}</Form.Label>
          <input
            disabled={!isNew}
            className="input-form-system"
            type="text"
            name={form.kind}
            value={updatedValues.kind}
            onChange={handleChange}
            required
          />
        </Form.Field>
      </div>
      <div>
        <Form.Field name={form.port} className="form-field-system">
          <Form.Label>{t("system.form.port")}</Form.Label>
          <input
            className="input-form-system"
            type="text"
            name={form.port}
            value={updatedValues.port}
            onChange={handleChange}
            required
          />
        </Form.Field>
      </div>
      <div>
        <Form.Field name={form.name} className="form-field-system">
          <Form.Label>{t("system.form.name")}</Form.Label>
          <input
            className="input-form-system"
            type="text"
            name={form.name}
            value={updatedValues.name}
            onChange={handleChange}
            required
          />
        </Form.Field>
      </div>
      <div>
        <Form.Field name={form.managementarea} className="form-field-system">
          <Form.Label>{t("system.form.managementArea")}</Form.Label>
          <input
            disabled
            className="input-form-system"
            name={form.managementarea}
            type="text"
            value={" "}
            onChange={handleChange}
            required
          />
        </Form.Field>
      </div>
      <div>
        <Form.Field name={form.catgeory} className="form-field-system">
          <Form.Label>{t("system.form.category")}</Form.Label>
          <input
            disabled
            className="input-form-system"
            name={form.catgeory}
            type="text"
            value={" "}
            onChange={handleChange}
            required
          />
        </Form.Field>
      </div>
      <div>
        <Form.Field name={form.user} className="form-field-system">
          <Form.Label>{t("system.form.user")}</Form.Label>
          <input
            disabled={!isNew}
            className="input-form-system"
            name={form.user}
            type="text"
            value={updatedValues.user}
            onChange={handleChange}
            required
          />
        </Form.Field>
      </div>
      <div>
        <Form.Field name={form.password} className="form-field-system">
          <Form.Label>{t("system.form.password")}</Form.Label>
          <input
            disabled={!isNew}
            className="input-form-system"
            name={form.password}
            type="password"
            value={updatedValues.password}
            onChange={handleChange}
            required
          />
        </Form.Field>
      </div>
      <Form.Submit>
        <ButtonBasic title="Save" buttonlogo={<BiSave />}></ButtonBasic>
      </Form.Submit>
    </Form.Root>
  );
};
