import { SpotifyFooter } from "../../components/SpotifyFooter";
import { SpotifyHeader } from "../../components/SpotifyHeader";
import MasterPage from "../../master_component/Template";
import useSidebarStore from "../../state_management/useSidebarToggle";
import MainContent from "../../styledComponents/MainContent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faPlayCircle,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";
import AlbumImage from "../../styledComponents/AlbumImage";
import SongTitle from "../../styledComponents/SongTitle";
import SongDetailTitle from "../../styledComponents/SongDetailTitle";
import ArtistImage from "../../styledComponents/ArtistImage";
import { GalleryAlbumPiece } from "../../components/HomeGalleryPiece";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Artist } from "../../model/ArtistModel";
import HorizontalLine from "../../styledComponents/HorizontalLine";
import useMusicStore from "../../state_management/playingSongStore";
import { PlaylistDetail } from "../../model/PlayListDetailModel";

export default function AlbumPage() {
  const [album, setAlbum] = useState<Album | null>(null);
  const [creator, setCreator] = useState<Artist | null>(null);
  const [albumTrack, setAlbumTrack] = useState<Song[] | null>(null);
  const [disography, setDisography] = useState<Album[] | null>(null);


  const isMusicDetailsVisible = useSidebarStore(
    (state) => state.isMusicDetailsVisible
  );
  const { id } = useParams();

  async function GetAlbum() {
    const response = await axios.get<WebResponse<Album>>(
      `http://localhost:8888/album/getalbumbyalbumid/${id}`
    );
    setAlbum(response.data.data);
  }

  async function GetArtist() {
    const response = await axios.get<WebResponse<Artist>>(
      `http://localhost:8888/artist/${album?.userid}`
    );
    setCreator(response.data.data);
  }
  async function GetAlbumTrack() {
    const response = await axios.get<WebResponse<Song[]>>(
      `http://localhost:8888/song/getsongbyalbumid/${album?.id}`
    );
    setAlbumTrack(response.data.data);
  }
  
  async function GetUserAlbum() {
    const response = await axios.get<WebResponse<Album[]>>(
      `http://localhost:8888/album/getalbumbyuserid/${creator?.user.id}`
    );
    setDisography(response.data.data);
  }
  useEffect(() => {
    GetAlbum();
  }, [id]);

  useEffect(() => {
    GetArtist()
    GetAlbumTrack()
  }, [album]);
  
  useEffect(() =>{
    GetUserAlbum()
  }, [creator])
  const { deleteAllFromQueue, addToQueue } = useMusicStore();
  async function AddToQueueClick() {
    deleteAllFromQueue();
    if (albumTrack && creator && album) {
      albumTrack.forEach((track) => {
          const playlistDetail: PlaylistDetail = {
            date: "", 
            album: album,
            artist: creator,
            songs: track,
            user: creator?.user,
          };
          addToQueue(playlistDetail);
      })
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
            <br />
            <div className=" center" style={{ position: "relative" }}>
              <div className="wpercent100 vh-25 bg-black p-25 "></div>
              <div
                style={{
                  position: "absolute",
                  bottom: "0",
                  left: "3vw",
                  top: "18%",
                }}
              >
                <div className="row">
                  <div className="vw-10 sh-10 mr-40">
                    <AlbumImage
                      src={`http://localhost:8888/album/picture/${album?.image}`}
                      alt=""
                    />
                  </div>

                  <div className="column wpercent70 mt-20">
                    <SongDetailTitle>{album?.type}</SongDetailTitle>
                    <p className="fs-50 b600 mb-5">{album?.name}</p>
                    <div className="row" style={{ alignItems: "center" }}>
                      <div className="vw-2 sh-2 mr-15">
                        <ArtistImage
                          src={`http://localhost:8888/profile_pictures/${creator?.user.profilepicture}`}
                        />
                      </div>
                      <p
                        style={{ color: "white", opacity: "0.8" }}
                        className="b500 fs-14 "
                      >
                        {creator?.user.name} • {album?.uploadDate.slice(0, 4)} •  {albumTrack?.length} songs • {album?.totalduration}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <br />
            <div className="row center">
              <div className="wpercent90">
                <div className="row wpercent100">
                  <FontAwesomeIcon
                    icon={faPlayCircle}
                    className="green fs-40 mr-20"
                    onClick={AddToQueueClick}
                  />
                  <FontAwesomeIcon icon={faPlusCircle} className="fs-40" />
                </div>

                <div className="row wpercent100 between mt-10">
                  <div className="row between">
                    <p className="fs-10" style={{ opacity: 0.8 }}>
                      #
                    </p>

                    <div className="vw-3 sh-3 mx-10"></div>
                    <p className="fs-12">Title</p>
                  </div>
                  <p className="fs-12">Total Song Listened</p>
                  <FontAwesomeIcon icon={faClock} className="fs-20 mr-20" />
                </div>
                <div className="vw-82 mb-10">
                <HorizontalLine></HorizontalLine>
                </div>
                {albumTrack?.map((track, index) => (
                  <Link to={`/Track/${track.id}`}>
                    <div className="row wpercent100 between mt-10">
                      <div className="row between">
                        <p className="fs-10 mr-5" style={{ opacity: 0.8 }}>
                          {index + 1}
                        </p>
                        <div className="vw-3 sh-3 mx-10">
                          <AlbumImage src={`http://localhost:8888/album/picture/${album?.image}`}/>
                        </div>
                        <p className="fs-12">{track.name}</p>
                      </div>

                      <p className="fs-12 ">{track.totallistened}</p>
                      <p className="fs-12 mr-15">{track.duration}</p>
                    </div>
                  </Link>
                ))}

                <br />
                <br />
                <SongTitle>Discography</SongTitle>
                <br />
                <div className="wpercent100" style={{ overflowX: "scroll" }}>
                  <div className="grid6">
                    {disography?.map((dis) => (
                      <GalleryAlbumPiece album={dis} />
                    ))}
                  </div>
                </div>

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
