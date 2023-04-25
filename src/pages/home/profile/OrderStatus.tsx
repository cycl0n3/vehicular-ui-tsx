import React from "react";

import {Tag} from "antd";

import {CheckCircleOutlined, CloseCircleOutlined, MinusCircleOutlined, SyncOutlined} from "@ant-design/icons";

import {nanoid} from "nanoid";

const OrderStatus = ({status}: {status: number}) => {

    const getStatusElement = () => {
        switch (status) {
            case 0:
                return (
                    <Tag icon={<SyncOutlined />} color={"processing"} key={nanoid(5)}>
                        Processing
                    </Tag>
                );
            case -1:
                return (
                    <Tag icon={<CloseCircleOutlined />} color={"error"} key={nanoid(5)}>
                        Rejected
                    </Tag>
                );
            case 1:
                return (
                    <Tag icon={<CheckCircleOutlined />} color={"success"} key={nanoid(5)}>
                        Accepted
                    </Tag>
                );
            default:
                return (
                    <Tag icon={<MinusCircleOutlined />} color={"default"} key={nanoid(5)}>
                        NULL
                    </Tag>
                );
        }
    }

    return (
        <div>
            {getStatusElement()}
        </div>
    );
};

export default OrderStatus;
