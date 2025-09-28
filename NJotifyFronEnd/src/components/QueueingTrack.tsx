

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MusicLogo from "../assets/music.png";
import AlbumImage from "../styledComponents/AlbumImage";
import SongDetailTitle from "../styledComponents/SongDetailTitle";
import SongDetailestTitle from "../styledComponents/SongDetailestTitle";
import { faThumbTack } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { User } from "../model/UserModel";
import { useEffect, useState } from "react";
import axios from "axios";
import { PlaylistDetail } from "../model/PlayListDetailModel";

export function PlaylistTrack({playlist} : {playlist : Playlist}){
  const isPinned = true;

  const [creator, setCreator] = useState<User | null>(null)

    useEffect(() => {
      const getUser = async () => {
        const response = await axios.get<WebResponse<User>>(
          `http://localhost:8888/user/${playlist.userid}`
        );
        setCreator(response.data.data);
      };
      getUser();

    }, []);


    const navigate = useNavigate();
    function GoToPlaylistPage() {
      navigate(`/Playlist/${playlist.id}`)
    }
    return (
      <div className="center row wpercent80 mt-20" onClick={GoToPlaylistPage}>
        <div className="vh-5 sw-5 mr-10">
          <AlbumImage src={MusicLogo} alt="" />
        </div>
        <div>     
          <div className="vw-10">
          <SongDetailTitle className="description">{playlist.name}</SongDetailTitle>
          </div>
          <div className="row" style={{alignItems:"center"}}>
            {isPinned && <FontAwesomeIcon icon={faThumbTack} className="fs-10 green mr-5"/>}
            <SongDetailestTitle>Playlist • {creator?.name}</SongDetailestTitle> 
          </div>
      

        </div>
      </div>
    )
}

export function QueueingTrack({playlistDetail} : {playlistDetail : PlaylistDetail}){
  console.log(playlistDetail)
    return (
    
      <div className="row vw-30 mt-20">
        <div className="vh-5 sw-5 mr-10">
          <AlbumImage src={`http://localhost:8888/album/picture/${playlistDetail?.album?.image}`} alt="" />
        </div>
        <Link to={`/Track/${[playlistDetail?.songs?.id]}`}>
        <div className="vw-8">     
          <SongDetailTitle className="wpercent60 description">{playlistDetail?.songs?.name}</SongDetailTitle>
          <div className="row" style={{alignItems:"center"}}>
            <SongDetailestTitle>{playlistDetail?.user?.name}</SongDetailestTitle>
          </div>
        </div>
            </Link>
      </div>

    )
}
