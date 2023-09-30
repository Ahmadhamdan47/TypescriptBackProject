import * as Checkbox from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";
import "./Checkbox.scss";

const CheckboxBasic = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) => (
  <form>
    <div className="checkbox-container">
      <Checkbox.Root
        className="CheckboxRoot"
        checked={checked}
        onCheckedChange={onChange}
        id="c1"
      >
        <Checkbox.Indicator className="CheckboxIndicator">
          <CheckIcon />
        </Checkbox.Indicator>
      </Checkbox.Root>
    </div>
  </form>
);

export default CheckboxBasic;
