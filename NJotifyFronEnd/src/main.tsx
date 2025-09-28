import React, { ReactNode, useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./style/colouring.css";
import "./style/positioning.css";
import "./style/sizing.css";
import "./style/fonting.css";
import "./index.css";
import "./style/style.scss";
import "./style/universal.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";

// Authentication
import LoginPage from "./routes/authentication/LoginPage.tsx";
import RegisterPage from "./routes/authentication/RegisterPage.tsx";
import ForgottenAccountPage from "./routes/authentication/ForgottenAccountPage.tsx";
import ResetPasswordPage from "./routes/authentication/ResetPasswordPage.tsx";
import AccountActivationPage from "./routes/authentication/AccountActivationPage.tsx";
// Spotify
import HomePage from "./routes/spotify/HomePage.tsx";
import SearchPage from "./routes/spotify/SearchPage.tsx";
import CreateMusicPage from "./routes/spotify/CreateMusicPage.tsx";
import PlaylistPage from "./routes/spotify/PlaylistPage.tsx";
import ShowMorePage from "./routes/spotify/ShowMorePage.tsx";
import VerifiedArtistPage from "./routes/spotify/VerifiedArtistPage.tsx";
import TrackPage from "./routes/spotify/TrackPage.tsx";
import AlbumPage from "./routes/spotify/AlbumPage.tsx";
//Personal
import YourPostPage from "./routes/personal/YourPostsPage.tsx";
import ProfilePage from "./routes/personal/ProfileUserPage.tsx";
import EditProfilePage from "./routes/personal/EditProfilePage.tsx";
import ArtistVerificationPage from "./routes/personal/ArtistVerificationPage.tsx";
import SettingsPage from "./routes/personal/SettingsPage.tsx";
import GetVerifiedPage from "./routes/personal/GetVerifiedPage.tsx";
import NotificationSettingsPage from "./routes/spotify/NotificationSettingsPage.tsx";
import { useCurrentUserStore } from "./state_management/currentUser.ts";
import axios from "axios";
import { User } from "./model/UserModel";

const router = createBrowserRouter([
  // Authentication
  { path: "/Login",   element: <AuthLoggedMiddleWare component={<LoginPage />} />},
  { path: "/Register",  element: <AuthLoggedMiddleWare component={<RegisterPage />} />},
  { path: "/ForgottenAccount", element: <AuthLoggedMiddleWare component={<ForgottenAccountPage />} />},
  { path: "/ResetPassword/:id", element: <AuthLoggedMiddleWare component={<ResetPasswordPage />} />},
  { path: "/AccountActivation/:id", element: <AuthLoggedMiddleWare component={<AccountActivationPage />} />},
  { path: "/", element: <Navigate to="/Login" replace /> },
  // Spotify
  { path: "/Home", element: <AuthNotLoggedMiddleWare component={<HomePage />} /> },
  { path: "/Search", element: <AuthNotLoggedMiddleWare component={<SearchPage />} /> },
  { path: "/Album/:id", element: <AuthNotLoggedMiddleWare component={<AlbumPage />} /> },
  { path: "/CreateMusic", element: <AuthNotLoggedMiddleWare component={<CreateMusicPage />} /> },
  { path: "/Playlist/:id", element: <AuthNotLoggedMiddleWare component={<PlaylistPage />} /> },
  { path: "/Track/:id", element: <AuthNotLoggedMiddleWare component={<TrackPage />} /> },
  { path: "/ShowMore/:type/:userid", element: <AuthNotLoggedMiddleWare component={<ShowMorePage />} /> },
  { path: "/VerifiedArtist/:id", element: <AuthNotLoggedMiddleWare component={<VerifiedArtistPage />} /> },

  //Personal
  { path: "/YourPost/:id", element: <AuthNotLoggedMiddleWare component={<YourPostPage />} /> },
  { path: "/Profile/:id", element: <AuthNotLoggedMiddleWare component={<ProfilePage />} /> },
  { path: "/ArtistVerification", element: <AuthAdminMiddleWare component={<ArtistVerificationPage />} /> },
  { path: "/Setting", element: <AuthNotLoggedMiddleWare component={<SettingsPage />} /> },
  { path: "/NotificationSetting", element: <AuthNotLoggedMiddleWare component={<NotificationSettingsPage />} /> },
  { path: "/EditProfile", element: <AuthNotLoggedMiddleWare component={<EditProfilePage />} /> },
  { path: "/GetVerified", element: <AuthNotLoggedMiddleWare component={<GetVerifiedPage />} /> },

]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="379986435870-et6ms9kvfb8ul7uk4dj9avpmfenoqant.apps.googleusercontent.com">
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
  </React.StrictMode>
);



const { setCurrentUser } = useCurrentUserStore();
export async function fetchUser  ()  {
    const response = await axios.get<WebResponse<User>>(
      `http://localhost:8888/user/requiresauth`, {
        withCredentials: true,
      }
    );
    if (response.data.code === 200) {
      setCurrentUser(response.data.data);
    } else {
      setCurrentUser(null);
    }
};

export function AuthNotLoggedMiddleWare({ component }: { component: ReactNode }) {
  const { current_user } = useCurrentUserStore();
  useEffect(() => { 
    fetchUser();
  }, []);

  if (!current_user) {
    return <Navigate to="/Login" />;
  }
  return <>{component}</>;
}

export function AuthLoggedMiddleWare({ component }: { component: ReactNode }) {
  const { current_user } = useCurrentUserStore();

  useEffect(() => { 
    fetchUser();
  }, []);

  if (current_user) {
    return <Navigate to="/Home" />;
  }
  return <>{component}</>;
}

export function AuthAdminMiddleWare({ component }: { component: ReactNode }) {
  const { current_user } = useCurrentUserStore();

  useEffect(() => { 
    fetchUser();
  }, []);

  if (!current_user || current_user.role !== "Admin") {
    return <Navigate to="/Home" />;
  }
  return <>{component}</>;
}


































// const router = createBrowserRouter([
//   // Authentication
//   { path: "/Login", element: <LoginPage /> },
//   { path: "/Register", element: <RegisterPage /> },
//   { path: "/ForgottenAccount", element: <ForgottenAccountPage /> },
//   { path: "/ResetPassword/:id", element: <ResetPasswordPage /> },
//   { path: "/AccountActivation/:id", element: <AccountActivationPage /> },
//   { path: "/", element: <Navigate to="/Login" replace /> },
//   // Spotify
//   { path: "/Home", element: <HomePage /> },
//   { path: "/Search", element: <SearchPage /> },
//   { path: "/Album", element: <AlbumPage /> },
//   { path: "/CreateMusic", element: <CreateMusicPage /> },
//   { path: "/Playlist", element: <PlaylistPage /> },
//   { path: "/Track", element: <TrackPage /> },
//   { path: "/ShowMore", element: <ShowMorePage /> },
//   { path: "/VerifiedArtist", element: <VerifiedArtistPage /> },

//   //Personal
//   { path: "/YourPost", element: <YourPostPage /> },
//   { path: "/Profile", element: <ProfilePage /> },
//   { path: "/Profile", element: <ProfilePage /> },
//   { path: "/ArtistVerification", element: <ArtistVerificationPage /> },
//   { path: "/Setting", element: <SettingsPage /> },
//   { path: "/NotificationSetting", element: <NotificationSettingsPage /> },
//   { path: "/EditProfile", element: <EditProfilePage /> },
//   { path: "/GetVerified", element: <GetVerifiedPage /> },
// ]);
