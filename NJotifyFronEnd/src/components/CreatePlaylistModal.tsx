import { FormEvent, useState } from "react";
import DarkGrayBackground from "../styledComponents/DarkGrayBackground";
import GreenButton from "../styledComponents/GreenButton";
import SongTitle from "../styledComponents/SongTitle";
import { useToastStore } from "../state_management/toastStore";
import axios from "axios";
import { useCurrentUserStore } from "../state_management/currentUser";

export default function CreatePlayListModal({
  onClose,
}: {
  onClose: () => void;
}) {

  const {setMessage, setToastType, setShowToast} = useToastStore();
  const [playlistInfo, setPlaylistInfo] = useState({
    name: "",
    description: "",
  });

  const {current_user} = useCurrentUserStore();

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setPlaylistInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if(playlistInfo.name == "" || playlistInfo.description == ""){
      setMessage("Please fill in all the fields!")
      setToastType("Warning")
      setShowToast(true)
      return
    }

    const response = await axios.post<WebResponse<null>>(
      "http://localhost:8888/playlist/create",
      {
        userid: current_user?.id,
        name: playlistInfo.name,
        description: playlistInfo.description,
      }, {
        withCredentials: true
      }
    );

    if (response.data.code === 200) {
      setToastType("Success")
      onClose()
      window.location.reload()
    } else if (response.data.code === 502) {
      setToastType("Warning")
    } else if (response.data.code === 400){
      setToastType("Failed")
    }
    setMessage(response.data.status.toString())
    setShowToast(true)

  };


  return (
    <div
      style={{
        position: "absolute",
        top: "0",
        left: "0",
        backgroundColor: "rgba(0,0,0,0.5)",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100vw",
        color: "white",
        zIndex: 1000000,
      }}
    >
      <DarkGrayBackground
        className=" column center p-10 m-auto"
        style={{ borderRadius: "10px" }}
      >
        <form   onSubmit={handleSubmit} >
          <div className="vw-50 vh-40 p-10 pb-15 column center">
            <div className="wpercent80">
              <p className="white fs-40 mb-10 b600">Create A new Playlist</p>
              <SongTitle>Title</SongTitle>
              <input
                onChange={handleChange}
                type="text"
                name="name"
                style={{
                  marginLeft: "10px",
                  backgroundColor: "black",
                  padding: "10px",
                  fontSize: "14px",
                  border: "1px solid white",
                  borderRadius: "4px",
                  outline: "none",
                  color: "white",
                  width: "90%",
                }}
              />
              <SongTitle>Description</SongTitle>
              <input
                name="description"
                onChange={handleChange}
                type="text"
                style={{
                  marginLeft: "10px",
                  backgroundColor: "black",
                  padding: "10px",
                  fontSize: "14px",
                  border: "1px solid white",
                  borderRadius: "4px",
                  outline: "none",
                  color: "white",
                  width: "90%",
                  marginBottom: "10px",
                }}
              />
              <GreenButton onClick={onClose} className="mt-15 mr-15">
                Cancel
              </GreenButton>
              <GreenButton type="submit" className="mt-15">
                Create Playlist
              </GreenButton>
            </div>
          </div>
        </form>
      </DarkGrayBackground>
    </div>
  );
}
