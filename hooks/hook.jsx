import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

const useError = (errors = []) => {
    const [hasShownWelcome, setHasShownWelcome] = useState(false);
    const router = useRouter();
    useEffect(() => {
      // console.log(errors)
        if (errors.length > 0) {
            // console.log(errors.length)
            
            errors.forEach(({ error, isError, fallback }) => {
              // console.log(error?.data?.message);
                // console.log(isError)
                //if(isError) falback();
                if (!hasShownWelcome && isError) {
                    toast.error(error?.data?.message || "Something Went Wrong!", {
                        position: "bottom-center"
                    });
                    if(error?.data?.message ==="Chat not found"){
                      router.push("/")
                    }
                    setHasShownWelcome(true);
                }
            })
        }
    }, [errors, hasShownWelcome])

}

const useAsyncMutation = (mutationHook) => {
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState(null);
  
    const [mutate] = mutationHook();
  
    const executeMutation = async (toastMessage, ...args) => {
      setIsLoading(true);
      const toastId = toast.loading(toastMessage || "Updating data...");
      
      try {
        const res = await mutate(...args);
        
        if (res.data) {
          toast.success(res.data.message || "Updated data Successfully", { id: toastId });
          setData(res.data);  // Set data to res.data on success
        } else {
          toast.error(res?.error?.data?.message || "Something went wrong", { id: toastId });
          setData(res.error);  // Set data to res.error if there's an error
        }
  
        return res;  // Return res directly so the component can await it
        
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong!", { id: toastId });
        setData(error);  // Set data to the caught error
        
        return { error };
        
      } finally {
        setIsLoading(false);
      }
    };
  
    return [executeMutation, isLoading, data];
  };
  
export { useError, useAsyncMutation }