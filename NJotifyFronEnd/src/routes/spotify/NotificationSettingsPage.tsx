import { Link, useNavigate } from "react-router-dom";
import { SpotifyFooter } from "../../components/SpotifyFooter";
import { NjotifyLogo } from "../../styledComponents/NjotifyLogo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faTabletScreenButton,
} from "@fortawesome/free-solid-svg-icons";
import SongDetailTitle from "../../styledComponents/SongDetailTitle";
import SongTitle from "../../styledComponents/SongTitle";
import BackButton from "../../components/BackButton";
import GreenButton from "../../styledComponents/GreenButton";
import GrayButton from "../../styledComponents/GrayButton";
import { FormEvent, useEffect, useState } from "react";
import { useToastStore } from "../../state_management/toastStore";
import axios from "axios";
import { useCurrentUserStore } from "../../state_management/currentUser";
import ToastNotif from "../../components/ToastNotif";

export default function NotificationSettings() {
  const navigate = useNavigate();
  function back() {
    navigate(-1);
  }
  const { current_user } = useCurrentUserStore();

  const [notification, setNotification] = useState({
    newFollowerPhone: "disabled",
    newFollowerEmail: "disabled",
    newAlbumPhone: "disabled",
    newAlbumEmail: "disabled",
  });

  useEffect(() => {
    const fetchNotifications = async () => {
      const response = await axios.get<WebResponse<Notification>>(
        `http://localhost:8888/notification/getNotif/${current_user?.id}`
      );

      setNotification({
        newFollowerPhone: response.data.data.followingphonenotif,
        newFollowerEmail: response.data.data.followingemailnotif,
        newAlbumPhone: response.data.data.albumphonenotif,
        newAlbumEmail: response.data.data.albumemailnotif,
      });
    };
    fetchNotifications();
  }, [current_user]);

  const handleChange = (e: any) => {
    const { name, checked } = e.target;
    setNotification((prevNotification) => ({
      ...prevNotification,
      [name]: checked ? "enabled" : "disabled",
    }));
  };

  function reload() {
    window.location.reload();
  }

  const {
    message,
    setMessage,
    ToastType,
    setToastType,
    showToast,
    setShowToast,
  } = useToastStore();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await axios.put<WebResponse<null>>(
      "http://localhost:8888/notification/update",
      {
        userid: current_user?.id,
        followingphone: notification.newFollowerPhone,
        followingemail: notification.newFollowerEmail,
        albumphone: notification.newAlbumPhone,
        albumemail: notification.newAlbumEmail,
      }
    );
    if (response.data.code === 200) {
      setToastType("Success");
    } else if (response.data.code === 502) {
      setToastType("Warning");
    } else if (response.data.code === 400) {
      setToastType("Failed");
    }

    console.log(notification);
    setMessage(response.data.status);
    setShowToast(true);
  };

  return (
    <>
      <div className="header row bg-black vw-100 vh-10 between">
        <Link to="/Home" className="percent100 ml-10">
          <NjotifyLogo />
        </Link>
      </div>

      <div className="row bg-black vw-100 vh-65 center">
        <div className="wpercent50 ">
          <div onClick={back}>
            <BackButton />
          </div>
          <p className="b600 white fs-35">Notification Settings </p>
          <SongDetailTitle>
            Pick the notification you want to get via push or email. These
            preferences only apply to push amd email.
          </SongDetailTitle>

          <div className="row between vw-80 vh-30">
            <div className="row white betweeen vw-80">
              <div className="column vh-20 between mr-100">
                <div className="row black between vh-10"></div>
                <div className="column vw-20  vh-20 mb-15">
                  <SongTitle>New Releases</SongTitle>
                  <SongDetailTitle>
                    Update from music and new releases from arrtist you follow.
                  </SongDetailTitle>
                </div>
                <div className="column  vw-20 vh-20">
                  <SongTitle>Followers</SongTitle>
                  <SongDetailTitle>Update from new followers</SongDetailTitle>
                </div>
              </div>
              <br />
              <div className="column vh-20 between ml-100">
                <div className="row between vw-5">
                  <FontAwesomeIcon icon={faEnvelope} />
                  <FontAwesomeIcon icon={faTabletScreenButton} />
                </div>
                <div className="row between vw-5 vh-20">
                  <input
                    type="checkbox"
                    className="checkbox"
                    name="newAlbumEmail"
                    checked={notification.newAlbumEmail === "enabled"}
                    onChange={handleChange}
                  />
                  <input
                    type="checkbox"
                    className="checkbox"
                    name="newAlbumPhone"
                    checked={notification.newAlbumPhone === "enabled"}
                    onChange={handleChange}
                  />
                </div>
                <div className="row between vw-5 vh-20">
                  <input
                    type="checkbox"
                    className="checkbox"
                    name="newFollowerEmail"
                    checked={notification.newFollowerEmail === "enabled"}
                    onChange={handleChange}
                  />
                  <input
                    type="checkbox"
                    className="checkbox"
                    name="newFollowerPhone"
                    checked={notification.newFollowerPhone === "enabled"}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="row wpercent90">
            <div className="vw-10">
              <GrayButton onClick={reload}>Cancel</GrayButton>
            </div>
            <form onSubmit={handleSubmit} className="wpercent100">
              <GreenButton type="submit"> Save Settings</GreenButton>
            </form>
          </div>
        </div>
        {showToast && <ToastNotif message={message} type={ToastType} />}
      </div>
      <div className=" vh-23"> </div>
      <div className="footer vw-100 vh-30 bg-black">
        <br />
        <SpotifyFooter />
      </div>
    </>
  );
}
