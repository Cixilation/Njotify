import { ChangeEvent, FormEvent, useState } from "react";
import { SpotifyHeader } from "../../components/SpotifyHeader";
import MasterPage from "../../master_component/Template";
import useSidebarStore from "../../state_management/useSidebarToggle";
import MainContent from "../../styledComponents/MainContent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCamera,
  faMinusCircle,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";
import InputField from "../../styledComponents/InputField";
import GreenButton from "../../styledComponents/GreenButton";
import GrayButton from "../../styledComponents/GrayButton";
import ToastNotif from "../../components/ToastNotif";
import { useToastStore } from "../../state_management/toastStore";
import { useCurrentUserStore } from "../../state_management/currentUser";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CreateMusicPage() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const {
    message,
    setMessage,
    ToastType,
    setToastType,
    showToast,
    setShowToast,
  } = useToastStore();
  const [iterations, setIterations] = useState(6);

  const { current_user } = useCurrentUserStore();
  const [albumTitle, setAlbumTitle] = useState("");
  const isMusicDetailsVisible = useSidebarStore(
    (state) => state.isMusicDetailsVisible
  );

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = function (e) {
        if (e.target && typeof e.target.result === "string") {
          setImageSrc(e.target.result);
        }
      };
      reader.readAsDataURL(selectedFile);
    }
  }

  const [songFiles, setSongFiles] = useState<
    { title: string; file: File | null }[]
  >([]);

  const handleTrackChange = (
    index: number,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const values = [...songFiles];
    if (!values[index]) {
      values[index] = { title: "", file: null };
    }
    if (event.target.type === "text") {
      values[index].title = event.target.value;
    } else {
      values[index].file = event.target.files?.[0] || null;
    }
    setSongFiles(values);
  };

  function Add() {
    setIterations(iterations + 1);
  }

  function Subtract() {
    if (iterations > 1) {
      setIterations(iterations - 1);
    }
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAlbumTitle(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (albumTitle === "" || file === null || songFiles.length < iterations) {
      setMessage("Please fill in all the fields!");
      setToastType("Warning");
      setShowToast(true);
      return;
    }
    const albumData = new FormData();
    let id = "";
    if (current_user?.id !== undefined) {
      id = current_user.id.toString();
      albumData.append("userid", id);
    }

    albumData.append("userid", id);
    albumData.append("name", albumTitle);
    albumData.append("albumCover", file);
    let category = "";
    if (songFiles.length >= 6) {
      category = "Album";
    } else if (songFiles.length >= 4 && songFiles.length <= 6) {
      category = "Eps";
    } else if (songFiles.length >= 1 && songFiles.length <= 3) {
      category = "Single";
    } else {
      category = "Dummy";
    }
    albumData.append("type", category);

    const response = await axios.post<WebResponse<Album>>(
      "http://localhost:8888/album/create",
      albumData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    let code = 200;
    let message = "";

    for (let i = 0; i < iterations; i++) {
      const songData = new FormData();
      songData.append("albumid", response.data.data.id);

      const song = songFiles[i];
      songData.append(`name`, song.title);
      if (song.file) {
        songData.append(`file`, song.file);
      }

      const songResponse = await axios.post<WebResponse<null>>(
        "http://localhost:8888/song/create",
        songData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (songResponse.data.code === 502) {
        code = 502;
        message = response.data.status;
      } else if (songResponse.data.code === 400) {
        code = 400;
        message = response.data.status;
      }
    }

    if (message == "") {
      message = response.data.status;
    }

    if (response.data.code === 200 && code === 200) {
      setToastType("Success");
    } else if (response.data.code === 502) {
      setToastType("Warning");
    } else if (response.data.code === 400) {
      setToastType("Failed");
    } else {
      setToastType("Failed");
    }
    setMessage(message);
    setShowToast(true);
    navigate(`/YourPost/${current_user?.id}`)
  };
  const navigate = useNavigate()
  return (
    <MasterPage
      component={
        <>
          <MainContent sideBar={isMusicDetailsVisible}>
            <div className="column center">
              <div className="wpercent90 h-auto">
                <SpotifyHeader />
              </div>
              <div className="wpercent90">
                <p className="fs-30 b600"> Create New Music</p>
                <div className="row wpercent100">
                  <label htmlFor="file-upload">
                    <div
                      className="vw-18 sh-18 column center mr-25"
                      style={{ border: "1px dashed rgba(255,255,255,0.5)" }}
                    >
                      <input
                        type="file"
                        id="file-upload"
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                      />
                      {imageSrc ? (
                        <div className="preview">
                          <img
                            src={imageSrc}
                            alt="Preview"
                            className="vw-18 sh-18"
                            style={{
                              maxWidth: "100%",
                              marginTop: "7px",
                              objectFit: "cover",
                            }}
                          />
                        </div>
                      ) : (
                        <>
                          <label className="fs-90">
                            <FontAwesomeIcon
                              icon={faCamera}
                              className="white"
                            />
                          </label>
                          <p
                            className="fs-20"
                            style={{ color: "rgba(255,255,255,0.5)" }}
                          >
                            Upload Collection
                          </p>
                          <p
                            className="fs-16"
                            style={{ color: "rgba(255,255,255,0.5)" }}
                          >
                            Main Image
                          </p>
                        </>
                      )}
                    </div>
                  </label>
                  <div className="wpercent70">
                    <div className="mb-15 wpercent100">
                      <p className="fs-14 b600 white">Title</p>
                      <div className="row between">
                        <InputField
                          placeholder="Title"
                          type="text"
                          onChange={handleTitleChange}
                        />

                        <select
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
                            width: "30%",
                          }}
                        >
                          <option value="album" selected={iterations >= 6}>
                            Album
                          </option>
                          <option
                            value="eps"
                            selected={iterations >= 4 && iterations <= 6}
                          >
                            Eps
                          </option>
                          <option
                            value="singles"
                            selected={iterations >= 1 && iterations <= 3}
                          >
                            Single
                          </option>
                        </select>
                      </div>
                    </div>
                    <p className="fs-14 b600 white">Tracks</p>

                    {Array.from({ length: iterations }).map((_, index) => (
                      <div key={index} className="row between">
                        {`#${index + 1}`}
                        <input
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
                            width: "60%",
                          }}
                          onChange={(e) => handleTrackChange(index, e)}
                        />
                        <input
                          onChange={(e) => handleTrackChange(index, e)}
                          type="file"
                          style={{
                            marginLeft: "10px",
                            backgroundColor: "black",
                            padding: "10px",
                            fontSize: "14px",
                            border: "1px solid white",
                            borderRadius: "4px",
                            outline: "none",
                            color: "white",
                            width: "20%",
                          }}
                        />
                      </div>
                    ))}
                    <br />

                    <div className="row between">
                      <div></div>
                      <div style={{ zIndex: 200 }}>
                        <FontAwesomeIcon
                          icon={faPlusCircle}
                          className="fs-30 mr-10"
                          onClick={Add}
                        />
                        <FontAwesomeIcon
                          icon={faMinusCircle}
                          className="fs-30"
                          onClick={Subtract}
                        />
                      </div>
                    </div>
                    <div className="row wpercent90">
                      <div className="vw-10">
                        <GrayButton>Cancel</GrayButton>
                      </div>
                      <form
                        action=""
                        onSubmit={handleSubmit}
                        className="wpercent100"
                      >
                        <GreenButton type="submit">Post Music</GreenButton>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </MainContent>
          {showToast && <ToastNotif message={message} type={ToastType} />}
        </>
      }
    />
  );
}
