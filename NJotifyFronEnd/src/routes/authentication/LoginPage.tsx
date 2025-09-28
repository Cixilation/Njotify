import { AuthenticationHeader } from "../../components/AuthenticationHeader";
import StyledBackground from "../../styledComponents/GradientBackground";
import { AuthenticationFooter } from "../../components/AuthenticationFooter";
import FormBg from "../../styledComponents/FormBackground";
import FormTitle from "../../styledComponents/FormTitile";
import { InputForm } from "../../components/InputForm";
import GreenButton from "../../styledComponents/GreenButton";
import HorizontalLine from "../../styledComponents/HorizontalLine";
import SmallLink from "../../styledComponents/SmallLink";
import { GoogleSignIn } from "../../components/GoogleAuthentication";
import { FormEvent, useState } from "react";
import ToastNotif from "../../components/ToastNotif";
import { useToastStore } from "../../state_management/toastStore";
import axios from "axios";
import { User } from "../../model/UserModel";
import { useCurrentUserStore } from "../../state_management/currentUser";

export default function LoginPage() {
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });
  const { message, setMessage, ToastType, setToastType, showToast, setShowToast } = useToastStore();
  const {setCurrentUser} = useCurrentUserStore(); 
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setUserInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if(userInfo.email == "" || userInfo.password == ""){
      setMessage("Please fill in all the fields!")
      setToastType("Warning")
      setShowToast(true)
      return
    }
    const response = await axios.post<WebResponse<User>>(
      "http://localhost:8888/user/login",
      {
        email: userInfo.email,
        password: userInfo.password,
      }, {
        withCredentials: true
      }
    );
    if (response.data.code === 200) {
      setCurrentUser(response.data.data)
      setToastType("Success");
      setTimeout(() => {
        window.location.replace("/Home");
      }, 3000);
    } else if (response.data.code === 502) {
      setToastType("Warning")
    } else if (response.data.code === 400){
      setToastType("Failed");
    }
    setMessage(response.data.status.toString())
    setShowToast(true)
  };
  return (
    <>
      <StyledBackground>
        <AuthenticationHeader />
        <FormBg>
          <div className="vw-30 vh-60 m-20 m-auto row center">
            <div className="">
              <div className="wpercent100 column center">
                <FormTitle>Login to Spotify</FormTitle>
                <div className="wpercent60 center row">
                  <GoogleSignIn />
                </div>
                <form
                  onSubmit={handleSubmit}
                  className="wpercent100 column center"
                >
                  <InputForm
                    type="Email"
                    name="email"
                    onChange={handleChange}
                  />
                  <InputForm
                    type="Password"
                    name="password"
                    onChange={handleChange}
                  />
                  <GreenButton type="submit" className="mt-15">
                    Log In
                  </GreenButton>

                </form>
                <SmallLink className="my-10">
                  Forgot your {" "}
                  <a href="/ForgottenAccount" className="white underlined b300">
                    password?
                  </a>
                </SmallLink>

                <HorizontalLine className="my-10"></HorizontalLine>
                <SmallLink>
                  Don't have an account?{" "}
                  <a href="/Register" className="white underlined b300">
                    Sign up for NJotify
                  </a>
                </SmallLink>
              </div>
            </div>
          </div>
        </FormBg>
        <AuthenticationFooter />
        {showToast && <ToastNotif message={message} type={ToastType} />}
      </StyledBackground>
    </>
  );
}
