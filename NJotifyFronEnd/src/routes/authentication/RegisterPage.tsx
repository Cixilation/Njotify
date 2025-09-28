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
import { FormEvent, useEffect, useState } from "react";
import ToastNotif from "../../components/ToastNotif";
import { useToastStore } from "../../state_management/toastStore";
import axios from "axios";
import { User } from "../../model/UserModel";

export default function RegisterPage() {
  const {
    message,
    setMessage,
    ToastType,
    setToastType,
    showToast,
    setShowToast,
  } = useToastStore();

  const [userInfo, setUserInfo] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [hasNumeric, setHasNumeric] = useState(false);
  const [hasNonNumeric, setHasNonNumeric] = useState(false);
  const [hasUppercase, setHasUppercase] = useState(false);

  useEffect(() => {
    handleChange;
  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setUserInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));

    for (let i = 0; i < userInfo.password.length; i++) {
      const char = userInfo.password[i];
      if (!isNaN(Number(char))) {
        setHasNumeric(true);
      }
      if (isNaN(Number(char))) {
        setHasNonNumeric(true);
      }
      if (char === char.toUpperCase() && isNaN(Number(char))) {
        setHasUppercase(true);
      }
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      userInfo.confirmPassword == "" ||
      userInfo.password == "" ||
      userInfo.email == ""
    ) {
      setToastType("Warning");
      setMessage("Please fill out all the fields!");
    }
    if (
      userInfo.confirmPassword != "" ||
      userInfo.password != "" ||
      userInfo.email != ""
    ) {
      if (!hasNonNumeric) {
        setToastType("Failed");
        setMessage("Password Must include a character!");
      } else if (!hasNumeric) {
        setToastType("Failed");
        setMessage("Password Must include a  number!");
      } else if (!hasUppercase) {
        setToastType("Failed");
        setMessage("Password Must include an  uppercase letter!");
      } else if (userInfo.password !== userInfo.confirmPassword) {
        setMessage("Password and the confirmation password is not the same!");
      } else {
        let userName = userInfo.userName;
        let email = userInfo.email;
        let password = userInfo.password;

        const response = await axios.post<WebResponse<User>>(
          "http://localhost:8888/user/register",
          {
            userName: userName,
            email: email,
            password: password,
            status: "Unactivated",
            profilePicture: "../../assets/music.png",
          }
        );
        setShowToast(true);
        if (response.data.code === 200) {
          setMessage("Register Successful please open your Email to activate!");
          setToastType("Success");
          setTimeout(() => {
            window.location.replace("/Login");
          }, 3000);
        } else if (response.data.code === 400) {
          setToastType("Warning");
          setMessage(response.data.status.toString());
        }
      }
    }

  };

  return (
    <>
      <StyledBackground>
        <AuthenticationHeader />
        <FormBg>
          <div className="vw-40 vh-70 m-25 m-auto row center">
            <div className="">
              <div className="wpercent100 column center">
                <FormTitle>Sign up to start listening</FormTitle>
                <div className="wpercent60 center row">
                  <GoogleSignIn />
                </div>
                <form
                  onSubmit={handleSubmit}
                  className="wpercent100 column center"
                >
                  <div className="row between vw-35">
                    <InputForm
                      type="Email"
                      name="email"
                      onChange={handleChange}
                    />
                    <InputForm
                      type="User Name"
                      name="userName"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="row between vw-35">
                    <InputForm
                      type="Password"
                      name="password"
                      onChange={handleChange}
                    />
                    <InputForm
                      type="Confirm Password"
                      name="confirmPassword"
                      onChange={handleChange}
                    />
                  </div>
                  <p className="fs-14 b600 white mt-5">
                    Your password must contain at least :{" "}
                  </p>
                  <ul className="fs-11">
                    <li> 1 letter</li>
                    <li> 1 number</li>
                    <li> 1 Uppercase letter</li>
                  </ul>
                  <GreenButton
                    type="submit"
                    onClick={handleChange}
                    className="mt-15"
                  >
                    Sign Up
                  </GreenButton>
                </form>
                <HorizontalLine className="my-10"></HorizontalLine>
                <SmallLink>
                  Already have an account?{" "}
                  <a href="/Login" className="white underlined b300">
                    Log in NJotify
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
