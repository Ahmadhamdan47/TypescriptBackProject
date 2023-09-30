import "./Button.scss";

type ButtonProps = {
  title: string;
  onClick?: () => void;
  buttonlogo: JSX.Element;
};

const ButtonBasic = ({ title, onClick, buttonlogo }: ButtonProps) => (
  <div className="button-container" onClick={onClick}>
    {buttonlogo}
    {title}
  </div>
);

export default ButtonBasic;
