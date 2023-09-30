import React, { useEffect } from "react";
import * as Toast from "@radix-ui/react-toast";
import "./Toast.scss";
import { AiFillCheckCircle } from "react-icons/ai";

type ToastProps = {
  title: string;
  description: string | JSX.Element;
  manageOpen: boolean;
  color: string;
};

const ToastBasic = ({ title, description, manageOpen, color }: ToastProps) => {
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    setOpen(manageOpen);
  }, [manageOpen]);

  return (
    <Toast.Provider swipeDirection="right">
      <Toast.Root
        className={color == "green" ? "ToastRootSuccess" : "ToastRootFailed"}
        open={open}
        onOpenChange={setOpen}
      >
        <Toast.Title className="ToastTitle">{title}</Toast.Title>
        <Toast.Description asChild>
          <time className="ToastDescription">{description}</time>
        </Toast.Description>
        <Toast.Action
          className="ToastAction"
          asChild
          altText="Goto schedule to undo"
        >
          <button className="Button">
            <AiFillCheckCircle
              style={{ color: color, height: "100%" }}
            ></AiFillCheckCircle>
          </button>
        </Toast.Action>
      </Toast.Root>
      <Toast.Viewport className="ToastViewport" />
    </Toast.Provider>
  );
};

export default ToastBasic;
