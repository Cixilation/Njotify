import DarkGrayBackground from "../styledComponents/SideBar";
import AlbumImage from "../styledComponents/AlbumImage";
import MusicLogo from "../assets/music.png";
import SongDetailTitle from "../styledComponents/SongDetailTitle";
import SongDetailestTitle from "../styledComponents/SongDetailestTitle";
import SongTitle from "../styledComponents/SongTitle";
import SmallLink from "../styledComponents/SmallLink";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisH,
  faMusic,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { QueueComponent } from "./QueueComponent";
import useSidebarStore from "../state_management/useSidebarToggle";
import { AdvertisementComponent } from "./AdvertisementComponent";
import { Link } from "react-router-dom";
import useMusicStore from "../state_management/playingSongStore";
import { QueueingTrack } from "./QueueingTrack";

export function MusicDetails() {
  const isQueueVisible = useSidebarStore((state) => state.isQueueVisible);
  const {
    isAdvertisementVisible,
    toggleMusicDetailsVisibility,
    toggleQueueVisibility,
  } = useSidebarStore();
  const isVisible = useSidebarStore((state) => state.isMusicDetailsVisible);
  const { currentSong, queue } = useMusicStore();

  const next = queue.slice(0, 1);

  return (
    <>
      <DarkGrayBackground isVisible={isVisible} className="right">
        <div className="vh-90 w-auto m-15 column m-auto">
          <div className="row between wpercent100 vh-4 top mb-20">
            <SongTitle className="fs-4">{currentSong?.user.name}</SongTitle>
            <div className="row between">
              <FontAwesomeIcon
                icon={faEllipsisH}
                className="fs-20 white"
                style={{ margin: "0 10px", opacity: "0.7" }}
              />
              <FontAwesomeIcon
                icon={faXmark}
                className="fs-18 white"
                style={{ margin: "0 10px", opacity: "0.7" }}
                onClick={toggleMusicDetailsVisibility}
              />
            </div>
          </div>
          <Link to={`/Track/${currentSong?.songs.id}`}>
            <div>
              <div className="vw-18 sh-18 mb-5">
                <AlbumImage
                  src={`http://localhost:8888/album/picture/${currentSong?.album?.image}`}
                  alt=""
                />
              </div>
              <div className="row between">
                <div>
                  <SongTitle>{currentSong?.songs.name}</SongTitle>
                  <SongDetailTitle>{currentSong?.user.name}</SongDetailTitle>
                </div>
              </div>
            </div>
          </Link>
          <br />

          <div
            style={{
              backgroundColor: "#333",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              overflow: "hidden",
              width: "18vw",
              objectFit: "cover",
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
              position: "relative",
              height: "45vh",
            }}
          >
            <img
              src={MusicLogo}
              style={{
                width: "100%",
                height: "25vh",
                aspectRatio: "1/1",
                objectFit: "cover",
              }}
            />
            <div
              style={{
                padding: "15px",
              }}
            >
              <SongTitle
                style={{
                  fontSize: "12px",
                  position: "absolute",
                  top: "15px",
                  left: "15px",
                }}
              >
                About the Artist
              </SongTitle>
              <SongTitle className="mb-10">{currentSong?.user.name}</SongTitle>
              <SongDetailestTitle>
                {currentSong?.artist?.description}
              </SongDetailestTitle>
            </div>
          </div>
          <br />

          {queue.length > 1 && (
            <div
              style={{
                backgroundColor: "#333",
              }}
              className="h-auto py-14"
            >
              <>
                <div className="row between px-15">
                  <p className="b600 fs-13 ">Next in queue</p>
                  <div className="hover" onClick={toggleQueueVisibility}>
                    <SmallLink className="b500 p-2 ">Open Queue</SmallLink>
                  </div>
                </div>
                <div className="row m-10">
                  <div className="center row">
                    <FontAwesomeIcon
                      icon={faMusic}
                      className="fs-10"
                      style={{ margin: "0 10px", opacity: "0.7" }}
                    />

                    <QueueingTrack playlistDetail={next[0]} />
                  </div>
                </div>
              </>
            </div>
          )}

          <br />
          <br />
          <br />
          <br />
        </div>
      </DarkGrayBackground>
      {isQueueVisible && <QueueComponent />}
      {isAdvertisementVisible && <AdvertisementComponent />}
    </>
  );
}
