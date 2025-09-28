import { Artist } from "./ArtistModel"
import { User } from "./UserModel"

interface PlaylistDetail{
    date : string
    album : Album
    songs : Song
    user : User
    artist : Artist
}