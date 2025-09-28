import DarkGrayBackground from "../styledComponents/DarkGrayBackground";

import SongTitle from "../styledComponents/SongTitle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faXmark } from "@fortawesome/free-solid-svg-icons";
import AlbumImage from "../styledComponents/AlbumImage";
import SongDetailTitle from "../styledComponents/SongDetailTitle";
import useMusicStore from "../state_management/playingSongStore";

export function AdvertisementComponent() {
  const { currentSong } = useMusicStore();
  return (
    <DarkGrayBackground className="right">
      <div className="vh-90 w-auto m-15 column m-auto">
        <div className="row between vw-18 vh-4 top mb-20">
          <p className="white fs-15 b500">Your music will continue after the break</p>
          <div className="hover">
            <FontAwesomeIcon
              icon={faXmark}
              className="fs-18 white"
              style={{ margin: "0 10px", opacity: "0.7" }}
            />
          </div>
        </div>
        <div className="vw-18 sh-21 mb-15">
          <AlbumImage  src={`http://localhost:8888/album/picture/${currentSong?.album?.image}`} alt="" />
        </div>
        <SongTitle>{currentSong?.songs.name}</SongTitle>
        <SongDetailTitle>{currentSong?.user.name}</SongDetailTitle>
        <br />
        <div className="bg-white v-18 py-15 py-5 px-10 row
         between" style={{borderRadius:"5px"}}>
          <span className="black">
            Learn More 
          </span>
            <FontAwesomeIcon
              icon={faChevronRight}
              className="fs-13 black"
              style={{ margin: "0 10px", opacity: "0.7" }}
            />
        </div>
      </div>
    </DarkGrayBackground>
  );
}
