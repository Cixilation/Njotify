import DarkGrayBackground from "../styledComponents/DarkGrayBackground";

import SongTitle from "../styledComponents/SongTitle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faXmark } from "@fortawesome/free-solid-svg-icons";
import HorizontalLine from "../styledComponents/HorizontalLine";
import useSidebarStore from "../state_management/useSidebarToggle";
import useMusicStore  from "../state_management/playingSongStore";
import { QueueingTrack } from "./QueueingTrack";

export function QueueComponent() {
  const toggleQueueVisibility = useSidebarStore(
    (state) => state.toggleQueueVisibility
  );
  const { queue, currentSong, removeFromQueue, deleteAllFromQueue } = useMusicStore();
  return (
    <DarkGrayBackground className="right">
      <div className="vh-90 w-auto m-15 column m-auto">
        <div className="row between wpercent100 vw-18 vh-4 top mb-20">
          <SongTitle className="fs-4 ">Queue</SongTitle>
          <div onClick={toggleQueueVisibility} className="hover">
            <FontAwesomeIcon
              icon={faXmark}
              className="fs-18 white"
              style={{ margin: "0 10px", opacity: "0.7" }}
            />
          </div>
        </div>
        <div className="h-auto">
          <div className="row between px-15">
            <p className="b600 fs-13">Now Playing</p>
          </div>
          <div className="m-10">
            {currentSong && <QueueingTrack playlistDetail={currentSong} />}
          </div>

          <HorizontalLine></HorizontalLine>
          <br />
          <div className="row between px-15">
            <p className="b600 fs-13">In Queue</p>
            <p className="b600 fs-13 p-5 mr-15 hover" onClick={deleteAllFromQueue}>Clear All</p>

          </div>
          <div className="column m-10">
            {queue.length >= 1 && queue.map((track, index) => (
              <div className="row center mr-20">
                  <QueueingTrack playlistDetail={track} />
                  <div onClick={() => removeFromQueue(index)} className="center row">
                    <FontAwesomeIcon icon={faTrashCan}/>
                  </div>
              </div>
            ))}

          </div>
        </div>
      </div>
    </DarkGrayBackground>
  );
}
