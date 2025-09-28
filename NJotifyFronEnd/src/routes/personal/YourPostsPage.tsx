import useSidebarStore from "../../state_management/useSidebarToggle";
import MainContent from "../../styledComponents/MainContent";
import { SpotifyHeader } from "../../components/SpotifyHeader";
import {
  GalleryAlbumPiece
} from "../../components/HomeGalleryPiece";
import MasterPage from "../../master_component/Template";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCheck } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Artist } from "../../model/ArtistModel";
import axios from "axios";

export default function YourPostPage() {
  const { id } = useParams();
  const [Artist, setArtist] = useState<Artist | null>(null);
  const [Album, setAlbum] = useState<Album[] | null>(null);

  async function GetArtist() {
    const response = await axios.get<WebResponse<Artist>>(
      `http://localhost:8888/artist/${id}`
    );
    setArtist(response.data.data);
  }

  async function GetAlbum() {
    const response = await axios.get<WebResponse<Album[]>>(
      `http://localhost:8888/album/getalbumbyuserid/${Artist?.user.id}`
    );
    console.log(response);
    setAlbum(response.data.data);
  }

  useEffect(() => {
    GetArtist();
    GetAlbum();
  }, []);

  useEffect(() => {
    GetAlbum();
  }, [Artist]);
  
  const isMusicDetailsVisible = useSidebarStore(
    (state) => state.isMusicDetailsVisible
  );
  return (
    <>
      <MasterPage
        component={
          <MainContent
            sideBar={isMusicDetailsVisible}
            style={{ justifyContent: "center", overflowY: "scroll" }}
          >
            <div className=" center" style={{ position: "relative" }}>
              <div
                className="wpercent90 h-auto"
                style={{ position: "absolute", top: "0", left: "3vw" }}
              >
                <SpotifyHeader />
              </div>
              <img
                src={`http://localhost:8888/banner/${Artist?.banner}`}
                className="wpercent100 vh-35"
                style={{ aspectRatio: "1/1", objectFit: "cover" }}
              />
              <div style={{ position: "absolute", bottom: "0", left: "1vw" }}>
                <div className="row m-10 vw-9 between">
                  <FontAwesomeIcon icon={faUserCheck} />
                  <p
                    className="b300"
                    style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)" }}
                  >
                    Verified Artist
                  </p>
                </div>
                <p
                  className="fs-32 b600 mb-20"
                  style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)" }}
                >
                  Hi, {Artist?.user.name}
                </p>
              </div>
            </div>
            <br />
            <div className="wpercent100 h-auto row  center">
              <div>
                <p className="b600 fs-24">Discography</p>
                <div className="grid4 mt-20">
                  <Link to="/CreateMusic">
                    <div
                      className="vw-13 sh-13 mb-5 center row bg-green white fs-80"
                      style={{ borderRadius: "5px" }}
                    >
                      <FontAwesomeIcon icon={faPlus} />
                    </div>
                  </Link>
                  {Album?.map((album) => (
                    <GalleryAlbumPiece key={album.id} album={album} />
                  ))}
                </div>
              </div>
            </div>
            <br />
            <br />
            <br />

          </MainContent>
        }
      />
    </>
  );
}
