import React, { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBackwardStep,
  faForwardStep,
  faPauseCircle,
  faPlayCircle,
  faPlusCircle,
  faRepeat,
  faSquareCaretRight,
  faVolumeDown,
  faVolumeMute,
  faVolumeUp,
} from "@fortawesome/free-solid-svg-icons";
import { faShuffle } from "@fortawesome/free-solid-svg-icons/faShuffle";
import { faLayerGroup } from "@fortawesome/free-solid-svg-icons/faLayerGroup";
import axios from "axios";
import useSidebarStore from "../state_management/useSidebarToggle";
import useMusicStore from "../state_management/playingSongStore";
import { PlaylistDetail } from "../model/PlayListDetailModel";
import AlbumImage from "../styledComponents/AlbumImage";
import BlackBackground from "../styledComponents/BlackBackground";
import SongDetailTitle from "../styledComponents/SongDetailTitle";
import SongDetailestTitle from "../styledComponents/SongDetailestTitle";
import { useCurrentUserStore } from "../state_management/currentUser";

export function MusicControl() {
  const { toggleMusicDetailsVisibility, isAdvertisementVisible,toggleQueueVisibility, toggleAdvertisementVisibility} =
    useSidebarStore();
  const {
    currentSong,
    currentTime,
    duration,
    setCounter,
    addToTopQueue,
    setCurrentTime,
    setDuration,
    playNext,
    isPlaying,
    setPlaying,
    volume,
    setVolume,
    counter,
  } = useMusicStore();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const volumeBarRef = useRef<HTMLDivElement | null>(null);
  const audio = audioRef.current

  useEffect(() => {
    const updateProgress = () => {
      setCurrentTime(audio?.currentTime || 0);
      setDuration(audio?.duration || 0);
    };

    if (audio) {
      audio.volume = volume;
      if (isPlaying) {
        audio.play();
      } else {
        audio.pause();
      }

      audio.addEventListener("timeupdate", updateProgress);
      audio.addEventListener("loadedmetadata", updateProgress);

      return () => {
        audio.removeEventListener("timeupdate", updateProgress);
        audio.removeEventListener("loadedmetadata", updateProgress);
      };
    }
  }, [setCurrentTime, setDuration, volume, isPlaying]);

  const handleProgressClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const progressBar = progressBarRef.current;
    if (progressBar) {
      const rect = progressBar.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const newTime = (offsetX / rect.width) * duration;
      if (audioRef.current) {
        audioRef.current.currentTime = newTime;
      }
    }
  };

  const handleVolumeClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const volumeBar = volumeBarRef.current;
    if (volumeBar) {
      const rect = volumeBar.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const newVolume = offsetX / rect.width;
      setVolume(newVolume);
      if (audioRef.current) {
        audioRef.current.volume = newVolume;
      }
    }
  };

  const handlePlayPause = () => {
    setPlaying(!isPlaying);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };
  const {current_user} = useCurrentUserStore()

  function Skip() {
    console.log(isAdvertisementVisible)
    if (isAdvertisementVisible == false) {
      playNext();
    }
  }
  useEffect(() => {
    audio?.play()
  }, [currentSong])

  async function SongEnded(){
    if (isAdvertisementVisible == false){ 
      await axios.post(`http://localhost:8888/song/addsongcount`,{
        userid: current_user?.id,
        songid: currentSong?.songs.id
      })
    } else {
      toggleAdvertisementVisibility()
    }
    if(counter == 5) {    
      setCounter(0)
      const response = await axios.get<WebResponse<PlaylistDetail>>(
      `http://localhost:8888/advertisement`
    );
      addToTopQueue(response.data.data);
      toggleAdvertisementVisibility()
    }
    playNext()
  }

  return (
    <BlackBackground>
      <div className="bg-black vh-8 vw-100 footer white row center">
        <audio
          ref={audioRef}
          src={currentSong?.songs.file || ""}
          onEnded={SongEnded}
        />
        <div className="row between wpercent100">
          <div className="row ml-25" style={{ alignItems: "center" }}>
            <div className="vw-3 sh-3">
              <AlbumImage
                src={`http://localhost:8888/album/picture/${currentSong?.album?.image}`}
                alt=""
              />
            </div>
            <div className="column pl-10">
              <SongDetailTitle>{currentSong?.songs.name}</SongDetailTitle>
              <SongDetailestTitle>{currentSong?.user.name}</SongDetailestTitle>
            </div>
            <FontAwesomeIcon
              icon={faPlusCircle}
              className="fs-20"
              style={{ color: "white", margin: "0 10px", opacity: "0.7" }}
            />
          </div>

          <div className="column vw-30">
            <div className="row center">
              <FontAwesomeIcon
                icon={faShuffle}
                className="fs-17 white"
                style={{ margin: "0 10px", opacity: "0.3" }}
              />
              <FontAwesomeIcon
                icon={faBackwardStep}
                className="fs-17 white"
                style={{ margin: "0 10px", opacity: "0.7" }}
              />
              <FontAwesomeIcon
                icon={isPlaying ? faPauseCircle : faPlayCircle}
                className="fs-26 white pt-5"
                style={{ margin: "0 10px" }}
                onClick={handlePlayPause}
              />
              <FontAwesomeIcon
                icon={faForwardStep}
                className="fs-17 white"
                style={{ margin: "0 10px", opacity: "0.7" }}
                onClick={Skip}
              />
              <FontAwesomeIcon
                icon={faRepeat}
                className="fs-17 white"
                style={{ margin: "0 10px", opacity: "0.3" }}
              />
            </div>
            <div className="progress-container row center wpercent100">
              <span>{formatTime(currentTime)}</span>
              <div
                className="progress-bar"
                onClick={handleProgressClick}
                ref={progressBarRef}
              >
                <div
                  className="progress"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                ></div>
              </div>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <div className="row">
            <div className="hover" onClick={toggleMusicDetailsVisibility}>
              <FontAwesomeIcon
                icon={faSquareCaretRight}
                className="fs-17 white"
                style={{ margin: "0 10px", opacity: "0.3" }}
              />
            </div>
            <div className="hover" onClick={toggleQueueVisibility}>
              <FontAwesomeIcon
                icon={faLayerGroup}
                className="fs-17 white"
                style={{ margin: "0 10px", opacity: "0.3" }}
              />
            </div>
            <FontAwesomeIcon
              icon={faVolumeDown}
              className="fs-17 white"
              style={{ margin: "0 10px", opacity: "0.3" }}
            />
            <div
              style={{ position: "relative" }}
              className="vw-10 center mt-10"
            >
              <div className="progress-container row center vw-30">
                <div
                  className="progress-bar"
                  onClick={handleVolumeClick}
                  ref={volumeBarRef}
                >
                  <div
                    className="progress"
                    style={{ width: `${volume * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <FontAwesomeIcon
              icon={faVolumeUp}
              className="fs-17 white"
              style={{ margin: "0 10px", opacity: "0.3" }}
            />
            <FontAwesomeIcon
              icon={faVolumeMute}
              className="fs-17 white"
              style={{ margin: "0 10px", opacity: "0.3" }}
            />
          </div>
        </div>
      </div>
    </BlackBackground>
  );
}
