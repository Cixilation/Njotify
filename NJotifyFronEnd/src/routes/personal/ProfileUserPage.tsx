import { SpotifyHeader } from "../../components/SpotifyHeader";
import MasterPage from "../../master_component/Template";
import useSidebarStore from "../../state_management/useSidebarToggle";
import MainContent from "../../styledComponents/MainContent";
import ArtistImage from "../../styledComponents/ArtistImage";
import SongDetailTitle from "../../styledComponents/SongDetailTitle";
import { GalleryPlaylistPiece } from "../../components/HomeGalleryPiece";
import SongTitle from "../../styledComponents/SongTitle";
import { Link, useNavigate, useParams } from "react-router-dom";
import SmallLink from "../../styledComponents/SmallLink";
import { useEffect, useState } from "react";
import GreenButton from "../../styledComponents/GreenButton";
import { useCurrentUserStore } from "../../state_management/currentUser";
import { User } from "../../model/UserModel";
import axios from "axios";
import { useToastStore } from "../../state_management/toastStore";
import { Artist } from "../../model/ArtistModel";

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { setMessage, setToastType, setShowToast } = useToastStore();
  const { current_user } = useCurrentUserStore();

  const [userInfo, setUserInfo] = useState({
    following: null as User[] | null,
    follower: null as User[] | null,
    mutual: null as User[] | null,
    followingText: "Follow",
    profileUser: null as User | null,
    publicPlaylist: null as Playlist[] | null,
  });

  const updateUserInfo = (newUserInfo: Partial<typeof userInfo>) => {
    setUserInfo((prevState) => ({
      ...prevState,
      ...newUserInfo,
    }));
  };

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    const formData = new FormData();
    if (current_user?.id !== undefined && selectedFile !== undefined) {
      const id = current_user.id.toString();
      formData.append("userid", id);
      formData.append("picture", selectedFile);
    }

    const response = await axios.post<WebResponse<null>>(
      `http://localhost:8888/user/updateuserprofile`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (response.data.code === 200) {
      setToastType("Success");
    } else if (response.data.code === 502) {
      setToastType("Warning");
    } else if (response.data.code === 400) {
      setToastType("Failed");
    }
    setMessage(response.data.status);
    setShowToast(true);
  }

  async function followToggle() {
    if (userInfo.followingText === "Follow") {
      await axios.post("http://localhost:8888/follow/create", {
        followerid: current_user?.id,
        followingid: id,
      });
    } else {
      await axios.post("http://localhost:8888/follow/delete", {
        followerid: current_user?.id,
        followingid: id,
      });
    }
    window.location.reload();
  }

  async function getArtist() {
    const response = await axios.get<WebResponse<Artist>>(
      `http://localhost:8888/artist/${id}`
    );
    if (response.data.code === 200) {
      if (response.data.data.description !== "") {
        navigate(`/VerifiedArtist/${id}`);
      }
    }
  }

  async function getPlaylistFromThisArtist() {
    const response = await axios.get<WebResponse<Playlist[]>>(
      `http://localhost:8888/playlist/getpublicplaylist/${id}`
    );
    updateUserInfo({ publicPlaylist: response.data.data.slice(0, 6) });
  }

  useEffect(() => {
    const getUser = async () => {
      const response = await axios.get<WebResponse<User>>(
        `http://localhost:8888/user/${id}`
      );
      updateUserInfo({ profileUser: response.data.data });
    };

    const getFollowingFollower = async () => {
      const followingResponse = await axios.get<WebResponse<User[]>>(
        `http://localhost:8888/follow/getfollowing/${id}`
      );
      if (followingResponse.data.data != null) {
        updateUserInfo({ following: followingResponse.data.data.slice(0, 6) });
      }

      const followerResponse = await axios.get<WebResponse<User[]>>(
        `http://localhost:8888/follow/getfollower/${id}`
      );
      if (followerResponse.data.data != null) {
        updateUserInfo({ follower: followerResponse.data.data.slice(0, 6) });
      }
      const currentUserFollowing = followerResponse.data.data.some(
        (user) => user.id === current_user?.id
      );
      updateUserInfo({
        followingText: currentUserFollowing ? "Unfollow" : "Follow",
      });

      if (current_user?.id !== id) {
        const mutualResponse = await axios.get<WebResponse<User[]>>(
          `http://localhost:8888/follow/getmutuals/${current_user?.id}/${id}`
        );
        if (mutualResponse.data.data != null) {
          updateUserInfo({ mutual: mutualResponse.data.data });
        }
      }
    };

    getUser();
    getFollowingFollower();
    if (id !== current_user?.id) {
      getArtist();
    }
    getPlaylistFromThisArtist();
  }, [id]);

  const isMusicDetailsVisible = useSidebarStore(
    (state) => state.isMusicDetailsVisible
  );
  const [hover, setHover] = useState(false);

  return (
    <MasterPage
      component={
        <>
          <MainContent sideBar={isMusicDetailsVisible}>
            <div className="row center">
              <div className="wpercent90">
                <SpotifyHeader />
                <br />
                <div className="row wpercent100 between ">
                  <div
                    className="vw-15"
                    style={{
                      position: "relative",
                      display: "inline-block",
                      cursor: "pointer",
                    }}
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                  >
                    <ArtistImage
                      src={`http://localhost:8888/profile_pictures/${userInfo.profileUser?.profilepicture}`}
                    />
                    {id === current_user?.id && hover && (
                      <label htmlFor="file-upload">
                        <input
                          type="file"
                          id="file-upload"
                          onChange={handleFileChange}
                          style={{ display: "none" }}
                        />
                        <div
                          className="fs-14 b500 row center"
                          style={{
                            width: "16vw",
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                          }}
                        >
                          Change Profile Picture
                        </div>
                      </label>
                    )}
                  </div>
                  <div className="column wpercent70">
                    <SongDetailTitle>Profile</SongDetailTitle>
                    <p className="fs-50 b600">{userInfo.profileUser?.name}</p>
                    <div className="row wpercent70 between">
                      <SongDetailTitle>
                        {userInfo.publicPlaylist?.length || 0} Public Playlist
                      </SongDetailTitle>
                      <SongDetailTitle>
                        {userInfo.follower?.length || 0} Followers
                      </SongDetailTitle>
                      <SongDetailTitle>
                        {userInfo.following?.length || 0} Following
                      </SongDetailTitle>
                    </div>
                    {id !== current_user?.id && (
                      <>
                        <br />
                        <br />
                        <GreenButton onClick={followToggle}>
                          {userInfo.followingText}
                        </GreenButton>
                      </>
                    )}
                  </div>
                </div>
                <br />
                <br />
                <div className="row between">
                  <p className="fs-20 b600">Public Playlist</p>
                  <div className="hover">
                    <Link to={`/ShowMore/Playlist/${id}`}>
                      <SmallLink className="b500 p-3">Show More</SmallLink>
                    </Link>
                  </div>
                </div>
                <br />
                <div className="grid6">
                  {userInfo.publicPlaylist &&
                    userInfo.publicPlaylist.map((pl) => (
                      <GalleryPlaylistPiece key={pl.id} playlist={pl} />
                    ))}
                </div>
                <br />
                <br />
                <div className="row between">
                  <p className="fs-20 b600 mb-10">Following</p>
                  <div className="hover">
                    <Link to={`/ShowMore/Following/${id}`}>
                      <SmallLink className="b500 p-3">Show More</SmallLink>
                    </Link>
                  </div>
                </div>
                <div className="grid6">
                  {userInfo.following &&
                    userInfo.following.map((fol) => (
                      <Link to={`/Profile/${fol.id}`}>
                        <div className="mr-10">
                          <div className="vw-12">
                            <ArtistImage
                              src={`http://localhost:8888/profile_pictures/${fol.profilepicture}`}
                            />
                          </div>
                          <SongTitle>{fol.name}</SongTitle>
                          <SongDetailTitle>Profile</SongDetailTitle>
                        </div>
                      </Link>
                    ))}
                </div>
                <br />
                <br />
                <div className="row between">
                  <p className="fs-20 b600 mb-10">Followers</p>
                  <div className="hover">
                    <Link to={`/ShowMore/Follower/${id}`}>
                      <SmallLink className="b500 p-3">Show More</SmallLink>
                    </Link>
                  </div>
                </div>
                <div className="grid6">
                  {userInfo.follower &&
                    userInfo.follower.map((fol) => (
                      <Link to={`/Profile/${fol.id}`}>
                        <div className="mr-10">
                          <div className="vw-12">
                            <ArtistImage
                              src={`http://localhost:8888/profile_pictures/${fol.profilepicture}`}
                            />
                          </div>
                          <SongTitle>{fol.name}</SongTitle>
                          <SongDetailTitle>Profile</SongDetailTitle>
                        </div>
                      </Link>
                    ))}
                </div>
                <br />
                <br />
                {current_user?.id != id && (
                  <>
                    <p className="fs-20 b600 mb-10">Mutual Following</p>
                    <div className="grid6">
                      {userInfo.mutual &&
                        userInfo.mutual.map(
                          (fol) =>
                            fol.id != current_user?.id && (
                              <div className="mr-10">
                                <div className="vw-12">
                                  <ArtistImage
                                    src={`http://localhost:8888/profile_pictures/${fol.profilepicture}`}
                                  />
                                </div>
                                <SongTitle>{fol.name}</SongTitle>
                                <SongDetailTitle>Profile</SongDetailTitle>
                              </div>
                            )
                        )}
                    </div>
                  </>
                )}
                <br />
                <br />
                <br />
              </div>
            </div>
          </MainContent>
        </>
      }
    />
  );
}
