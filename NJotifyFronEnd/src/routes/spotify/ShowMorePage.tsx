import { Link, useParams } from "react-router-dom";
import {
  GalleryAlbumPiece,
  GalleryPlaylistPiece,
  SongPiece,
} from "../../components/HomeGalleryPiece";
import { SpotifyHeader } from "../../components/SpotifyHeader";
import MasterPage from "../../master_component/Template";
import useSidebarStore from "../../state_management/useSidebarToggle";
import MainContent from "../../styledComponents/MainContent";
import SongTitle from "../../styledComponents/SongTitle";
import { useEffect, useState } from "react";
import axios from "axios";
import { User } from "../../model/UserModel";
import SongDetailTitle from "../../styledComponents/SongDetailTitle";
import ArtistImage from "../../styledComponents/ArtistImage";
import { PlaylistDetail } from "../../model/PlayListDetailModel";

export default function ShowMorePage() {
  const { type } = useParams<{ type: string }>();
  const { userid } = useParams<{ userid: string }>();

  const [morePageInfo, setMorePageInfo] = useState({
    following: null as User[] | null,
    follower: null as User[] | null,
    profileUser: null as User | null,
    publicPlaylist: null as Playlist[] | null,
    songPlaylistDetail: null as PlaylistDetail[] | null,
    Album: null as Album[] | null,
  });

  const updateMoreInfo = (newUserInfo: Partial<typeof morePageInfo>) => {
    setMorePageInfo((prevState) => ({
      ...prevState,
      ...newUserInfo,
    }));
  };

  useEffect(() => {
    async function fetchData() {
      if (type === "Follower") {
        const response = await axios.get<WebResponse<User[]>>(
          `http://localhost:8888/follow/getfollower/${userid}`
        );
        if (response.data.data != null) {
          updateMoreInfo({ follower: response.data.data });
        }
      }

      if (type === "Following") {
        const response = await axios.get<WebResponse<User[]>>(
          `http://localhost:8888/follow/getfollowing/${userid}`
        );
        if (response.data.data != null) {
          updateMoreInfo({ following: response.data.data });
        }
      }

      if (type === "Playlist") {
        const response = await axios.get<WebResponse<Playlist[]>>(
          `http://localhost:8888/playlist/getpublicplaylist/${userid}`
        );
        if (response.data.data != null) {
          updateMoreInfo({ publicPlaylist: response.data.data });
        }
      }

      if (type === "Album") {
        const response = await axios.get<WebResponse<Album[]>>(
          `http://localhost:8888/album/getallalbum`
        );
        updateMoreInfo({ Album: response.data.data });
      }

      if (type === "Song") {
        const response = await axios.get<WebResponse<PlaylistDetail[]>>(
          `http://localhost:8888/song/getallsong`
        );
        updateMoreInfo({ songPlaylistDetail: response.data.data });
      }

      if (type === "Recently Played Album") {
        const response = await axios.get<WebResponse<Album[]>>(
          `http://localhost:8888/album/getallalbum`
        );
        const songresponse = await axios.get<WebResponse<PlaylistDetail[]>>(
          `http://localhost:8888/song/getlastplayedtrack/${userid}`
        );
        const uniqueTracks = songresponse.data.data.filter(
          (track, index, self) =>
            index === self.findIndex((t) => t.songs.id === track.songs.id)
        );
        const filteredAlbums = response.data.data.filter((album) =>
          uniqueTracks.some((track) => track.album.id === album.id)
        );
        updateMoreInfo({ Album: filteredAlbums });
      }

      // Fetch user profile information if needed
      const userResponse = await axios.get<WebResponse<User>>(
        `http://localhost:8888/user/${userid}`
      );
      if (userResponse.data.data != null) {
        setMorePageInfo((prevState) => ({
          ...prevState,
          profileUser: userResponse.data.data,
        }));
      }
    }

    fetchData();
  }, [type, userid]);

  const isMusicDetailsVisible = useSidebarStore(
    (state) => state.isMusicDetailsVisible
  );

  return (
    <MasterPage
      component={
        <>
          <MainContent sideBar={isMusicDetailsVisible}>
            <div className="row center">
              <div className="wpercent90">
                <SpotifyHeader />
                <br />
                <br />
                <p className="fs-40 b600">{type}</p>
                <br />
                <SongTitle>
                  {type == "Album"
                    ? "Recommendation of Albums"
                    : type == "Song"
                      ? "Browsing all songs"
                      : `More ${type}s of ${morePageInfo.profileUser?.name}`}
                </SongTitle>

                <br />
                <div className="grid4">
                  {type == "Follower" &&
                    morePageInfo.follower?.map((fol) => (
                      <Link to={`/Profile/${fol.id}`}>
                        <div className="mr-10">
                          <div className="vw-12">
                            <ArtistImage
                              src={`http://localhost:8888/profile_pictures/${fol.profilepicture}`}
                            />
                          </div>
                          <SongTitle>{fol.name}</SongTitle>
                          <SongDetailTitle>Profile</SongDetailTitle>
                        </div>
                      </Link>
                    ))}
                  {type == "Following" &&
                    morePageInfo.following?.map((fol) => (
                      <Link to={`/Profile/${fol.id}`}>
                        <div className="mr-10">
                          <div className="vw-12">
                            <ArtistImage
                              src={`http://localhost:8888/profile_pictures/${fol.profilepicture}`}
                            />
                          </div>
                          <SongTitle>{fol.name}</SongTitle>
                          <SongDetailTitle>Profile</SongDetailTitle>
                        </div>
                      </Link>
                    ))}
                  {type == "Playlist" &&
                    morePageInfo.publicPlaylist?.map((pl) => (
                      <GalleryPlaylistPiece key={pl.id} playlist={pl} />
                    ))}
                  {type == "Album" &&
                    morePageInfo.Album?.map((album) => (
                      <GalleryAlbumPiece key={album.id} album={album} />
                    ))}
                  {type == "Recently Played Album" &&
                    morePageInfo.Album?.map((album) => (
                      <GalleryAlbumPiece key={album.id} album={album} />
                    ))}
                  {type == "Song" &&
                    morePageInfo.songPlaylistDetail?.map((detail) => (
                      <SongPiece key={detail.songs.id} playlist={detail} />
                    ))}
                </div>
              </div>
            </div>
          </MainContent>
        </>
      }
    />
  );
}
