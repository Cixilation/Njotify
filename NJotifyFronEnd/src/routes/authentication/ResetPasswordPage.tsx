import { AuthenticationHeader } from "../../components/AuthenticationHeader";
import StyledBackground from "../../styledComponents/GradientBackground";
import { AuthenticationFooter } from "../../components/AuthenticationFooter";
import FormBg from "../../styledComponents/FormBackground";
import FormTitle from "../../styledComponents/FormTitile";
import { InputForm } from "../../components/InputForm";
import GreenButton from "../../styledComponents/GreenButton";
import { FormEvent, useState } from "react";
import ToastNotif from "../../components/ToastNotif";
import { useToastStore } from "../../state_management/toastStore";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function ResetPasswordPage() {
  const {id} = useParams()
  
  const [userInfo, setUserInfo] = useState({
    password: "",
    confirmPassword: "",
  });

  const { message, setMessage, ToastType, setToastType, showToast, setShowToast } = useToastStore();

  const [hasNumeric, setHasNumeric] = useState(false);
  const [hasNonNumeric, setHasNonNumeric] = useState(false);
  const [hasUppercase, setHasUppercase] = useState(false);

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
    console.log(userInfo);
    if(userInfo.password == "" || userInfo.confirmPassword =="" ){
      setMessage("Please fill in all the fields!")
      setToastType("Warning")
      setShowToast(true);
      return
    }

 

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
    } else if(userInfo.password !==  userInfo.confirmPassword ){
      setMessage("Password and Confirmation Password dont match!")
      setToastType("Failed")
      setShowToast(true);
      return
    } else { 
      const response = await axios.post<WebResponse<null>>(`http://localhost:8888/user/resetpassword`,{
        userid : id,
        password : userInfo.password
      })
      setMessage(response.data.status.toString());
      if (response.data.code === 200) {
        setToastType("Success");
        setTimeout(() => {
          window.location.replace("/Login");
        }, 3000);
      } else if (response.data.code === 400) {
        setToastType("Failed");
      }
    }
      

    setShowToast(true);
   
  };
  return (
    <>
      <StyledBackground>
        <AuthenticationHeader />
        <FormBg>
          <div className="vw-30 vh-50 m-25 m-auto row center">
              <div className="wpercent100 column center">
                <FormTitle>Reset Password</FormTitle>
                <form
                  onSubmit={handleSubmit}
                  className="wpercent100 column center"
                >
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
                  <p className="fs-14 b600 white mt-5">
                    Your password must contain at least :{" "}
                  </p>
                  <ul className="fs-11">
                    <li> 1 letter</li>
                    <li> 1 number</li>
                    <li> 1 Uppercase letter</li>
                  </ul>
                  <GreenButton type="submit" className="mt-15">
                    Reset Password
                  </GreenButton>
                </form>
              </div>

          </div>
        </FormBg>
        <AuthenticationFooter />
        {showToast && <ToastNotif message={message} type={ToastType} />}
      </StyledBackground>
    </>
  );
}
