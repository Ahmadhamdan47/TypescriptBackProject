import * as RadioGroup from "@radix-ui/react-radio-group";
import "./Radio.scss";
type RadioProps = {
  choiceOne: string;
  choiceTwo: string;
  onValueChange: (value: string) => void;
};
const RadioBasic = ({ choiceOne, choiceTwo, onValueChange }: RadioProps) => (
  <form>
    <RadioGroup.Root
      className="RadioGroupRoot"
      defaultValue={choiceOne}
      aria-label="View density"
      onValueChange={onValueChange}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <RadioGroup.Item className="RadioGroupItem" value={choiceOne} id="r1">
          <RadioGroup.Indicator className="RadioGroupIndicator" />
        </RadioGroup.Item>
        <label className="Label" htmlFor="r1">
          {choiceOne}
        </label>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <RadioGroup.Item className="RadioGroupItem" value={choiceTwo} id="r3">
          <RadioGroup.Indicator className="RadioGroupIndicator" />
        </RadioGroup.Item>
        <label className="Label" htmlFor="r3">
          {choiceTwo}
        </label>
      </div>
    </RadioGroup.Root>
  </form>
);

export default RadioBasic;
