import { ReactNode } from "react";
import GradientBackground from "../styledComponents/GradientBackground";
import { PlaylistAndNavigationComponent } from "../components/PlaylistAndNavigationComponent";
import { MusicDetails } from "../components/MusicDetails";
import { MusicControl } from "../components/MusicControls";
import useSidebarStore from "../state_management/useSidebarToggle";
import { useToastStore } from "../state_management/toastStore";
import ToastNotif from "../components/ToastNotif";
export default function MasterPage({
    component
  }: {
    component: ReactNode;
  })
{

    const isMusicDetailsVisible = useSidebarStore(
        (state) => state.isMusicDetailsVisible
      );
      const { message, ToastType, showToast } = useToastStore();

      return (
        <>
          <GradientBackground>
            {showToast && <ToastNotif message={message} type={ToastType} />}
            <div className="vh-100 vw-100" >
                {component}
              
              {isMusicDetailsVisible && <MusicDetails />}
              <PlaylistAndNavigationComponent />
              <MusicControl />
            </div>
          </GradientBackground>
        </>
      );
}


