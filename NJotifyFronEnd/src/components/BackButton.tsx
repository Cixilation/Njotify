import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import GreyButton from "../styledComponents/GrayButton";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

export default function BackButton() {
  return (
    <div className="vw-3">
      <GreyButton>
        <FontAwesomeIcon icon={faChevronLeft} className="py-4" />
      </GreyButton>
    </div>
  );
}
