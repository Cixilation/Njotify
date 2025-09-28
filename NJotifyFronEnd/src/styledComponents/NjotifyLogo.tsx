
import logo from "../assets/SpotifyWhiteLogo.png"

export function NjotifyLogo(){
    return(
        <>
            <div className="percent90 row between mx-5">
                <img className="percent70 m-1"src={logo} alt="" />
   
                <div className="fsp-95 ml-10 b600 white">NJotify®</div>
           </div>
        </>
    )
}