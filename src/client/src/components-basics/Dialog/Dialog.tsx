import {
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogClose,
  DialogDescription,
  DialogPortal,
} from "@radix-ui/react-dialog";
import "./Dialog.scss";
import { Cross2Icon } from "@radix-ui/react-icons";
import React, { useState } from "react";

type DialogProps = {
  title: string;
  description: string | JSX.Element;
  dialogTrigger?: JSX.Element;
  isOpen?: boolean;
  onChange?: () => void;
};
const DialogBasic = ({
  title,
  description,
  dialogTrigger,
  isOpen,
  onChange,
}: DialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
      {dialogTrigger && <DialogTrigger asChild>{dialogTrigger}</DialogTrigger>}
      <DialogPortal>
        <DialogOverlay className="overlay" />
        <DialogContent className="dialogContent">
          <div className="dialog-content-container">
            <DialogTitle className="dialogTitle">{title}</DialogTitle>
            <DialogDescription className="dialogDescription">
              {description}
            </DialogDescription>
          </div>
          <DialogClose asChild>
            <button className="button-close-dialog" aria-label="Close">
              <Cross2Icon />
            </button>
          </DialogClose>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

export default DialogBasic;
