import React from 'react'

import { userContext } from '../../context/UserContext';

const Profile = () => {

  const { currentUser } = userContext();

  return (
    <div>
      <h1>Profile</h1>
      <p>Username: {currentUser?.username}</p>
    </div>
  )
}

export default Profile
