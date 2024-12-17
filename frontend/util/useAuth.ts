import { emptyUser } from "@/app/emptyModel/emptyModels";
import { getUser } from "@/service/user.service";
import { Demo } from "@/types";
import { useEffect, useState } from "react";


const useAuth = () => {
const [user, setUser] = useState<Demo.user>(emptyUser);
const [isLoading, setIsLoading] = useState<boolean>(true);

useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await getUser()
        setUser(data);
      } catch (error) {
        console.error("Error fetching wedding content:", error);
      }finally {
        setIsLoading(false);
    }
    };

    fetchData();
  }, []);
  return { user };
}


export default useAuth;