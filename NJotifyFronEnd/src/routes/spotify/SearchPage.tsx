import useSidebarStore from "../../state_management/useSidebarToggle";
import MainContent from "../../styledComponents/MainContent";
import { SpotifyHeader } from "../../components/SpotifyHeader";
import MusicLogo from "../../assets/music.png";
import AlbumImage from "../../styledComponents/AlbumImage";
import MasterPage from "../../master_component/Template";
import { useEffect, useState } from "react";
import useNavigationStore from "../../state_management/useNaviagtionStore";
import { useSearchResultStore } from "../../state_management/searchPageResult";
import DarkGrayBackground from "../../styledComponents/DarkGrayBackground";
import SongDetailestTittle from "../../styledComponents/SongDetailestTitle";
import SongDetailTittle from "../../styledComponents/SongDetailTitle";
import ArtistImage from "../../styledComponents/ArtistImage";
import { QueueingTrack } from "../../components/QueueingTrack";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCurrentUserStore } from "../../state_management/currentUser";

export default function SearchPage() {
  const isMusicDetailsVisible = useSidebarStore(
    (state) => state.isMusicDetailsVisible
  );
  const { result, searchResult } = useSearchResultStore();
  const setActiveSection = useNavigationStore(
    (state) => state.setActiveSection
  );
  const handleSectionClick = (section: "home" | "search" | "your-posts") => {
    setActiveSection(section);
  };
  useEffect(() => {
    handleSectionClick("search");
  }, []);
  const { current_user } = useCurrentUserStore();
  const navigate = useNavigate();
  const [recent, setRecent] = useState<SearchResultModel[] | null>(null);

  async function addToRecent(
    type: string,
    someId: string,
    searchImage: string
  ) {
    await axios.post(`http://localhost:8888/searches/save`, {
      id: someId,
      type: type,
      userid: current_user?.id,
      image: searchImage,
    });
    setActiveSection("home");
    navigate(`/${type}/${someId}`);
  }

  async function GetAllRecentSearches() {
    const response = await axios.get<WebResponse<SearchResultModel[]>>(
      `http://localhost:8888/searches/getrecent/${current_user?.id}`
    );
    console.log("recent Response", response);
    setRecent(response.data.data);
  }
  useEffect(() => {
    GetAllRecentSearches();
  }, []);

  return (
    <>
      <MasterPage
        component={
          <MainContent
            sideBar={isMusicDetailsVisible}
            style={{ justifyContent: "center", overflowY: "scroll" }}
            className="row"
          >
            <div className="wpercent90 h-auto">
              <SpotifyHeader />
              <br />

              {result === "" ? (
                <>
                  <p className="b600 fs-24">Recent Searches</p>
                  <div className="grid6 mt-20">
                    {recent &&
                      recent.map((item) => {
                        return item.type === "Album" ? (
                          <Link to={`/Album/${item.id}`}>
                          <div className="vw-10">
                            <div>
                              <AlbumImage
                                src={`http://localhost:8888/album/picture/${item.image}`}
                                />
                            </div>
                            <p className="b600 fs-15">{item.name}</p>
                            <div className="row">
                              <p
                                className="b500 fs-10"
                                style={{ opacity: "0.5" }}
                                >
                                Album
                              </p>
                            </div>
                          </div>
                                </Link>
                        ) : item.type === "VerifiedArtist" ? (
                          <Link to={`/VerifiedArtist/${item.id}`}>
                          <div className="vw-10">
                            <div>
                              <ArtistImage
                                src={`http://localhost:8888/profile_pictures/${item.image}`}
                                />
                            </div>
                            <p className="b600 fs-15">{item.name}</p>
                            <div className="row">
                              <p
                                className="b500 fs-10"
                                style={{ opacity: "0.5" }}
                                >
                                Artist
                              </p>
                            </div>
                          </div>
                                </Link>
                        ) : item.type === "Track" ? (
                          <Link to={`/Track/${item.id}`}>
                          <div className="vw-10">
                            <div>
                              <AlbumImage
                                src={`http://localhost:8888/album/picture/${item.image}`}
                                />
                            </div>
                            <p className="b600 fs-15">{item.name}</p>
                            <div className="row">
                              <p
                                className="b500 fs-10"
                                style={{ opacity: "0.5" }}
                                >
                                Song
                              </p>
                            </div>
                          </div>
                                </Link>
                        ) : null;
                      })}

                    {/* <GalleryPiece />
                    <GalleryPiece /> */}
                  </div>

                  <br />
                  <br />
                  <Link to="/ShowMore/Song/All kinds of artist">
                    <p className="b600 fs-24">Browse All</p>
                    <div className="grid4 mt-20">
                      <div className="vw-15">
                        <div className="vw-10">
                          <AlbumImage src={MusicLogo} alt="" />
                        </div>
                        <p className="b600 fs-12">
                          Click here to view all songs
                        </p>
                      </div>
                    </div>
                  </Link>
                </>
              ) : //Setting the result Page
              !searchResult?.topSongResult &&
                !searchResult?.topArtistResult &&
                !searchResult?.topAlbumResult ? (
                <div className="vw-50">
                  <p className="white fs-40 b500">No Result Found</p>
                </div>
              ) : (
                <div className="column ">
                  <div className="row">
                    <div
                      className="w-auto h-auto wpercent50 mr-49"
                      style={{ borderRadius: "10px", overflow: "hidden" }}
                    >
                      {searchResult?.topAlbumResult.album.name && (
                        <>
                          <p className="b600 fs-20 mb-10">Top Result</p>
                          <DarkGrayBackground
                            onClick={() =>
                              addToRecent(
                                "Album",
                                searchResult?.topAlbumResult.album.id,
                                searchResult?.topAlbumResult.album.image
                              )
                            }
                          >
                            <div className="wpercent30 p-25 ">
                              <AlbumImage
                                src={`http://localhost:8888/album/picture/${searchResult?.topAlbumResult.album.image}`}
                              />
                              <p className="b600 fs-30">
                                {searchResult?.topAlbumResult.album.name}
                              </p>
                              <div className="row vw-15 between">
                                <p
                                  className="b500 fs-15"
                                  style={{ opacity: "0.5" }}
                                >
                                  Album
                                </p>
                                <p style={{ opacity: "0.5" }}> • </p>
                                <p
                                  className="b500 fs-15"
                                  style={{ opacity: "0.8" }}
                                >
                                  {searchResult?.topAlbumResult.user.name}
                                </p>
                              </div>
                            </div>
                          </DarkGrayBackground>
                        </>
                      )}

                      {searchResult?.topSongResult.songs.name && (
                        <>
                          <p className="b600 fs-20 mb-10">Top Result</p>
                          <DarkGrayBackground
                            onClick={() =>
                              addToRecent(
                                "Track",
                                searchResult?.topSongResult.songs.id,
                                searchResult?.topSongResult.album.image
                              )
                            }
                          >
                            <div className="wpercent30 p-25 ">
                              <AlbumImage
                                src={`http://localhost:8888/album/picture/${searchResult?.topSongResult.album.image}`}
                              />
                              <p className="b600 fs-30">
                                {searchResult?.topSongResult.songs.name}
                              </p>
                              <div className="row vw-15 between">
                                <p
                                  className="b500 fs-15"
                                  style={{ opacity: "0.5" }}
                                >
                                  Song
                                </p>
                                <p style={{ opacity: "0.5" }}> • </p>
                                <p
                                  className="b500 fs-15"
                                  style={{ opacity: "0.8" }}
                                >
                                  {searchResult?.topSongResult.user.name}
                                </p>
                              </div>
                            </div>
                          </DarkGrayBackground>
                        </>
                      )}

                      {searchResult?.topArtistResult.user.name && (
                        <>
                          <p className="b600 fs-20 mb-10">Top Result</p>
                          <DarkGrayBackground
                            onClick={() =>
                              addToRecent(
                                "VerifiedArtist",
                                searchResult?.topArtistResult.user.id,
                                searchResult?.topArtistResult.user.profilepicture
                              )
                            }
                          >
                            <div className="wpercent30 p-25">
                              <ArtistImage
                                src={`http://localhost:8888/profile_pictures/${searchResult?.topArtistResult.user.profilepicture}`}
                              />
                              <p className="b600 fs-30 vw-20">
                                {searchResult?.topArtistResult.user.name}
                              </p>
                              <div className="row vw-15 between">
                                <p
                                  className="b500 fs-15"
                                  style={{ opacity: "0.5" }}
                                >
                                  Artist
                                </p>
                                <p style={{ opacity: "0.5" }}> • </p>
                                <p
                                  className="b500 fs-15"
                                  style={{ opacity: "0.8" }}
                                >
                                  {searchResult?.topArtistResult.user.name}
                                </p>
                              </div>
                            </div>
                          </DarkGrayBackground>
                        </>
                      )}
                    </div>
                    {(searchResult?.topSongResult ||
                      searchResult?.topArtistResult ||
                      searchResult?.topAlbumResult) && (
                      <div className="vw-15">
                        <p className="b600 fs-20">Songs</p>
                        <div className="row between vw-24">
                          <div>
                            {searchResult.songs &&
                              searchResult.songs.map((track) => (
                                <div
                                  onClick={() =>
                                    addToRecent(
                                      "Track",
                                      track.songs.id,
                                      track.album.image
                                    )
                                  }
                                >
                                  <QueueingTrack playlistDetail={track} />
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <br />
                  <p className="b600 fs-25  mb-10"> Artist</p>
                  <div className="grid4">
                    {searchResult.artist ? (
                      searchResult.artist.map((artist) => (
                        <div
                          className="vw-12 h-auto"
                          onClick={() =>
                            addToRecent(
                              "VerifiedArtist",
                              artist.user.id,
                              artist.user.profilepicture
                            )
                          }
                        >
                          <ArtistImage
                            src={`http://localhost:8888/profile_pictures/${artist.user.profilepicture}`}
                          />
                          <p></p>
                          <SongDetailTittle>
                            {artist.user.name}
                          </SongDetailTittle>
                          <SongDetailestTittle>Artist</SongDetailestTittle>
                        </div>
                      ))
                    ) : (
                      <p className="white fs-18 b500">No Result Found</p>
                    )}
                  </div>
                  <br />
                  <div className="row between wpercent100">
                    <p className="b600 fs-25 mb-10">Collections</p>
                    <div></div>
                  </div>
                  <div className="grid4">
                    {searchResult.album ? (
                      searchResult.album.map((album) => (
                        <div
                          className="vw-12 h-auto"
                          onClick={() =>
                            addToRecent(
                              "Album",
                              album.album.id,
                              album.album.image
                            )
                          }
                        >
                          <AlbumImage
                            src={`http://localhost:8888/album/picture/${album.album.image}`}
                          />
                          <p></p>
                          <SongDetailTittle>
                            {album.album.name}
                          </SongDetailTittle>
                          <SongDetailestTittle>Album</SongDetailestTittle>
                        </div>
                      ))
                    ) : (
                      <p className="white fs-18 b500">No Result Found</p>
                    )}
                  </div>
                  <br />
                  <br />
                  <br />
                </div>
              )}
            </div>
          </MainContent>
        }
      />
    </>
  );
}
