import { useEffect, useState } from "react"
import toast from "react-hot-toast"

const useError = (errors = []) => {
    const [hasShownWelcome, setHasShownWelcome] = useState(false);

    useEffect(() => {

        if (errors.length > 0) {
            // console.log(errors.length)
            errors.forEach(({ error, isError, fallback }) => {
                // console.log(isError)
                //if(isError) falback();
                if (!hasShownWelcome && isError) {
                    toast.error(error?.data?.errors?.message || "Something Went Wrong!", {
                        position: "bottom-center"
                    });
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
            const res = await mutate(...args)
            if (res.data) {
                toast.success(res.data.message || "Updated data Successfully", {
                    id: toastId // this will replace the loading toast
                });
                setData(res.data);
            } else {
                toast.error(res?.error?.data?.message || "Something went wrong", {
                    id: toastId
                });
            }
        } catch (error) {
            console.error(error)
            toast.error("Something went wrong!", {
                id: toastId
                });
        } finally {// this finally keyword run even if the try catch will not work
            setIsLoading(false);
        }
    };

    return [executeMutation,isLoading, data ];

}

export { useError, useAsyncMutation }