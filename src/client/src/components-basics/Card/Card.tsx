import "./Card.scss";

type CardProps = {
  portrait: boolean;
  isSelected?: boolean;
  cardTitleContainer: JSX.Element;
  cardContentContainer: JSX.Element;
  cardActionsContainer: JSX.Element;
  color: string;
};

export default function CardBasic({
  portrait,
  isSelected,
  cardTitleContainer,
  cardContentContainer,
  cardActionsContainer,
  color,
}: CardProps) {
  return (
    <div
      className={
        portrait ? "cardBasicContainerPortrait" : "cardBasicContainerLandscape"
      }
      style={{
        borderLeft: isSelected && !portrait ? "10px solid black" : "none",
        borderTop: "10px solid" + color,
      }}
    >
      <div className="titleCard">{cardTitleContainer}</div>
      <div className="contentCard">{cardContentContainer}</div>
      <div className="actionCard">{cardActionsContainer}</div>
    </div>
  );
}
