import * as AlertDialog from "@radix-ui/react-alert-dialog";
import "./Alert.scss";

type AlertProps = {
  title: string;
  alertTrigger: JSX.Element;
  content: string;
  onConfirm: any;
};

const AlertDialogBasic = ({
  title,
  alertTrigger,
  content,
  onConfirm,
}: AlertProps) => (
  <AlertDialog.Root>
    <AlertDialog.Trigger asChild>{alertTrigger}</AlertDialog.Trigger>
    <AlertDialog.Portal>
      <AlertDialog.Overlay className="AlertDialogOverlay" />
      <AlertDialog.Content className="AlertDialogContent">
        <AlertDialog.Title className="AlertDialogTitle">
          {title}
        </AlertDialog.Title>
        <AlertDialog.Description className="AlertDialogDescription">
          {content}
        </AlertDialog.Description>
        <div style={{ display: "flex", gap: 25, justifyContent: "flex-end" }}>
          <AlertDialog.Cancel asChild>
            <button className="Button cancel">Cancel</button>
          </AlertDialog.Cancel>
          <AlertDialog.Action asChild onClick={onConfirm}>
            <button className="Button confirm">Confirm</button>
          </AlertDialog.Action>
        </div>
      </AlertDialog.Content>
    </AlertDialog.Portal>
  </AlertDialog.Root>
);
export default AlertDialogBasic;
