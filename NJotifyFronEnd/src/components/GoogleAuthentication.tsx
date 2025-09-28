import { useGoogleLogin } from "@react-oauth/google";
// import { GoogleLogin } from "@react-oauth/google";
// import { jwtDecode } from "jwt-decode";
import GoogleLogo from "../assets/GoogleLogo.png";
import axios from "axios";
import { User } from "../model/UserModel";
import { useToastStore } from "../state_management/toastStore";
import { useCurrentUserStore } from "../state_management/currentUser";
import { useNavigate } from "react-router-dom";

export function GoogleSignIn() {
  const { setMessage, setToastType, setShowToast } = useToastStore();
  const { setCurrentUser } = useCurrentUserStore();
  const navigate = useNavigate();
  const login = useGoogleLogin({
    onSuccess: async (response) => {
      const res = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: {
            Authorization: `Bearer ${response.access_token}`,
          },
        }
      );
      const backEndResponse = await axios.post<WebResponse<User>>(
        "http://localhost:8888/user/googlelogin",
        {
          userName: res.data.name,
          email: res.data.email,
          password: "",
          status: "Activated",
          profilePicture: "",
        },
        {
          withCredentials: true,
        }
      );

      if (backEndResponse.data.code === 200) {
        setToastType("Success");
        setMessage(backEndResponse.data.status);
        setShowToast(true);
        const user: User = {
          id: backEndResponse.data.data.id,
          name: backEndResponse.data.data.name,
          email: backEndResponse.data.data.email,
          role: backEndResponse.data.data.role,
          country: backEndResponse.data.data.country,
          dob: backEndResponse.data.data.dob,
          gender: backEndResponse.data.data.id,
          profilepicture: backEndResponse.data.data.profilepicture,
          status: backEndResponse.data.data.status,
        };

        navigate("/Home");
        setTimeout(() => {
          setCurrentUser(user);
        }, 2000);
      } else if (backEndResponse.status === 400) {
        setShowToast(true);
        setToastType("Failed");
        setMessage(backEndResponse.statusText);
      }
    },
  });

  return (
    <button
      onClick={() => login()}
      className="row center mb-10 wpercent90"
      style={{
        backgroundColor: "black",
        color: "white",
        border: "1px solid rgba(255, 255, 255, 0.5)",
        cursor: "pointer",
        borderRadius: "50px",
      }}
    >
      <img className="wpercent10" src={GoogleLogo} alt="" />
      <p className="fs-14 ml-3">Sign in with Google</p>
    </button>
  );
}
