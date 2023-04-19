import React, { useEffect, useState } from "react";

import { notification } from "antd";

import { userContext } from "../../context/UserContext";
import { connection } from "../../components/Connection";

const Profile = () => {
  const { user } = userContext();

  const [iuser, setIUser] = useState<any>(null);

  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    connection
      .findMe(user)
      .then((response) => {
        const data = response.data;
        setIUser(data);

        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [user]);

  return (
    <div>
      <h1>Profile</h1>
      {iuser && (
        <div>
          <p>Id: {iuser.id}</p>
          <p>Username: {iuser.username}</p>
          <p>Email: {iuser.email}</p>
          <p>Role: {iuser.role}</p>
        </div>
      )}
    </div>
  );
};

export default Profile;
