import { Link, useNavigate } from "react-router-dom";
import { SpotifyFooter } from "../../components/SpotifyFooter";
import { NjotifyLogo } from "../../styledComponents/NjotifyLogo";
import SongDetailTitle from "../../styledComponents/SongDetailTitle";
import GreenButton from "../../styledComponents/GreenButton";
import GrayButton from "../../styledComponents/GrayButton";
import BackButton from "../../components/BackButton";
import { useEffect, useState } from "react";
import { useCurrentUserStore } from "../../state_management/currentUser";
import { useToastStore } from "../../state_management/toastStore";
import ToastNotif from "../../components/ToastNotif";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { User } from "../../model/UserModel";

export default function EditProfilePage() {
  const { current_user, setCurrentUser } = useCurrentUserStore();
  useEffect(() => {
    const fetchUser = async () => {
      console.log("Page Reload");
      const response = await axios.get<WebResponse<User>>(
        `http://localhost:8888/user/requiresauth`, {
          withCredentials: true,
        }
      );

      console.log(response);
      setCurrentUser(response.data.data);
      setUserInfo({
        email: (response.data.data.email).toString(),
        gender: (response.data.data.gender).toString(),
        dob: (response.data.data.dob).toString(),
        country: (response.data.data.country).toString(),
      });
      if (response.data.code === 400) {
        setMessage("User Not Found!");
        setToastType("Failed");
        setShowToast(true);
      }
    };

    fetchUser();
  }, []);

  const {
    message,
    setMessage,
    ToastType,
    setToastType,
    showToast,
    setShowToast,
  } = useToastStore();

  const navigate = useNavigate();
  function back() {
    navigate(-1);
  }

  const [userInfo, setUserInfo] = useState({
    email:"",
    gender: "",
    dob: "",
    country: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUserInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (userInfo.gender == "" || userInfo.country == "" || userInfo.dob == "") {
      setMessage("Please fill in all of the fields");
      setToastType("Warning");
      setShowToast(true);
      return;
    }

    const response = await axios.post<WebResponse<null>>(
      "http://localhost:8888/user/edituser",
      {
        userid: current_user?.id,
        gender: userInfo.gender,
        country: userInfo.country,
        dob: userInfo.dob,
      }
    );

    if (response.data.code == 200) {
      setToastType("Success");
    }

    setMessage(response.data.status);
    setShowToast(true);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
   
  };

  function reload(){
    window.location.reload();
  }

  return (
    <>
      <div className="header row bg-black vw-100 vh-10 between">
        <Link to="/Home" className="percent100 ml-10">
          <NjotifyLogo />
        </Link>
      </div>

      <div className="column bg-black vw-100 vh-60 center">
        <div className="wpercent50 between row" onClick={back}>
          <BackButton />
          <div></div>
        </div>
        <div className="wpercent50 mt-5">
          <p className="b600 white fs-35">Edit Profile</p>

          <form className="wpercent80" onSubmit={handleSubmit}>
            <p>User ID</p>
            <SongDetailTitle>{current_user?.id}</SongDetailTitle>

            <SongDetailTitle className="mt-10">Email</SongDetailTitle>
            <input
              className="formInput"
              type="text"
              name="email"
              value={userInfo.email.toString()}
              placeholder="marvella.santoso@binus.ac.id"
              disabled
            />

            <SongDetailTitle className="mt-10">Gender</SongDetailTitle>
            <select
              className="formInput"
              name="gender"
              value={userInfo.gender.toString()}
              onChange={handleChange}
            >
              <option value=""></option>
              <option value="female">Female</option>
              <option value="male">Male</option>
            </select>

            <div className="row wpercent100 between">
              <div className="wpercent40" style={{ position: "relative" }}>
                <SongDetailTitle className="mt-10">
                  Date of Birth
                </SongDetailTitle>
                <input
                  className="formInput"
                  type="date"
                  name="dob"
                  value={userInfo.dob.toString()}
                  onChange={handleChange}
                />
                <FontAwesomeIcon
                  icon={faCalendarAlt}
                  style={{
                    position: "absolute",
                    right: "-2px",
                    top: "68%",
                    transform: "translateY(-50%)",
                    pointerEvents: "none",
                    color: "#999",
                  }}
                />
              </div>
              <div className="wpercent50">
                <SongDetailTitle className="mt-10">Country</SongDetailTitle>
                <input
                  className="formInput"
                  type="text"
                  name="country"
                  value={userInfo.country.toString()}
                  placeholder="Indonesia"
                  onChange={handleChange}
                />
              </div>
            </div>
            <br />
            <div className="row wpercent90">
              <div className="vw-10">
                <GrayButton onClick={reload}>Cancel</GrayButton>
              </div>
              <GreenButton type="submit">Save Profile</GreenButton>
            </div>
          </form>
        </div>
      </div>
      {showToast && <ToastNotif message={message} type={ToastType} />}
      <div className="vh-20"></div>
      <div className="footer vw-100 vh-30 bg-black">
        <br />
        <SpotifyFooter />
      </div>
    </>
  );
}
