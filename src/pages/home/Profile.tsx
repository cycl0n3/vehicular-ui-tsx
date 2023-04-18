import React from 'react'

import { userContext } from '../../context/UserContext';

const Profile = () => {

  const { user } = userContext();

  return (
    <div>
      <h1>Profile</h1>
      <p>Username: {user?.username}</p>
    </div>
  )
}

export default Profile
