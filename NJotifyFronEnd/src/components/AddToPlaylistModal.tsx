import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import DarkGrayBackground from "../styledComponents/DarkGrayBackground";
import GreenButton from "../styledComponents/GreenButton";
import SongTitle from "../styledComponents/SongTitle";
import { useToastStore } from "../state_management/toastStore";
import axios from "axios";
import { useCurrentUserStore } from "../state_management/currentUser";

export default function AddToPlaylistModal({
  onClose,
  songIdd,
}: {
  onClose: () => void;
  songIdd: string | undefined;
}) {
  const [playlist, setPlaylist] = useState<Playlist[] | null>(null);

  const { current_user } = useCurrentUserStore();

  useEffect(() => {
    const getUserPlaylist = async () => {
      const response = await axios.get<WebResponse<Playlist[]>>(
        `http://localhost:8888/playlist/getuserplaylist/${current_user?.id}`
      );
      setPlaylist(response.data.data);
    };
    getUserPlaylist();
  }, [current_user]);
  const { setMessage, setToastType, setShowToast } = useToastStore();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (selectedPlaylist == "") {
      setMessage("Please select a playlist!");
      setToastType("Failed");
      setShowToast(true);
      return;
    }

    const selectedPl = playlist?.find((pl) => pl.name === selectedPlaylist);
    const playlistId = selectedPl?.id;

    const response = await axios.post<WebResponse<null>>(
      "http://localhost:8888/playlist/addtoplaylist",
      {
        playlistid: playlistId,
        songid: songIdd,
      }
    );
    if (response.data.code === 200) {
      setToastType("Success");
      onClose();
      window.location.reload();
    } else if (response.data.code === 502) {
      setToastType("Warning");
    } else if (response.data.code === 400) {
      setToastType("Failed");
    }
    setMessage(response.data.status.toString());
    setShowToast(true);
  };
  const [selectedPlaylist, setSelectedPlaylist] = useState("");
  const handlePlaylistChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedPlaylist(event.target.value);
  };

  return (
    <div
      style={{
        position: "absolute",
        top: "0",
        left: "0",
        backgroundColor: "rgba(0,0,0,0.5)",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        color: "white",
      }}
    >
      <DarkGrayBackground
        className=" column center p-10 m-auto"
        style={{ borderRadius: "10px" }}
      >
        <form onSubmit={handleSubmit}>
          <div className="vw-50 vh-40 p-10 pb-15 column center">
            <div className="wpercent80">
              <p className="white fs-40 mb-10 b600">Add track to Playlist</p>
              <SongTitle>Select Playlist</SongTitle>
              <select
                className="mt-10"
                name="category"
                id="category"
                style={{
                  marginLeft: "10px",
                  backgroundColor: "black",
                  padding: "10px",
                  fontSize: "14px",
                  border: "1px solid white",
                  borderRadius: "4px",
                  outline: "none",
                  color: "white",
                  width: "50%",
                }}
                onChange={handlePlaylistChange}
                value={selectedPlaylist}
              >
                       <option value="">Select a Playlist</option>
                {playlist?.map((pl) => (
                  <option value={pl.name}>{pl.name}</option>
                ))}
              </select>
              <br />
              <br />
              <GreenButton onClick={onClose} className="mt-15 mr-15">
                Cancel
              </GreenButton>
              <GreenButton type="submit" className="mt-15">
                Add To Playlist
              </GreenButton>
            </div>
          </div>
        </form>
      </DarkGrayBackground>
    </div>
  );
}
