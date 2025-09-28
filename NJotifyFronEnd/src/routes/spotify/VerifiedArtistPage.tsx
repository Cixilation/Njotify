import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SpotifyHeader } from "../../components/SpotifyHeader";
import MasterPage from "../../master_component/Template";
import useSidebarStore from "../../state_management/useSidebarToggle";
import MainContent from "../../styledComponents/MainContent";
import { faPlayCircle, faUserCheck } from "@fortawesome/free-solid-svg-icons";
import GreyButton from "../../styledComponents/GrayButton";
import SongTitle from "../../styledComponents/SongTitle";
import AlbumImage from "../../styledComponents/AlbumImage";
import {
  GalleryAlbumPiece,
  GalleryPlaylistPiece,
} from "../../components/HomeGalleryPiece";
import { SpotifyFooter } from "../../components/SpotifyFooter";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useCurrentUserStore } from "../../state_management/currentUser";
import { Artist } from "../../model/ArtistModel";
import { User } from "../../model/UserModel";
import ToggleButton from "../../components/CanBeActivatedButtonComponent";
import useMusicStore from "../../state_management/playingSongStore";
import { PlaylistDetail } from "../../model/PlayListDetailModel";

export default function VerifiedArtistPage() {
  const { id } = useParams();
  const { current_user } = useCurrentUserStore();
  const navigate = useNavigate();

  const [pageInfo, setPageInfo] = useState({
    creator: null as Artist | null,
    followingText: "Follow",
    artistTracks: null as Song[] | null,
    discography: null as Album[] | null,
    filter: "Album",
    featuredPlaylist: null as Playlist[] | null,
  });

  const updatePageInfo = (newInfo: Partial<typeof pageInfo>) => {
    setPageInfo((prevState) => ({
      ...prevState,
      ...newInfo,
    }));
  };

  const isMusicDetailsVisible = useSidebarStore(
    (state) => state.isMusicDetailsVisible
  );

  async function getPlaylistFromThisArtist() {
    const response = await axios.get<WebResponse<Playlist[]>>(
      `http://localhost:8888/playlist/getfeaturedplaylist/${id}`
    );
    const shuffledPlaylists = response.data.data
      .slice()
      .sort(() => Math.random() - 0.5);
    const featuredPlaylists = shuffledPlaylists.slice(0, 6);
    updatePageInfo({ featuredPlaylist: featuredPlaylists });
  }

  const fetchArtistData = async () => {
    try {
      const artistResponse = await axios.get<WebResponse<Artist>>(
        `http://localhost:8888/artist/${id}`
      );
      if (artistResponse.data.code !== 200) {
        navigate(`/Profile/${id}`);
      }
      updatePageInfo({ creator: artistResponse.data.data });

      const albumResponse = await axios.get<WebResponse<Album[]>>(
        `http://localhost:8888/album/getalbumbyuserid/${id}`
      );
      console.log(albumResponse)
      updatePageInfo({ discography: albumResponse.data.data });

      const songResponse = await axios.get<WebResponse<Song[]>>(
        `http://localhost:8888/song/getsongbyuserid/${id}`
      );
      const fetchedSongs = songResponse.data.data || [];
      const topSongs = fetchedSongs
        .sort((a, b) => Number(b.totallistened) - Number(a.totallistened))
        .slice(0, 5);
      updatePageInfo({ artistTracks: topSongs });

      const followerResponse = await axios.get<WebResponse<User[]>>(
        `http://localhost:8888/follow/getfollower/${id}`
      );
      const currentUserFollowing = followerResponse.data.data.some(
        (user) => user.id === current_user?.id
      );
      updatePageInfo({
        followingText: currentUserFollowing ? "Unfollow" : "Follow",
      });
    } catch (error) {
      console.error("Error fetching artist data", error);
    }
  };

  useEffect(() => {
    if (id === current_user?.id) {
      window.location.replace(`/Profile/${current_user?.id}`);
    }
    fetchArtistData();
    getPlaylistFromThisArtist();
  }, [id]);

  const { deleteAllFromQueue, addToQueue } = useMusicStore();
  async function AddToQueueClick() {
    deleteAllFromQueue();
    if (pageInfo.artistTracks && pageInfo.artistTracks.length > 0) {
      pageInfo.artistTracks.forEach((track) => {
        const album = pageInfo.discography?.find((album) => album.id === track.albumid);
          if (album && pageInfo.creator) {
          const playlistDetail: PlaylistDetail = {
            date: "", 
            album: album,
            artist: pageInfo.creator,
            songs: track,
            user: pageInfo.creator?.user,
          };
          addToQueue(playlistDetail);
        } 
      });
    } 
  }

  const followToggle = async () => {
    try {
      if (pageInfo.followingText === "Follow") {
        await axios.post("http://localhost:8888/follow/create", {
          followerid: current_user?.id,
          followingid: id,
        });
        updatePageInfo({ followingText: "Unfollow" });
      } else {
        await axios.post("http://localhost:8888/follow/delete", {
          followerid: current_user?.id,
          followingid: id,
        });
        updatePageInfo({ followingText: "Follow" });
      }
    } catch (error) {
      console.error("Error toggling follow", error);
    }
  };

  const handleFilterChange = (newFilter: string) => {
    updatePageInfo({ filter: newFilter });
  };

  return (
    <MasterPage
      component={
        <>
          <MainContent sideBar={isMusicDetailsVisible}>
            <div className="row center">
              <div className="wpercent100">
                <div className="center" style={{ position: "relative" }}>
                  <div
                    className="wpercent90 h-auto"
                    style={{ position: "absolute", top: "0", left: "3vw" }}
                  >
                    <SpotifyHeader />
                  </div>
                  <img
                    src={`http://localhost:8888/banner/${pageInfo.creator?.banner}`}
                    alt=""
                    className="wpercent100 vh-35"
                  />
                  <div
                    style={{ position: "absolute", bottom: "0", left: "1vw" }}
                  >
                    <div className="row m-10 vw-9 between">
                      <FontAwesomeIcon icon={faUserCheck} />
                      <p
                        className="b300"
                        style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}
                      >
                        Verified Artist
                      </p>
                    </div>
                    <p
                      className="fs-32 b600 mb-20"
                      style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}
                    >
                      {pageInfo.creator?.user.name}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="row center">
              <div className="wpercent90">
                <br />
                <div className="row wpercent100 between">
                  <FontAwesomeIcon
                    icon={faPlayCircle}
                    className="green fs-40"
                    onClick={AddToQueueClick}
                  />
                  <div className="vw-10">
                    <GreyButton onClick={followToggle}>
                      {pageInfo.followingText}
                    </GreyButton>
                  </div>
                </div>
                <br />
                <SongTitle>Popular</SongTitle>
                <div className="row wpercent100 between">
                  <div className="row between pr-100">
                    <p className="fs-10" style={{ opacity: 0.8 }}>
                      No.
                    </p>
                    <div className="vw-3 mx-10 "></div>
                    <p className="fs-12">Song Name</p>
                  </div>
                  <p className="fs-12 pl-100">ListeningCount</p>
                  <p className="fs-12">Total Song Listened</p>
                </div>
                <br />
                {pageInfo.artistTracks?.map((track, index) => (
                  <Link key={track.id} to={`/Track/${track.id}`}>
                    <div className="row wpercent100 between mt-10">
                      <div className="row vw-20">
                        <p className="fs-10 mr-5" style={{ opacity: 0.8 }}>
                          {index + 1}
                        </p>
                        <div className="vw-3 sh-3 mx-10 mr-15">
                          {pageInfo.discography?.map((dis) => {
                            if (dis.id === track.albumid) {
                              return (
                                <AlbumImage
                                  key={dis.id}
                                  src={`http://localhost:8888/album/picture/${dis.image}`}
                                />
                              );
                            }
                            return null;
                          })}
                        </div>
                        <p className="fs-12 ">{track.name}</p>
                      </div>
                      <p className="fs-12 "> {track?.totallistened}</p>
                      <p className="fs-12 mr-15">{track.duration}</p>
                    </div>
                  </Link>
                ))}
                <br />
                <SongTitle className="mb-20">Discography</SongTitle>
                <div className="row">
                  <div onClick={() => handleFilterChange("Album")}>
                    <ToggleButton
                      message="Albums"
                      isActivate={pageInfo.filter === "Album"}
                    />
                  </div>
                  <div onClick={() => handleFilterChange("Single")}>
                    <ToggleButton
                      message="Singles"
                      isActivate={pageInfo.filter === "Single"}
                    />
                  </div>
                  <div onClick={() => handleFilterChange("Ep")}>
                    <ToggleButton
                      message="Eps"
                      isActivate={pageInfo.filter === "Ep"}
                    />
                  </div>
                </div>
                <br />
                <div className="wpercent100" style={{ overflowX: "scroll" }}>
                  <div className="grid6">
                    {pageInfo.discography?.map((dis) => {
                      if (dis.type === pageInfo.filter) {
                        return <GalleryAlbumPiece key={dis.id} album={dis} />;
                      }
                      return null;
                    })}
                  </div>
                </div>
                <br />
                <br />
                <SongTitle>Featured Playlist</SongTitle>
                <div className="grid6">
                  {pageInfo.featuredPlaylist?.map((pl) => (
                    <GalleryPlaylistPiece playlist={pl} />
                  ))}
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
