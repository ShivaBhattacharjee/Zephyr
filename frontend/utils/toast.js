import toast from "react-hot-toast";

const Toast = {
  SuccessshowToast: (message) => {
    toast.success(message, {
      style: {
        border: "1px solid #ffff",
        padding: "16px",
        color: "#fff",
        backgroundColor: "#000",
      },
      iconTheme: {
        primary: "#000",
        secondary: "#ffff",
      },
    });
  },

  ErrorShowToast: (message) => {
    toast.error(message, {
      style: {
        border: "1px solid #FF0000",
        padding: "16px",
        color: "#fff",
        backgroundColor: "#000",
      },
      iconTheme: {
        primary: "#000",
        secondary: "#FF0000",
      },
    });
  },
};

export default Toast;
