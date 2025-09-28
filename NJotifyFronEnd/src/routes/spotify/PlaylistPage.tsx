import { SpotifyFooter } from "../../components/SpotifyFooter";
import { SpotifyHeader } from "../../components/SpotifyHeader";
import MasterPage from "../../master_component/Template";
import useSidebarStore from "../../state_management/useSidebarToggle";
import MainContent from "../../styledComponents/MainContent";
import MusicLogo from "../../assets/music.png";
import AlbumImage from "../../styledComponents/AlbumImage";
import SongDetailTitle from "../../styledComponents/SongDetailTitle";
import ArtistImage from "../../styledComponents/ArtistImage";
import SongDetailestTitle from "../../styledComponents/SongDetailestTitle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faEllipsis,
  faPauseCircle,
  faPlusCircle,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useToastStore } from "../../state_management/toastStore";
import { User } from "../../model/UserModel";
import HorizontalLine from "../../styledComponents/HorizontalLine";

export default function PlaylistPage() {
  const {id} = useParams();
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const { setMessage, setToastType, setShowToast } = useToastStore();
  const [creator, setCreator] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getPlaylistDetail = async () => {
      const response = await axios.get<WebResponse<Playlist>>(
        `http://localhost:8888/playlist/getplaylistsong/${id}`
      );
      setPlaylist(response.data.data);

      if (response.data.code == 200) {
        setToastType("Success");
      } else if (response.data.code === 400) {
        setToastType("Failed");
        setMessage(response.data.status);
        setShowToast(true);
        navigate("/Home");
      }
    };
    getPlaylistDetail();
  }, [id]);

  useEffect(() => {
    const getUser = async () => {
      const response = await axios.get<WebResponse<User>>(
        `http://localhost:8888/user/${playlist?.userid}`
      );
      setCreator(response.data.data);
    };
    getUser();
  }, [playlist]);

  const isMusicDetailsVisible = useSidebarStore(
    (state) => state.isMusicDetailsVisible
  );

  async function DeletePlaylist() {
    const response = await axios.post(
      `http://localhost:8888/playlist/delete/${playlist?.id}`
    );

    if (response.data.code === 200) {
      setToastType("Success");
    } else if (response.data.code === 502) {
      setToastType("Warning");
    } else if (response.data.code === 400) {
      setToastType("Failed");
    }
    setMessage(response.data.status);
    setShowToast(true);
    navigate("/Home");
  }

  async function DeleteTrack(songid: string) {
    const response = await axios.post(
      `http://localhost:8888/playlistDetail/delete`,
      {
        playlistid: id,
        songid: songid,
      }
    );
    setMessage(response.data.status);
    setShowToast(true);
    if (response.data.code === 200) {
      setToastType("Success");
      window.location.reload();
    } else if (response.data.code === 502) {
      setToastType("Warning");
    } else if (response.data.code === 400) {
      setToastType("Failed");
    }
  }
  return (
    <MasterPage
      component={
        <>
          <MainContent sideBar={isMusicDetailsVisible}>
            <div className="row center">
              <div className="wpercent90">
                <SpotifyHeader />
              </div>
            </div>

            <div className="bg-black wpercent100 row center">
              <div className="vw-10 p-20">
                <AlbumImage src={MusicLogo} />
              </div>
              <div className="column wpercent80">
                <SongDetailTitle>Playlist</SongDetailTitle>
                <p className="fs-50 b700">{playlist?.name}</p>
                <SongDetailestTitle className="mb-15">
                  {playlist?.description}
                </SongDetailestTitle>
                <div className="row " style={{ alignItems: "center" }}>
                  <div className="vw-2 sh-2 mr-15">
                    <ArtistImage
                      src={`http://localhost:8888/profile_pictures/${creator?.profilepicture}`}
                    />
                  </div>
                  <SongDetailTitle>
                    {creator?.name} • {playlist?.playlistdetail ? playlist.playlistdetail.length : 0} • {playlist?.duration}
                  </SongDetailTitle>
                </div>
              </div>
            </div>

            <div className="row center">
              <div className="wpercent90">
                <br />
                <div className="row between">
                  <div
                    className="row wpercent100"
                    style={{ alignItems: "center" }}
                  >
                    <FontAwesomeIcon
                      icon={faPauseCircle}
                      className="green fs-40 mr-20"
                    />
                    <FontAwesomeIcon
                      icon={faPlusCircle}
                      className="fs-20 mr-20"
                    />
                    <FontAwesomeIcon icon={faEllipsis} className="fs-20" />
                  </div>
                  <div className="column vw-10 center" onClick={DeletePlaylist}>
                    <FontAwesomeIcon icon={faTrash} className="fs-24 mb-5" />
                    <SongDetailestTitle>Delete Playlist</SongDetailestTitle>
                  </div>
                </div>
                <br />
                <div className="row wpercent100 between mt-10">
                  <div className="row wpercent100 between">
                    <div className="row between">
                      <p className="fs-10" style={{ opacity: 0.8 }}>
                        #
                      </p>

                      <div className="vw-3 sh-3 mx-10"></div>
                      <p className="fs-12 vw-15">Title</p>
                    </div>
                    <p className="fs-12 vw-10">Album</p>
                    <p className="fs-12 vw-5 ">Date added</p>
                    <FontAwesomeIcon
                      icon={faClock}
                      className="fs-20 mr-20 vw-5"
                    />
                  </div>
                  <FontAwesomeIcon icon={faTrash} className="fs-20" />
                </div>
                <div className="vw-82">
                <HorizontalLine></HorizontalLine>
                </div>
                {playlist?.playlistdetail && playlist?.playlistdetail.map((song, index) => (
                  <div className="row wpercent100 between mt-10">
                    <Link
                      to={`/Track/${song.songs.id}`}
                      className="wpercent100"
                    >
                      <div className="row wpercent100 between">
                        <div className="row between">
                          <p className="fs-10" style={{ opacity: 0.8 }}>
                            {index + 1}
                          </p>

                          <div className="vw-3 sh-3 mx-10">
                            <AlbumImage
                              src={`http://localhost:8888/album/picture/${song.album.image}`}
                            />
                          </div>
                          <div>
                            <p className="fs-12 vw-15">{song.songs.name}</p>
                            <p className="fs-10" style={{ opacity: "0.5" }}>
                              {song.user.name}
                            </p>
                          </div>
                        </div>
                        <p className="fs-12 vw-10">{song.album.name}</p>
                        <p className="fs-12 vw-5">{song.date}</p>
                        <p className="fs-12 vw-5">{song.songs.duration}</p>
                      </div>
                    </Link>
                    <FontAwesomeIcon
                      icon={faTrash}
                      className="fs-20"
                      onClick={() => DeleteTrack(song.songs.id)}
                    />
                  </div>
                ))}
                <br />
                <br />
                <br />

                <br />
                <div style={{ position: "relative", left: "-18vw" }}>
                  <SpotifyFooter />
                </div>
              </div>
            </div>
          </MainContent>
        </>
      }
    />
  );
}
