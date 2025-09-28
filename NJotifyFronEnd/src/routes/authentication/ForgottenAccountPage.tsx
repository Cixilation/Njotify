import { AuthenticationHeader } from "../../components/AuthenticationHeader";
import StyledBackground from "../../styledComponents/GradientBackground";
import { AuthenticationFooter } from "../../components/AuthenticationFooter";
import FormBg from "../../styledComponents/FormBackground";
import FormTitle from "../../styledComponents/FormTitile";
import { InputForm } from "../../components/InputForm";
import GreenButton from "../../styledComponents/GreenButton";
import SmallLink from "../../styledComponents/SmallLink";
import { FormEvent, useState } from "react";
import ToastNotif from "../../components/ToastNotif";
import { useToastStore } from "../../state_management/toastStore";
import axios from "axios";

export default function ForgottenAccountPage() {
  const [userInfo, setUserInfo] = useState({
    email: ""
  });

  const { message, setMessage, ToastType, setToastType, showToast, setShowToast } = useToastStore();

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setUserInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));

    console.log(userInfo);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(userInfo.email == ""){
      setMessage("Please fill in all the fields!")
      setToastType("Warning")
      setShowToast(true);
      return
    }

    const response = await axios.post<WebResponse<null>>(`http://localhost:8888/user/forgotaccount/${userInfo.email}`)

    if(response.data.code == 200){
      setToastType("Success")
    } else {
      setToastType("Failed")
    }

    setMessage(response.data.status)
    setShowToast(true)


    console.log(userInfo);
  };
  return (
    <>
      <StyledBackground>
        <AuthenticationHeader />
        <FormBg>
          <div className="vw-30 vh-40 m-25 m-auto row center">
            <div className="wpercent100">
              <div className="wpercent100 column center">
                <FormTitle>Find Your Account</FormTitle>
                <form
                  onSubmit={handleSubmit}
                  className="wpercent100 column center"
                >
                  <InputForm
                    type="Email"
                    name="email"
                    onChange={handleChange}
                  />
                  <GreenButton type="submit" className="my-15">
                    Search
                  </GreenButton>
                </form>
                <SmallLink>
                  <a href="/Login" className="white underlined b300">
                    Cancel
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
