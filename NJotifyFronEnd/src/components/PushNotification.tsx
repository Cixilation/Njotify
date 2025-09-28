import { useEffect } from "react";
import addNotification from "react-push-notification";
import photo from "../assets/music.png";


const FollowNotification = ({ userId }: { userId: string }) => {

  useEffect(() => {
    const eventSource = new EventSource(
      `http://localhost:8888/followers/events/${userId}`
    );
    eventSource.addEventListener(
      "New follower",
      function (event: MessageEvent<string>) {
        const data = JSON.parse(event.data)
        addNotification({
          title: data.title,
          message: data.message,
          duration: 4000,
          icon: photo,
          native: true,
        });
      }
    )
    eventSource.onerror = (error) => {
      console.error("SSE Error:", error);
      eventSource.close();
    }

    return () => {
      eventSource.close();
    }
  }, [userId]);

  return null;
};

export default FollowNotification;

    // addNotification({
    //     title: "Ngetes",
    //     message: "NGETESSSSSSSSSSSSSSSSS",
    //     duration: 4000,
    //     icon: photo,
    //     native: true,
    // })