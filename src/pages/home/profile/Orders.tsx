import React, {memo, useContext, useEffect, useRef, useState} from "react";

import {UserAuth} from "../../../types/UserAuth";

import NotificationContext from "../../../context/NotificationContext";

import {useQuery} from "@tanstack/react-query";

import {connection} from "../../../base/Connection";

import {DEFAULT_ORDER_PAGE_RESPONSE} from "../../../types/OrderPageResponse";

import Table, {ColumnsType} from "antd/es/table";

import {OrderResponse} from "../../../types/OrderResponse";

import {PlusCircleTwoTone} from "@ant-design/icons";

import {Button, Form, FormInstance, Input, Modal, Skeleton, Typography} from "antd";

import {format} from "date-fns";

import OrderStatus from "./OrderStatus";
import OrderCreateForm from "./OrderCreateForm";

const Orders = ({user}: { user: UserAuth }) => {

    const notificationContext = useContext(NotificationContext);

    const [page, setPage] = React.useState<number>(0);
    const [size, setSize] = React.useState<number>(5);

    const [searchQuery, setSearchQuery] = React.useState<string>("");

    useEffect(() => {
        setPage(() => 0);
    }, [size, searchQuery]);

    const fetchMyOrdersQuery = useQuery({
        queryKey: ["fetchMyOrdersQuery:Orders", user, searchQuery, page, size],
        queryFn: async () => {
            try {
                const response = await connection.findMyOrders(user, searchQuery, {page, size});

                response.data.orders = response.data.orders.map((order: OrderResponse) => {
                    return {
                        ...order,
                        key: order.id,
                    };
                });

                return response.data;
            } catch (e) {
                return DEFAULT_ORDER_PAGE_RESPONSE;
            }
        },
        keepPreviousData: true,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        enabled: !!user,
        onError: (error: any) => {
            notificationContext.error(error.message);
        },
    });

    const {
        isLoading: isOrdersLoading,
        isError: isOrdersError,
        data: ordersData,
        isPreviousData: isOrdersPreviousData,
    } = fetchMyOrdersQuery;

    const columns: ColumnsType<OrderResponse> = [
        {
            title: "Id",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status: number) => {
                return <OrderStatus status={status}/>;
            }
        },
        {
            title: "Created At",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (createdAt: string) => {
                return <Typography.Text>{format(new Date(createdAt), "dd/MM/yyyy HH:mm")}</Typography.Text>;
            }
        },
    ];

    const [open, setOpen] = useState(false);

    const onCreate = (values: any) => {
        setOpen(false);
        fetchMyOrdersQuery.refetch();
        notificationContext.success("Order created successfully");
    };

    const onError = (error: any) => {
        notificationContext.error("Order creation failed (" + error.message + ")");
    }

    return (
        <div>
            <Typography.Title level={4} style={{margin: 0}}>
                Orders
                <Button
                    type="text"
                    shape="circle"
                    icon={<PlusCircleTwoTone size={25}/>}
                    size="large"
                    onClick={() => {
                        setOpen(true);
                    }}
                />
            </Typography.Title>

            <OrderCreateForm user={user} open={open} onCreate={onCreate} onError={onError} onCancel={
                () => {
                    setOpen(false);
                }
            } />

            {isOrdersLoading && (<>
                <Skeleton active/>
                <Skeleton active/>
                <Skeleton active/>
            </>)}

            {isOrdersError && (<>
                <Typography.Text type="danger">Error while fetching orders</Typography.Text>
            </>)}

            {ordersData && (<>
                <Form
                    layout='vertical'
                    style={{ maxWidth: 600 }}
                    onFinish={(values) => {
                        setSearchQuery(() => values.searchQuery);
                    }}
                >
                    <Form.Item label="Search" name="searchQuery">
                        <Input placeholder="Enter search query here" />
                    </Form.Item>

                </Form>

                <Table columns={columns} dataSource={ordersData.orders} pagination={{
                    defaultPageSize: size,
                    showSizeChanger: true,
                    pageSizeOptions: ["5", "10", "20"],
                    pageSize: ordersData.itemsPerPage,
                    total: ordersData.totalItems,
                    current: ordersData.currentPage + 1,
                    defaultCurrent: 1,
                    disabled: isOrdersPreviousData,
                    onChange: (page: number) => {
                        setPage(() => page - 1);
                    },
                    onShowSizeChange: (current: number, size: number) => {
                        setSize(() => size);
                    }
                }}/>
            </>)}
        </div>
    );
};

export default Orders;
