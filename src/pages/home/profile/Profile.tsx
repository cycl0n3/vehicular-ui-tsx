import React, {useContext, useEffect} from "react";

import UserContext from "../../../context/UserContext";

import {UserResponse} from "../../../types/UserResponse";

import ProfileDescription from "./ProfileDescription";

import Orders from "./Orders";

import {useOutletContext} from "react-router-dom";

const Profile = () => {
    const {userAuth} = useContext(UserContext);

    const user = useOutletContext<UserResponse>();

    return (
        <div>
            <ProfileDescription user={user}/>

            {userAuth && (<>
                <Orders user={userAuth} otherUsername={user.username}/>
            </>)}
        </div>
    );
};

export default Profile;
