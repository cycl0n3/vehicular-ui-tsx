import React, {memo} from "react";

import {Descriptions, Tag} from "antd";

import {UserResponse} from "../../../types/UserResponse";

import {ADMIN_ROLE} from "../../_misc/SiteRoutes";

const ProfileDescription = ({ user }: { user: UserResponse }) => {

    return (
        <div className="profile-description" style={{ height: "150px" }}>
            <Descriptions>
                <Descriptions.Item label="Username">
                    {user.username}
                </Descriptions.Item>
                <Descriptions.Item label="Name">
                    {user.title} {user.name}
                </Descriptions.Item>
                <Descriptions.Item label="Age">
                    {user.age}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                    {user.email}
                </Descriptions.Item>
                <Descriptions.Item label="Role">
                    <Tag
                        color={user.role === ADMIN_ROLE ? "red" : "green"}
                        key={user.role}
                    >
                        {user.role}
                    </Tag>
                </Descriptions.Item>
            </Descriptions>
        </div>
    );
}

export default ProfileDescription;
