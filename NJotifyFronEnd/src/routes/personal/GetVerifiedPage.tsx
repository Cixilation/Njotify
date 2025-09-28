import { Link, useNavigate } from "react-router-dom";
import { SpotifyFooter } from "../../components/SpotifyFooter";
import { NjotifyLogo } from "../../styledComponents/NjotifyLogo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import SongDetailestTitle from "../../styledComponents/SongDetailestTitle";
import SongDetailTitle from "../../styledComponents/SongDetailTitle";
import GreenButton from "../../styledComponents/GreenButton";
import GrayButton from "../../styledComponents/GrayButton";
import BackButton from "../../components/BackButton";
import { FormEvent, useState } from "react";
import { useToastStore } from "../../state_management/toastStore";
import ToastNotif from "../../components/ToastNotif";
import axios from "axios";
import { useCurrentUserStore } from "../../state_management/currentUser";
export default function GetVerifiedPage() {

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [aboutYou, setAboutYou] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const {message, setMessage, ToastType, setToastType, showToast, setShowToast} = useToastStore();
  const { current_user } = useCurrentUserStore();
  const role = current_user?.role;

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

  function handleAboutYouChange(event: any) {
    setAboutYou(event.target.value);
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (aboutYou == "" || file == null) {
      setMessage("Please fill in all the field!");
      setToastType("Warning");
      setShowToast(true);
      return;
    }
    const formData = new FormData();

    if (current_user?.id !== undefined) {
      const id = current_user.id.toString();
      formData.append("userid", id);
    }

    formData.append("description", aboutYou);
    formData.append("banner", file);
    const response = await axios.post(
      "http://localhost:8888/user/getverified",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (response.data.code === 200) {
      setToastType("Success");
    } else if (response.data.code === 502) {
      setToastType("Warning");
    } else if (response.data.code === 400) {
      setToastType("Failed");
    }
    setMessage(response.data.status);
    setShowToast(true);
  };
  const navigate = useNavigate();
  function back() {
    navigate(-1);
  }
  return (
    <>
      <div className="header row bg-black vw-100 vh-10 between">
        <Link to="/Home" className="percent100 ml-10">
          <NjotifyLogo />
        </Link>
      </div>

      <div className="row bg-black vw-100 vh-65 center">
        <div className="wpercent50">
          <div onClick={back}>
            <BackButton />
          </div>
          <p className="b600 white fs-35">Get Verified </p>
          <form onSubmit={handleSubmit}>
            <div className="row between wpercent100">
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
                        <FontAwesomeIcon icon={faCamera} className="white" />
                      </label>
                      <p
                        className="fs-20"
                        style={{ color: "rgba(255,255,255,0.5)" }}
                      >
                        Upload Banner Image
                      </p>
                      
                    </>
                  )}
                </div>
              </label>

              <div className="wpercent60">
                <SongDetailestTitle>Current Role</SongDetailestTitle>
                <SongDetailTitle>{role}</SongDetailTitle>
                <br />
                <SongDetailTitle>About You</SongDetailTitle>
                <textarea
                  style={{
                    marginTop: "10px",
                    backgroundColor: "black",
                    padding: "10px",
                    fontSize: "14px",
                    border: "1px solid white",
                    borderRadius: "4px",
                    outline: "none",
                    color: "white",
                    width: "90%",
                  }}
                  className="vh-10"
                  value={aboutYou}
                  onChange={handleAboutYouChange}
                />
                <br />
                <br />
                <br />
                <div className="row wpercent90">
                  <div className="vw-10">
                    <GrayButton>Cancel</GrayButton>
                  </div>
                  <GreenButton type="submit"> Get Verified</GreenButton>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className=" vh-23"> </div>
      <div className="footer vw-100 vh-30 bg-black">
        <br />
        <SpotifyFooter />
      </div>
      {showToast && <ToastNotif message={message} type={ToastType} />}
    </>
  );
}
