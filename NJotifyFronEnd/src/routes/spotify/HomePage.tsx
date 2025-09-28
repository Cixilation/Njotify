import useSidebarStore from "../../state_management/useSidebarToggle";
import MainContent from "../../styledComponents/MainContent";
import { SpotifyHeader } from "../../components/SpotifyHeader";
import { LastPlayedTracks } from "../../components/LastPlayedTracks";
import SmallLink from "../../styledComponents/SmallLink";
import { GalleryAlbumPiece } from "../../components/HomeGalleryPiece";
import { GalleryPieceSkeleton } from "../../components/HomeGalleryPieceSkeleton";
import { SpotifyFooter } from "../../components/SpotifyFooter";
import MasterPage from "../../master_component/Template";
import { Link } from "react-router-dom";
import { useCurrentUserStore } from "../../state_management/currentUser";
import { useEffect, useRef, useState } from "react";
import { PlaylistDetail } from "../../model/PlayListDetailModel";
import axios from "axios";

export default function HomePage() {
  const { current_user } = useCurrentUserStore();
  const isMusicDetailsVisible = useSidebarStore(
    (state) => state.isMusicDetailsVisible
  );
  const [pageInfo, setPageInfo] = useState({
    recentlyPlayedAlbum: null as Album[] | null,
    latestPlayedTrack: null as PlaylistDetail[] | null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [infinitScroll, setInfinitScroll] = useState<Album[] | null>(null);
  const [recommendation, setRecommendation] = useState<Album[] | null>(null);
  const updatePageInfo = (newInfo: Partial<typeof pageInfo>) => {
    console.log("NEW INFO ");
    setPageInfo((prevState) => ({
      ...prevState,
      ...newInfo,
    }));
  };

  const GetLatestPlayedTrack = async () => {
    if (current_user) {
      const response = await axios.get<WebResponse<PlaylistDetail[]>>(
        `http://localhost:8888/song/getlastplayedtrack/${current_user.id}`
      );
      const uniqueTracks = response.data.data.filter(
        (track, index, self) =>
          index === self.findIndex((t) => t.songs.id === track.songs.id)
      );
      updatePageInfo({ latestPlayedTrack: uniqueTracks });
    }
  };

  const GetAllAlbum = async () => {
    const response = await axios.get<WebResponse<Album[]>>(
      `http://localhost:8888/album/getallalbum`
    );
    setRecommendation(response.data.data)
    if (response.data.data != null) {
      const newInfinitScrolling = response.data.data.slice(0, 4);
      setInfinitScroll(newInfinitScrolling);
    }
  };

  useEffect(() => {
    GetAllAlbum();
    GetLatestPlayedTrack();
  }, [current_user]);

  const getRandomRecommendation = () => {
    if (!recommendation){
      console.log("rec is null")
      return null
    }
    const randomIndex = Math.floor(
      Math.random() * recommendation.length
    );
    return recommendation[randomIndex];
  };

  useEffect(() => {
    if (pageInfo.latestPlayedTrack && recommendation) {
      const filteredAlbums = recommendation.filter((album) =>
        pageInfo.latestPlayedTrack!.some((track) => track.album.id === album.id)
      );
      updatePageInfo({ recentlyPlayedAlbum: filteredAlbums });
    }
  }, [pageInfo.latestPlayedTrack, recommendation]);

  const contentRef = useRef<HTMLDivElement>(null);
  const handleScroll = () => {
    const element = contentRef.current;
    if (element) {
      if (element.scrollHeight - element.scrollTop <= window.innerHeight + 1) {
        console.log("You've reached the bottom!");
        setIsLoading(true);
        setTimeout(() => {
          setIsLoading(false);
          for (let i = 0; i < 4; i++) {
            const randomRecommendation = getRandomRecommendation();
            if (randomRecommendation == null) return;
            setInfinitScroll((prev) => {
              if (prev != null) return [...prev, randomRecommendation];
              return [randomRecommendation];
            });
          }
        }, 3000);
      }
    }
  };

  useEffect(() => {
    const element = contentRef.current;
    if (element) {
      element.addEventListener("scroll", handleScroll);
      return () => {
        element.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

  return (
    <MasterPage
      component={
        <MainContent
          sideBar={isMusicDetailsVisible}
          style={{ justifyContent: "center", overflowY: "scroll" }}
          className="row"
          ref={contentRef}
        >
          <div className="wpercent90 h-auto">
            <SpotifyHeader />
            {pageInfo.latestPlayedTrack && (
              <LastPlayedTracks lastplayed={pageInfo.latestPlayedTrack} />
            )}
            <br />
            <div className="row between">
              <p className="b600 fs-24">Recently Played</p>
              <div className="hover">
                <Link to={`/ShowMore/Recently Played Album/${current_user?.id}`}>
                  <SmallLink className="b500 p-3">Show All</SmallLink>
                </Link>
              </div>
            </div>

            <div className="grid4 mt-20">
              {pageInfo.recentlyPlayedAlbum &&
                pageInfo.recentlyPlayedAlbum.slice(0,4).map((album) => (
                  <GalleryAlbumPiece key={album.id} album={album} />
                ))}
            </div>

            <br />
            <br />
            <div className="row between">
              <p className="b600 fs-24">Recommended For You</p>
              <div className="hover">
              <Link to={`/ShowMore/Album/${current_user?.id}`}>
                  <SmallLink className="b500 p-3">Show All</SmallLink>
                </Link>
              </div>
            </div>

            <div className="grid4 mt-20">
              {infinitScroll &&
                infinitScroll.map((album) => (
                  <GalleryAlbumPiece key={album.id} album={album} />
                ))}
            </div>
            {isLoading && (
              <div className="grid4 mt-20">
                <GalleryPieceSkeleton />
                <GalleryPieceSkeleton />
                <GalleryPieceSkeleton />
                <GalleryPieceSkeleton />
              </div>
            )}
            <br />
            <br />
            <br />
            <div style={{ position: "relative", left: "-18vw" }}>
              <SpotifyFooter />
            </div>
          </div>
        </MainContent>
      }
    />
  );
}
