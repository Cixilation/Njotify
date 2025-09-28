import GreyButton from "../styledComponents/GrayButton";
import GreenButton from "../styledComponents/GreenButton";

export default function ToggleButton({
  message,
  isActivate
}: {
  message: string;
  isActivate: boolean;
}) {
  return (
    <div className="vw-10">
      {isActivate == false && <GreyButton>{message}</GreyButton>}
      {isActivate == true && (
        <div className="vw-20">
          <GreenButton>{message}</GreenButton>
        </div>
      )}
    </div>
  );
}
