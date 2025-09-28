import { SpotifyFooter } from "../../components/SpotifyFooter";
import { SpotifyHeader } from "../../components/SpotifyHeader";
import MasterPage from "../../master_component/Template";
import useSidebarStore from "../../state_management/useSidebarToggle";
import MainContent from "../../styledComponents/MainContent";
import AlbumImage from "../../styledComponents/AlbumImage";
import SongDetailTitle from "../../styledComponents/SongDetailTitle";
import SongDetailestTitle from "../../styledComponents/SongDetailestTitle";
import SongTitle from "../../styledComponents/SongTitle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faPlayCircle,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Artist } from "../../model/ArtistModel";
import AddToPlaylistModal from "../../components/AddToPlaylistModal";
import HorizontalLine from "../../styledComponents/HorizontalLine";
import useMusicStore from "../../state_management/playingSongStore";
import { PlaylistDetail } from "../../model/PlayListDetailModel";

export default function TrackPage() {
  const { id } = useParams();
  const [pageInfo, setPageInfo] = useState({
    artistTracks: null as Song[] | null,
    track: null as Song | null,
    album: null as Album | null,
    creator: null as Artist | null,
    discography: null as Album[] | null,
    albumTrack: null as Song[] | null,
    playlistDetail : null as PlaylistDetail | null,
  });


  const updatePageInfo = (newInfo: Partial<typeof pageInfo>) => {
    setPageInfo(prevState => ({
      ...prevState,
      ...newInfo,
    }));
  };


  async function GetUserAlbum() {
    const response = await axios.get<WebResponse<Album[]>>(
      `http://localhost:8888/album/getalbumbyuserid/${pageInfo.creator?.user.id}`
    );
    updatePageInfo({discography : response.data.data});
  }

  async function GetTrack() {
    const response = await axios.get(
      `http://localhost:8888/song/getsongbysongid/${id}`
    );
    updatePageInfo({track : response.data.data});
  }

  async function GetAlbum() {
    const response = await axios.get<WebResponse<Album>>(
      `http://localhost:8888/album/getalbumbyalbumid/${pageInfo.track?.albumid}`
    );
    updatePageInfo({album : response.data.data});
  }

  async function GetArtist() {
    const response = await axios.get<WebResponse<Artist>>(
      `http://localhost:8888/artist/${pageInfo.album?.userid}`
    );
    updatePageInfo({creator : response.data.data});
  }

  async function GetArtistSongs() {
    const response = await axios.get<WebResponse<Song[]>>(
      `http://localhost:8888/song/getsongbyuserid/${pageInfo.album?.userid}`
    );

    const fetchedSongs = response.data.data || [];
    const topSongs = fetchedSongs
      ?.sort((a, b) => Number(b.totallistened) - Number(a.totallistened))
      .slice(0, 5);
      updatePageInfo({artistTracks : topSongs});
    }

  async function GetAlbumTrack() {
    const response = await axios.get<WebResponse<Song[]>>(
      `http://localhost:8888/song/getsongbyalbumid/${pageInfo.album?.id}`
    );
    updatePageInfo({albumTrack : response.data.data});
  }
  
  const [isModalPlaylistVisible, setIsModalPlaylistVisible] = useState(false);
  function toggleModal() {
    setIsModalPlaylistVisible(!isModalPlaylistVisible);
  }


  useEffect(() => {
    GetTrack();
  }, [id]);

  useEffect(() => {
    GetAlbum();
  }, [pageInfo.track]);

  useEffect(() => {
    GetArtist();
    GetAlbumTrack();
    GetArtistSongs();
  }, [pageInfo.album]);

  useEffect(() => {
    GetUserAlbum();
    if(pageInfo.album && pageInfo.creator && pageInfo.track){

      const PlaylistDetail: PlaylistDetail = {
        date: "",
        album: pageInfo.album,
        artist: pageInfo.creator,
        songs: pageInfo.track,
        user: pageInfo.creator?.user
      };
      updatePageInfo({playlistDetail : PlaylistDetail})
    }
  }, [pageInfo.creator]);

  const isMusicDetailsVisible = useSidebarStore(
    (state) => state.isMusicDetailsVisible
  );

  const {deleteAllFromQueue, addToQueue, playNext, setPlaying} = useMusicStore();
  async function AddToQueueClick(){
    deleteAllFromQueue()
    if(pageInfo.playlistDetail)
    addToQueue(pageInfo.playlistDetail)
    playNext()
    setPlaying(false)
    setPlaying(true)
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
              <div className="vw-10 p-20 mr-15">
                <AlbumImage
                  src={`http://localhost:8888/album/picture/${pageInfo.album?.image}`}
                />
              </div>
              <div className="column wpercent80">
                <SongDetailTitle>Song</SongDetailTitle>
                <p className="fs-50 b700">{pageInfo.track?.name}</p>
                <p
                  style={{ color: "white", opacity: "0.8" }}
                  className="b500 fs-14 "
                >
                  {pageInfo.creator?.user.name} •
                  {pageInfo.discography?.map((dis) => {
                    if (dis.id === pageInfo.track?.albumid) {
                      return <span> {dis.name}</span>;
                    }
                  })} • {pageInfo.album?.uploadDate.slice(0, 4)} • {pageInfo.track?.duration} • {" "}
                  {pageInfo.track?.totallistened}
                </p>
              </div>
            </div>

            <div className="row center">
              <div className="wpercent90">
                <br />

                <div className="row wpercent100">
                  <FontAwesomeIcon
                    icon={faPlayCircle}
                    className="green fs-40 mr-20"
                    onClick={AddToQueueClick}
                  />
                  <FontAwesomeIcon icon={faPlusCircle} className="fs-40" onClick={toggleModal}/>
                </div>

                <br />
                <SongDetailestTitle>Popular Tracks By</SongDetailestTitle>
                <SongTitle>{pageInfo.creator?.user.name}</SongTitle>

                <div className="row wpercent100 between mt-10">
                  <div className="row between">
                    <p className="fs-10" style={{ opacity: 0.8 }}>
                      #
                    </p>

                    <div className="vw-3 sh-3 mx-10"></div>
                    <p className="fs-12 ">Title</p>
                  </div>
                  <p className="fs-12 pl-100">Total Song Listened</p>
                  <FontAwesomeIcon icon={faClock} className="fs-20 mr-20" />
                </div>
                <div className="vw-82 mb-20">
                <HorizontalLine></HorizontalLine>
                </div>
                {pageInfo.artistTracks?.map((track, index) => (
                  <Link to={`/Track/${track.id}`}>
                    <div className="row wpercent100 between mt-10">
                      <div className="row vw-20" style={{alignItems:"center"}}>
                        <p className="fs-10 mr-5" style={{ opacity: 0.8 }}>
                          {index + 1}
                        </p>
                        <div className="vw-3 sh-3 mx-10 mr-15">
                          {pageInfo.discography?.map((dis) => {
                            if (dis.id === track.albumid) {
                              return (
                                <AlbumImage
                                  src={`http://localhost:8888/album/picture/${dis.image}`}
                                />
                              );
                            }
                          })}
                        </div>
                        <p className="fs-12">{track.name}</p>
                      </div>

                      <p className="fs-12 "> {track?.totallistened}</p>
                      <p className="fs-12 mr-15">{track.duration}</p>
                    </div>
                  </Link>
                ))}

                <br />
                <br />
                <br />
                <Link to={`/Album/${pageInfo.album?.id}`}>
                  <div
                    className="bg-gray wpercent100 row center"
                    style={{ borderRadius: "5px" }}
                  >
                    <div className="vw-4 sh-4 p-10">
                      <AlbumImage
                        src={`http://localhost:8888/album/picture/${pageInfo.album?.image}`}
                      />
                    </div>
                    <div className="column wpercent90">
                      <SongDetailestTitle>
                        From this{" "}
                        {pageInfo.discography?.map((dis) => {
                          if (dis.id === pageInfo.track?.albumid) {
                            return <span>{pageInfo.album?.type}</span>;
                          }
                        })}
                      </SongDetailestTitle>
                      {pageInfo.discography?.map((dis) => {
                        if (dis.id === pageInfo.track?.albumid) {
                          return <SongTitle>{pageInfo.album?.name}</SongTitle>;
                        }
                      })}
                    </div>
                  </div>
                </Link>
                {pageInfo.albumTrack?.map((song, index) => (
                  <Link to={`/Track/${song.id}`}>
                    <div className="row wpercent90 between ml-35 mt-10">
                      <div className="row between">
                        <p className="fs-10" style={{ opacity: 0.8 }}>
                          {index + 1}
                        </p>
                        <div className="vw-3 sh-3 mx-10"></div>
                        <p className="fs-12">{song?.name}</p>
                      </div>
                      <p className="fs-12">{song?.duration}</p>
                    </div>
                  </Link>
                ))}
                <br />
                <br />
                <br />
                <div style={{ position: "relative", left: "-18vw" }}>
                  <SpotifyFooter />
                </div>
              </div>
              {isModalPlaylistVisible && <AddToPlaylistModal onClose={toggleModal} songIdd={id}/>}
            </div>
          </MainContent>
        </>
      }
    />
  );
}
