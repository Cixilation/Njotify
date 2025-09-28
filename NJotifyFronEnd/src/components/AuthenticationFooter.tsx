import { NjotifyLogo } from "../styledComponents/NjotifyLogo";
import SmallLink from "../styledComponents/SmallLink";

export function AuthenticationFooter() {
  return (
    <div className="footer bg-black vw-100 vh-10 ">
      <div className="wpercent90 vh-10 row between m-auto ">
        <div className="wpercent60  percent80 row between">
          <NjotifyLogo />
          <SmallLink>Procedure Law </SmallLink>
          <SmallLink>Security and Privacy Center</SmallLink>
          <SmallLink>Privacy Policy</SmallLink>
          <SmallLink>Cookie</SmallLink>
          <SmallLink>About Advertisement</SmallLink>
          <SmallLink>Accessibility</SmallLink>
        </div>
        <SmallLink>©2024 MSpotify AB</SmallLink>
      </div>
    </div>
  );
}
