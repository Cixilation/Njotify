import styled from "styled-components";
import SongTitle from "../styledComponents/SongTitle";
import { PlaylistDetail } from "../model/PlayListDetailModel";
import { Link } from "react-router-dom";
import useMusicStore from "../state_management/playingSongStore";
const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 7px;
`;

export function LastPlayedTracks({
  lastplayed,
}: {
  lastplayed: PlaylistDetail[];
}) {

  const {
    addToQueue,
    playNext,
    setPlaying,
    deleteAllFromQueue
  } = useMusicStore();

  function playMusic(track : PlaylistDetail) {
    deleteAllFromQueue()
    addToQueue(track)
    playNext()
    setPlaying(false)
    setPlaying(true)
  }
  return (
    <div className="my-15">
      <GridContainer>
        {lastplayed
          .filter((track) => track.songs.name !== "")
          .slice(0, 8)
          .map((track, index) => (
            <>
              <TrackContainer key={index}>
                <div className="track-container">
                  <Link to={`/Track/${track.songs.id}`}>
                    <Tracks playlistdetail={track} />
                  </Link>
                  <button className="track-button" onClick={()=> playMusic(track)}>Play</button>
                </div>
              </TrackContainer>
            </>
          ))}
      </GridContainer>
    </div>
  );
}

export function Tracks({ playlistdetail }: { playlistdetail: PlaylistDetail }) {
  return (
    <>
      <TrackContainer>
        <img
          src={`http://localhost:8888/album/picture/${playlistdetail.album.image}`}
          alt=""
          className="percent100 bg-black mr-15"
        />
        <SongTitle> {playlistdetail.songs.name} </SongTitle>
      </TrackContainer>
    </>
  );
}

export const TrackContainer = styled.div`
  height: 6vh;
  background-color: rgba(100, 100, 100, 0.4);
  color: white;
  width: 14vw;
  justify-content: between;
  display: flex;
  align-items: center;
  overflow: hidden;
  border-radius: 5px;
  &:hover {
    color: rgba(255, 255, 255, 0.9);
    background-color: rgba(100, 100, 100, 1);
  }
`;
