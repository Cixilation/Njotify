import {
  faHome,
  faLayerGroup,
  faList,
  faMusic,
  faPlus,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DarkGrayBackground from "../styledComponents/DarkGrayBackground";
import SongDetailTitle from "../styledComponents/SongDetailTitle";
import { PlaylistTrack } from "./QueueingTrack";
import useNavigationStore from "../state_management/useNaviagtionStore";
import { Link } from "react-router-dom";
import { useCurrentUserStore } from "../state_management/currentUser";
import CreatePlayListModal from "./CreatePlaylistModal";
import { useEffect, useState } from "react";
import axios from "axios";

export function PlaylistAndNavigationComponent() {
  const activeSection = useNavigationStore((state) => state.activeSection);
  const {setActiveSection} = useNavigationStore();
  const current_user = useCurrentUserStore((state) => state.current_user);
  const [playlist, setPlaylist] = useState<Playlist[] | null>(null);
  const [isModalPlaylistVisible, setIsModalPlaylistVisible] = useState(false);
  const handleSectionClick = (section: "home" | "search" | "your-posts") => {
    setActiveSection(section);
  };


  function toggleModal() {
    setIsModalPlaylistVisible(!isModalPlaylistVisible);
  }
  

  useEffect(() => {
    const getUserPlaylist = async () => {
      const response = await axios.get<WebResponse<Playlist[]>>(`http://localhost:8888/playlist/getuserplaylist/${current_user?.id}`)
      setPlaylist(response.data.data)
    };
    getUserPlaylist();
  }, [current_user]);


  return (
    <div className="left">
      <div className=" vh-100 w-auto">
        <DarkGrayBackground>
          <div className="column h-auto vw-18">
            <Link to="/Home">
              <div
                className={`row ${activeSection === "home" ? "bold-text" : ""} mt-10`}
                style={{ alignItems: "center" }}
                onClick={() => handleSectionClick("home")}
              >
                <FontAwesomeIcon
                  icon={faHome}
                  className="fs-18 white p-15"
                  style={{ margin: "0 10px", opacity: "0.7" }}
                />
                <div className="row">
                  <p
                    className={`white fs-15 ${activeSection === "home" ? "b700" : ""}`}
                  >
                    Home
                  </p>
                </div>
              </div>
            </Link>
            <Link to="/Search">
              <div
                className={`row ${activeSection === "search" ? "bold-text" : ""}`}
                style={{ alignItems: "center" }}
                onClick={() => handleSectionClick("search")}
              >
                <FontAwesomeIcon
                  icon={faSearch}
                  className="fs-18 white p-15"
                  style={{ margin: "0 10px", opacity: "0.7" }}
                />
                <div className="row">
                  <p
                    className={`white fs-15 ${activeSection === "search" ? "b700" : ""}`}
                  >
                    Search
                  </p>
                </div>
              </div>
            </Link>
            {current_user?.role == "Artist" && (
                <>
                  <Link to={`/YourPost/${current_user.id}`}>
                    <div
                      className={`row ${activeSection === "your-posts" ? "bold-text" : ""} mb-10`}
                      style={{ alignItems: "center" }}
                      onClick={() => handleSectionClick("your-posts")}
                    >
                      <FontAwesomeIcon
                        icon={faMusic}
                        className="fs-18 white p-15"
                        style={{ margin: "0 10px", opacity: "0.7" }}
                      />
                      <div className="row">
                        <p
                          className={`white fs-15 ${activeSection === "your-posts" ? "b700" : ""}`}
                        >
                          Your Posts
                        </p>
                      </div>
                    </div>
                  </Link>
                </>
              )}
          </div>
        </DarkGrayBackground>
        <DarkGrayBackground className="mt-6">
          <div className="vh-85">
            <div className="vw-18 column my-10">
              <div className="row between">
                <div className="row">
                  <FontAwesomeIcon
                    icon={faLayerGroup}
                    className="fs-18 white"
                    style={{ margin: "0 10px", opacity: "0.7" }}
                  />
                  <div className="row" style={{ alignItems: "center" }}>
                    <SongDetailTitle>Your Library</SongDetailTitle>
                  </div>
                </div>
                <div className="row" onClick={toggleModal}>
                  <FontAwesomeIcon
                    icon={faPlus}
                    className="fs-15 white"
                    style={{ margin: "0 10px", opacity: "0.7" }}
                  />
                </div>
              </div>
            </div>
            <div className="row between">
              <FontAwesomeIcon
                icon={faSearch}
                className="fs-15 white"
                style={{ margin: "0 10px", opacity: "0.7" }}
              />

              <div className="row" style={{ alignItems: "center" }}>
                <div className="row">
                  <SongDetailTitle>Recent</SongDetailTitle>
                </div>
                <FontAwesomeIcon
                  icon={faList}
                  className="fs-15 white"
                  style={{ margin: "0 10px", opacity: "0.7" }}
                />
              </div>
            </div>
            <div className="column ml-5 my-10">
            {playlist?.map((playlist) => (
              <PlaylistTrack playlist={playlist}/>
            ))}
            </div>
          </div>
        </DarkGrayBackground>
      </div>
      {isModalPlaylistVisible && <CreatePlayListModal onClose={toggleModal} />}
    </div>
  );
}
