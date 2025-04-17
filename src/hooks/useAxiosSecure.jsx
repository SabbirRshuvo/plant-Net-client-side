import axios from "axios";
import useAuth from "./useAuth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

const useAxiosSecure = () => {
  const navigate = useNavigate();
  const { logOut } = useAuth();
  useEffect(() => {
    axiosSecure.interceptors.response.use(
      (res) => res,
      async (error) => {
        console.log("error", error.response);
        if ([401, 403].includes(error.response.status)) {
          logOut();
          navigate("/login");
        }
        return Promise.reject(error);
      }
    );
  }, [logOut, navigate]);
  return axiosSecure;
};

export default useAxiosSecure;
