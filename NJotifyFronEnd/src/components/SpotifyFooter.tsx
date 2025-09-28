import DarkGrayBackground from "../styledComponents/DarkGrayBackground";
import SmallLink from "../styledComponents/SmallLink";
import MainFooterContent from "../styledComponents/MainContentForFooter";
import useSidebarStore from "../state_management/useSidebarToggle";
import HorizontalLine from "../styledComponents/HorizontalLine";
import { Link } from "react-router-dom";

export function SpotifyFooter() {
  const isMusicDetailsVisible = useSidebarStore(
    (state) => state.isMusicDetailsVisible
  );
  return (
    <DarkGrayBackground>
      <MainFooterContent sideBar={isMusicDetailsVisible}>
        <div className="column wpercent100" style={{ textAlign: "left" }}>
          <div className="wpercent90 row between">
            <div className="row  wpercent60 between">
              <div className="column" style={{ justifyItems: "left" }}>
                <p className="b600 fs-12">Recently Played</p>
                <Link to="https://www.spotify.com/id-id/about-us/contact/">
                  <SmallLink>About</SmallLink>
                </Link>
                <Link to="https://www.lifeatspotify.com/">
                  <SmallLink>Jobs</SmallLink>
                </Link>
                <Link to="https://newsroom.spotify.com/">
                  <SmallLink>For the Record</SmallLink>
                </Link>
              </div>
              <div className="column">
                <p className="b600 fs-12">Communities</p>
                <SmallLink>For Artist</SmallLink>
                <SmallLink>Developers</SmallLink>
                <SmallLink>Advertising</SmallLink>
                <SmallLink>Investors</SmallLink>
                <SmallLink>Vendors</SmallLink>
              </div>
              <div className="column">
                <p className="b600 fs-12">Useful links</p>
                <Link to="https://support.spotify.com/id-id/">
                  <SmallLink>Support</SmallLink>
                </Link>
                <Link to="https://www.spotify.com/id-id/free/">
                  <SmallLink>Free Mobile App</SmallLink>
                </Link>
              </div>
              <div className="column">
                <p className="b600 fs-12">Njotify Plans</p>
                <SmallLink>Premium Individual</SmallLink>
                <SmallLink>Premium Duo</SmallLink>
                <SmallLink>Premium Family</SmallLink>
                <SmallLink>Premium Student</SmallLink>
                <SmallLink>Njotify Free</SmallLink>
              </div>
            </div>

            <div className="row vw-5 between">
              <i className="fa-brands fa-instagram white"></i>
              <i className="fa-brands fa-twitter white"></i>
              <i className="fa-brands fa-facebook white"></i>
            </div>
          </div>
          <HorizontalLine className="my-15"></HorizontalLine>
          <div className="row between wpercent90">
            <div className="row wpercent60 between">
              <SmallLink>Legal</SmallLink>
              <SmallLink>Safety & Privacy Center</SmallLink>
              <SmallLink>Privacy Policy</SmallLink>
              <SmallLink>Cookies</SmallLink>
              <SmallLink>About Ads</SmallLink>
              <SmallLink>Accessibility</SmallLink>
            </div>
            <SmallLink>©2024 MSpotify AB</SmallLink>
          </div>
        </div>
      </MainFooterContent>
      
    </DarkGrayBackground>
  );
}
