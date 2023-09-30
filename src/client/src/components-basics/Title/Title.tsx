import "./Title.scss";
type TitleProps = {
  title: string;
};
export default function Title({ title }: TitleProps) {
  return (
    <div className="title-container">
      <h2 className="title">{title}</h2>
    </div>
  );
}
