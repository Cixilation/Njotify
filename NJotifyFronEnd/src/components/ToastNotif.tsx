import { faCheckCircle, faExclamationCircle, faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useToastStore } from "../state_management/toastStore";

export default function ToastNotif({
  message,
  type,
}: {
  message: string;
  type: string;
}) {


  
  const {showToast, setShowToast } = useToastStore();

  function onClose() {
    setShowToast(false);
  }

  useEffect(() => {
    const showDuration = 3000;
    const fadeOutDuration = 600;

    const timer = setTimeout(() => {
      setShowToast(false);
      setTimeout(onClose, fadeOutDuration);
    }, showDuration);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed",
        bottom: "30px",
        right: "30px",
        display: "flex",
        alignItems: "flex-end",
        flexDirection: "column",
        overflow: "hidden",
        padding: "20px",
        zIndex: 9999,
      }}
    >
      <div
        className={`toast ${!showToast ? "toast-exit" : ""}`}
        style={{
          width: "400px",
          height: "80px",
          background: "#111",
          color: "#fff",
          fontWeight: 500,
          margin: "15px 0",
          boxShadow: "0 0 20px rgba(55,55,55, 0.3)",
          display: "flex",
          alignItems: "center",
          borderRadius: "5px",
        }}
      >
        {type.includes("Warning") && (
          <FontAwesomeIcon
            icon={faExclamationCircle}
            style={{ color: "yellow", fontSize: "35px", margin: "0 20px" }}
          />
        )}
         {type.includes("Success") && (
          <FontAwesomeIcon icon={faCheckCircle} style={{ color: "green", fontSize: "35px", margin: "0 20px" }} />
        )}
         {type.includes("Failed") && (
          <FontAwesomeIcon icon={faXmarkCircle} style={{ color: "red", fontSize: "35px", margin: "0 20px" }} />
        )}

        <span>{message}</span>
      </div>
    </div>
  );
}
