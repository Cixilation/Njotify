import {
  faChevronLeft,
  faChevronRight,
  faSearch,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import useNavigationStore from "../state_management/useNaviagtionStore";
import { useSearchResultStore } from "../state_management/searchPageResult";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCurrentUserStore } from "../state_management/currentUser";
import { useToastStore } from "../state_management/toastStore";
import ArtistImage from "../styledComponents/ArtistImage";
import FollowNotification from "./PushNotification";
import { SearchResultModel } from "../model/SearchModel";

function debounce<T extends (...args: any[]) => void>(func: T, delay: number) {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
}

export function SpotifyHeader() {
  const activeSection = useNavigationStore((state) => state.activeSection);
  const { setSearchResult, setLoading, setResult, loading } =
    useSearchResultStore();

  const [menuVisible, setMenuVisible] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setMenuVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const { current_user, setCurrentUser } = useCurrentUserStore();
  const { setMessage, setToastType, setShowToast } = useToastStore();

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
      }, 1000);
    } else {
      setToastType("Failed");
    }
    setShowToast(true);
    setCurrentUser(null);
  };

  const navigate = useNavigate();

  function back() {
    navigate(-1);
  }

  function foward() {
    navigate(+1);
  }

  const handleOpenSettings = () => {
    const newTab = window.open();
    if (newTab) {
      newTab.opener = null;
      newTab.location = "/Setting";
    }
  };

  const handleSearchInputChange = debounce(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setResult(value);
      const timer = setTimeout(async () => {
        setLoading(false);
        const response = await axios.get<WebResponse<SearchResultModel>>(
          `http://localhost:8888/searches/search/${value}`
        );
        setSearchResult(response.data.data);
      }, 2000);
      return () => clearTimeout(timer);
    },
    3000
  );

  return (
    <>
      <div className="row between vh-10" style={{ zIndex: 1000 }}>
        <FollowNotification userId={String(current_user?.id)} />
        <div className="row between wpercent70">
          <div className="row sw-10 between ">
            <BlackIcon onClick={back}>
              <FontAwesomeIcon icon={faChevronLeft} />
            </BlackIcon>
            <BlackIcon onClick={foward}>
              <FontAwesomeIcon icon={faChevronRight} />
            </BlackIcon>
          </div>

          {activeSection === "search" && (
            <div
              className="gray-transparent wpercent70 row p-2 px-10 center between  "
              style={{ borderRadius: "50px" }}
            >
              <FontAwesomeIcon icon={faSearch} className="mr-10" />
              <InputField
                type="text"
                placeholder="What do you want to play?"
                onChange={handleSearchInputChange}
              />
            </div>
          )}
        </div>

        <div className="user-menu-container">
          <div className="vw-3 sh-3" onClick={toggleMenu}>
            <ArtistImage
              src={`http://localhost:8888/profile_pictures/${current_user?.id}.jpeg`}
            />
          </div>
          {menuVisible && (
            <div className="user-menu" ref={menuRef}>
              <Link to={`/Profile/${current_user?.id}`}>
                <button>Profile</button>
              </Link>
              <button onClick={handleOpenSettings}>Settings</button>
              <button onClick={logout}>Logout</button>
            </div>
          )}
        </div>
      </div>
      {loading && <LoadingScreen />}
    </>
  );
}

export const BlackIcon = styled.div`
  font-size: 2vh;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.8vw;
  border-radius: 50%;
  &:hover {
    color: rgba(255, 255, 255, 0.9);
    background-color: rgba(30, 30, 30, 1);
  }
`;

const InputField = styled.input`
  background: none;
  font-size: 14px;
  outline: none;
  color: white;
  width: 20vw;
  padding: 2px;
  border: none;
  border-color: none;

  &:focus {
    outline: none;
    box-shadow: none;
  }
`;
const LoadingScreen = () => (
  <LoadingContainer>
    <FontAwesomeIcon icon={faSpinner} spin size="3x" />
    <LoadingText>Loading...</LoadingText>
  </LoadingContainer>
);

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  color: white;
`;

const LoadingText = styled.p`
  margin-top: 10px;
  font-size: 18px;
`;
