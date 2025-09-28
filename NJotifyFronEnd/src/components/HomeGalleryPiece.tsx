import AlbumImage from "../styledComponents/AlbumImage";
import MusicLogo from "../assets/music.png";
import SongDetailTitle from "../styledComponents/SongDetailTitle";
import { Link, useNavigate } from "react-router-dom";
import { PlaylistDetail } from "../model/PlayListDetailModel";

export function GalleryAlbumPiece({ album }: { album: Album }) {
  const navigate = useNavigate();
  function GoToAlbumPage() {
    navigate(`/Album/${album.id}`);
  }
  return (
    <>
      <div className="vw-13">
        <div className="vw-13 sh-13 mb-5" onClick={GoToAlbumPage}>
          <AlbumImage
            src={`http://localhost:8888/album/picture/${album.image}`}
            alt=""
          />
        </div>
        <div className="row between wpercent100">
          <div className="center column wpercent100">
            <p className="fs-16 b400">
              <p className="wpercent100 description">{album.name}</p>
            </p>
            <SongDetailTitle>
              <p className="fs-14">
                {album.uploadDate} • {album.type}
              </p>
            </SongDetailTitle>
          </div>
        </div>
      </div>
    </>
  );
}

export function GalleryPlaylistPiece({ playlist }: { playlist: Playlist }) {
  return (
    <>
      <Link to={`/Playlist/${playlist.id}`}>
        <div className="vw-14">
          <div className="vw-13 sh-13 mb-5">
            <AlbumImage src={MusicLogo} alt="" />
          </div>
          <div className="row between">
            <div className="wpercent90">
              <p className="fs-16 b400 description">{playlist.name}</p>

              <SongDetailTitle className="wpercent50">
                <p className="fs-14 description">{playlist.description}</p>
              </SongDetailTitle>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
}

export function SongPiece({ playlist }: { playlist: PlaylistDetail }) {
  return (
    <>
      <Link to={`/Track/${playlist.songs.id}`}>
        <div className="vw-14">
          <div className="vw-13 sh-13 mb-5">
            <AlbumImage
              src={`http://localhost:8888/album/picture/${playlist.album.image}`}
              alt=""
            />
          </div>
          <div className="row between wpercent100">
            <div className="center column wpercent100">
              <p className="fs-16 b400">
                <p className="wpercent100 description">{playlist.songs.name}</p>
              </p>
              <SongDetailTitle>
                <p className="fs-14">
                  {playlist.album.name} • {playlist.user.name}
                </p>
              </SongDetailTitle>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
}
