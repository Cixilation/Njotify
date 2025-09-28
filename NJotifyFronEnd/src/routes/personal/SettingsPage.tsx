import { Link } from "react-router-dom";
import { SpotifyFooter } from "../../components/SpotifyFooter";
import { NjotifyLogo } from "../../styledComponents/NjotifyLogo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faBell,
  faCheck,
  faChevronRight,
  faLock,
  faPen,
} from "@fortawesome/free-solid-svg-icons";
import SongDetailTitle from "../../styledComponents/SongDetailTitle";
import DarkGrayBackground from "../../styledComponents/DarkGrayBackground";
import { useCurrentUserStore } from "../../state_management/currentUser";
import axios from "axios";
import { useToastStore } from "../../state_management/toastStore";
import ToastNotif from "../../components/ToastNotif";
export default function SettingsPage() {

  const { current_user, setCurrentUser } = useCurrentUserStore();
  const {
    message,
    ToastType,
    showToast,
    setMessage,
    setToastType,
    setShowToast,
  } = useToastStore();

  const logout = async () => {
    const response = await axios.post<WebResponse<null>>(
      `http://localhost:8888/user/logout/${current_user?.id}`,
      {},
      {
        withCredentials: true,
      }
    );
    console.log(response);
    setMessage(response.data.status);
    if (response.data.code == 200) {
      setToastType("Success");
      setTimeout(() => {
        window.location.replace("/Login");
      }, 2000);
    } else {
      setToastType("Failed");
    }
    setShowToast(true);
    setCurrentUser(null);
  };

  return (
    <>
      <div
        className="header row bg-black vw-100 vh-10 between"
        style={{ zIndex: 22 }}
      >
        <Link to="/Home" className="percent100 ml-10">
          <NjotifyLogo />
        </Link>
      </div>
      <div className="column bg-black vw-100 vh-100 center">
        <DarkGrayBackground>
          <div className="vw-60 h-auto p-20 white">
            <div className="wpercent100">
              <p className="b600 white fs-20">Account </p>
              <div className="column">
                {current_user?.role ==  "Admin" && (
<Link to="/ArtistVerification">
                  <div className="row between white hover p-10 mt-5">
                  <i className="fa-brands fa-spotify fs-25"></i>
                  <SongDetailTitle>Order History</SongDetailTitle>
                  <FontAwesomeIcon icon={faChevronRight} />
                </div>
</Link>
                )}
                <Link to="/EditProfile">
                  <div className="row between white hover p-10 mt-5">
                    <FontAwesomeIcon icon={faPen} className="fs-25" />
                    <SongDetailTitle>Edit Profile</SongDetailTitle>
                    <FontAwesomeIcon icon={faChevronRight} />
                  </div>
                </Link>
                <Link to="/GetVerified">
                  <div className="row between hover white p-10 mt-5">
                    <FontAwesomeIcon icon={faCheck} className="fs-25" />
                    <SongDetailTitle>Get Verified</SongDetailTitle>
                    <FontAwesomeIcon icon={faChevronRight} />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </DarkGrayBackground>
        <br />
        <DarkGrayBackground>
          <div className="vw-60 h-auto p-20 white">
            <div className="wpercent100">
              <p className="b600 white fs-20">Privacy & Security </p>
              <div className="column">
                <Link to={`/ResetPassword/${current_user?.id}`}>
                  <div className="row between hover p-10 mt-5 white">
                    <FontAwesomeIcon icon={faLock} className="fs-25" />
                    <SongDetailTitle>Change Password</SongDetailTitle>
                    <FontAwesomeIcon icon={faChevronRight} />
                  </div>
                </Link>
                <Link to="/NotificationSetting">
                  <div className="row between white hover p-10 mt-5">
                    <FontAwesomeIcon icon={faBell} className="fs-25" />
                    <SongDetailTitle>Notification Settings </SongDetailTitle>
                    <FontAwesomeIcon icon={faChevronRight} />
                  </div>
                </Link>

                <div className="row between hover p-10 mt-5" onClick={logout}>
                  <FontAwesomeIcon icon={faArrowRight} className="fs-25" />
                  <SongDetailTitle>Sign Out</SongDetailTitle>
                  <FontAwesomeIcon icon={faChevronRight} />
                </div>
              </div>
            </div>
          </div>
        </DarkGrayBackground>
      </div>
      {showToast && <ToastNotif message={message} type={ToastType} />}
      <div className="vw-100 vh-30 bg-black" style={{ overflow: "hidden" }}>
        <div style={{ overflow: "hidden" }} className="vh-30">
          <br />

          <SpotifyFooter />
        </div>
      </div>
    </>
  );
}
