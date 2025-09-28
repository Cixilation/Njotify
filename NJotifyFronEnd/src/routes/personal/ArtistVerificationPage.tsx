import { Link } from "react-router-dom";
import { SpotifyFooter } from "../../components/SpotifyFooter";
import { NjotifyLogo } from "../../styledComponents/NjotifyLogo";
import ArtistImage from "../../styledComponents/ArtistImage";
import { faCheckCircle, faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useCurrentUserStore } from "../../state_management/currentUser";
import axios from "axios";
import { User } from "../../model/UserModel";
import { useToastStore } from "../../state_management/toastStore";
import ToastNotif from "../../components/ToastNotif";


export default function ArtistVerificationPage() {
  const {
    message,
    ToastType,
    showToast,
  } = useToastStore();
  const [users, setUsers] = useState<User[]>([]);

  const { current_user } = useCurrentUserStore();
  useEffect(() => {
    const fetchNotifications = async () => {
      const response = await axios.get<WebResponse<User[]>>(
        `http://localhost:8888/user/getverifyrequest`
      );
      setUsers(response.data.data);
    };
    fetchNotifications();
  }, [current_user]);
  return (
    <>
      <div className="header row bg-black vw-100 vh-10 between">
        <Link to="/Home" className="percent100 ml-10">
          <NjotifyLogo />
        </Link>
      </div>
     

      <div className="column vw-100 vh-50 center">
        <div className="wpercent60 ">
          <p className="b600 black fs-35">Admin Page </p>
          <p className="b600 black fs-20">Verify Artist </p>
          <br />
          <div className=" vh-40" style={{overflowX:"scroll"}}>

          {users != null ? users.map((user: User) => (
              <VerifyArtistComponent key={String(user.id)} user={user} /> 
            )) : <>
                <p className="b400 black fs-40"> There is no request at the moment...</p>
            </>}
          
          </div>
        </div>
      {showToast && <ToastNotif message={message} type={ToastType} />}
      </div>
      <div className=" vh-20">
      </div>
      <div className="footer vw-100 vh-30 bg-black">
        <br />
        <SpotifyFooter />
      </div>
    </>
  );
}


function VerifyArtistComponent({user} : {user: User}){
  const {
    setMessage,
    setToastType,
    setShowToast,
  } = useToastStore();



  const [following, setFollowing] = useState(0);
  const [follower, setFollower] = useState(0);

  const { current_user } = useCurrentUserStore();
  useEffect(() => {
    const getFollowingFollower = async () => {
      const response = await axios.get<WebResponse<User[]>>(
        `http://localhost:8888/user/follow/getfollowing/${user.id}`
      );
      setFollowing(response.data.data.length)

      const followerResponse = await axios.get<WebResponse<User[]>>(
        `http://localhost:8888/user/follow/getfollower/${user.id}`
      );
      setFollower(followerResponse.data.data.length)
    };
    getFollowingFollower();
  }, [current_user]);




   async function AcceptArtist(){
    const response  = await axios.post(`http://localhost:8888/artist/accept/${user.id}`)

    if (response.data.code === 200) {
      setToastType("Success");
    } else if (response.data.code === 502) {
      setToastType("Warning");
    } else if (response.data.code === 400) {
      setToastType("Failed");
    }
    setMessage(response.data.status);
    setShowToast(true);
    window.location.reload();

  }

  async function RejectArtist(){
    const response  = await axios.post(`http://localhost:8888/artist/reject/${user.id}`)

    if (response.data.code === 200) {
      setToastType("Success");
    } else if (response.data.code === 502) {
      setToastType("Warning");
    } else if (response.data.code === 400) {
      setToastType("Failed");
    }
    setMessage(response.data.status);
    setShowToast(true);
    window.location.reload();
  }

  const handleOpenProfilePage = () => {
    const newTab = window.open();
    if (newTab) {
      newTab.opener = null;
      newTab.location = `/Profile/${user.id}`;
    }
  };

  return (
    <div className="between row wpercent100 h-auto my-15">
    <div className="row">
      <div className="vw-6 sh-6 mr-15" onClick={handleOpenProfilePage}> 
        <ArtistImage src={`http://localhost:8888/profile_pictures/${user.profilepicture}`} />
      </div>
      <div className="column">
        <p className="b600 black fs-20"> {(user.name).toString()}</p>
        <p className="b600 black fs-12"> {follower} Follower • {following} Following</p>
      </div>
    </div>
    <div>
    <FontAwesomeIcon onClick={RejectArtist} icon={faXmarkCircle} className="fs-30 mr-10" style={{color:"red"}}/>
    <FontAwesomeIcon onClick={AcceptArtist} icon={faCheckCircle} className="fs-30" style={{color:"green"}}/>
    </div>
  </div>
  )
}