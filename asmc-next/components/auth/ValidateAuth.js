import { setAuthData, setIsAuth } from "@/redux/auth/authSlice";
import { getAuthUser, signout } from "@/utils/helper";
import { useDispatch, useSelector } from "react-redux";
import { Loader } from "../common/Loader";
import { useEffect, useState } from "react";
import { fetchLoggedInUser } from "@/apis/auth.api";
import { useRouter } from "next/router";
import { useFetchAuthUserQuery } from "@/redux/auth/authApis";
import { getToken } from "@/utils/tokenHandler";

export const ValidateAuth = ({ redirect }) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);

    const { isLoading, data: authData } = useFetchAuthUserQuery({}, { skip: !isMounted });

    useEffect(() => {
        const authUser = getAuthUser();
        const urlToken = getToken(); // Get token from URL/cookie

        if (authUser || urlToken) {
            if (authData) {
                dispatch(setIsAuth(true));
                dispatch(setAuthData(authData));
            }
        } else {
            signout(() => {});
        }
    }, [authData, isMounted]);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // const fetchUserData = async () => {
    //     const authUser = getAuthUser();
    //     if (authUser) {
    //         const authData = await fetchLoggedInUser();
    //         if (authData?.success) {
    //             dispatch(setIsAuth(true));
    //             dispatch(setAuthData(authData.result));
    //             setLoading(false);
    //         } else {
    //             if (redirect) router.push("/sign-in");
    //             else setLoading(false);
    //             signout(() => router.reload());
    //         }
    //     } else {
    //         if (redirect) router.push("/");
    //         setLoading(false);
    //     }
    // };

    // useEffect(() => {
    //     if (isMounted) {
    //         fetchUserData();
    //     }
    // }, [isMounted]);

    if (isLoading) {
        return <Loader show={true} />;
    }

    return null;
};
