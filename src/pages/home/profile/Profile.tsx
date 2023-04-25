import React, {useContext} from "react";

import {Skeleton, Typography,} from "antd";

import {useQuery} from "@tanstack/react-query";

import UserContext from "../../../context/UserContext";

import {connection} from "../../../base/Connection";

import NotificationContext from "../../../context/NotificationContext";

import {DEFAULT_USER_RESPONSE} from "../../../types/UserResponse";

import ProfileDescription from "./ProfileDescription";

import Orders from "./Orders";

const Profile = () => {
    const {user} = useContext(UserContext);

    const notificationContext = useContext(NotificationContext);

    const fetchMeQuery = useQuery({
        queryKey: ["fetchMeQuery:Profile", user],
        queryFn: async () => {
            try {
                const response = await connection.findMe(user);
                return response.data;
            } catch (e) {
                return DEFAULT_USER_RESPONSE;
            }
        },
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        enabled: !!user,
        onError: (error: any) => {
            notificationContext.error(error.message);
        },
    });

    const {
        isLoading: isProfileLoading,
        isError: isProfileError,
        data: profileData,
    } = fetchMeQuery;

    return (
        <div>
            {isProfileLoading && (<>
                <Skeleton active/>
            </>)}

            {isProfileError && (<>
                <Typography.Text type="danger">Error loading profile</Typography.Text>
            </>)}

            {profileData && (
                <ProfileDescription user={profileData}/>
            )}

            {user && (<>
                <Orders user={user}/>
            </>)}
        </div>
    );
};

export default Profile;
