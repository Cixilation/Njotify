import { AuthenticationHeader } from "../../components/AuthenticationHeader";
import StyledBackground from "../../styledComponents/GradientBackground";
import { AuthenticationFooter } from "../../components/AuthenticationFooter";
import FormBg from "../../styledComponents/FormBackground";
import FormTitle from "../../styledComponents/FormTitile";
import GreenButton from "../../styledComponents/GreenButton";
import { FormEvent } from "react";
import ToastNotif from "../../components/ToastNotif";
import { useToastStore } from "../../state_management/toastStore";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { WebResponse } from "../../model/WebResponse";

export default function AccountActivationPage() {
  const {id} = useParams()
  const { message, setMessage, ToastType, setToastType, showToast, setShowToast } = useToastStore();
  const navigate = useNavigate();


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await axios.put<WebResponse<null>>(`http://localhost:8888/user/activateaccount/${id}`)
    if(response.data.code == 200){
      setMessage(response.data.status)
      setToastType("Success")
    } else {
      setMessage("Something went wrong!");
      setToastType("Failed")
    }
    setShowToast(true);
    setTimeout(() => {
      navigate("/Login")
    }, 3000);
  };
  return (
    <>
      <StyledBackground>
        <AuthenticationHeader />
        <FormBg>
          <div className="vw-30 vh-30 m-25 m-auto row center">
              <div className="wpercent100 column center">
                <FormTitle>Activate Your Account</FormTitle>
                <form
                  onSubmit={handleSubmit}
                  className="wpercent100 column center"
                >
                  <GreenButton type="submit" className="mt-15">
                    Activate Account
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
