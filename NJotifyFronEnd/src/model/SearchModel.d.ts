import { PlaylistDetail } from "./PlayListDetailModel";

interface SearchResultModel {
    songs : PlaylistDetail[];
    album : PlaylistDetail[];
    artist : Artist[];
    topSongResult : PlaylistDetail;
    topAlbumResult : PlaylistDetail;
    topArtistResult : Artist;
}