import React, {memo, useContext, useEffect, useRef, useState} from "react";

import {UserAuth} from "../../../types/UserAuth";

import NotificationContext from "../../../context/NotificationContext";

import {useQuery} from "@tanstack/react-query";

import {connection} from "../../../base/Connection";

import {DEFAULT_ORDER_PAGE_RESPONSE} from "../../../types/OrderPageResponse";

import Table, {ColumnsType} from "antd/es/table";

import {OrderResponse} from "../../../types/OrderResponse";

import {CheckCircleOutlined, CloseCircleOutlined, PlusCircleTwoTone, SearchOutlined} from "@ant-design/icons";

import {Button, Form, Input, Skeleton, Typography} from "antd";

import {format} from "date-fns";

import OrderStatus from "./OrderStatus";

import OrderCreateForm from "./OrderCreateForm";

import jwt_decode from "jwt-decode";

const Orders = ({user, otherUsername}: { user: UserAuth, otherUsername: string }) => {

    const notificationContext = useContext(NotificationContext);

    const [page, setPage] = React.useState<number>(0);
    const [size, setSize] = React.useState<number>(5);

    const [searchQuery, setSearchQuery] = React.useState<string>("");

    const decoded: any = jwt_decode(user.accessToken);

    useEffect(() => {
        setPage(() => 0);
    }, [size, searchQuery]);

    useEffect(() => {
        form.resetFields();
        setSearchQuery(() => "");
    }, [otherUsername]);


    const fetchOrdersQuery = useQuery({
        queryKey: ["fetchOrdersQuery:Orders", user, otherUsername, searchQuery, page, size],
        queryFn: async () => {
            try {
                let response;

                if (decoded.rol[0] === "ADMIN") {
                    if(!otherUsername) throw new Error("No otherUsername provided");
                    response = await connection.findOrdersByUser(user, otherUsername, searchQuery, {page, size});
                }
                else if(decoded.rol[0] === "USER") {
                    response = await connection.findMyOrders(user, searchQuery, {page, size});
                } else {
                    response = await connection.findMyOrders(user, searchQuery, {page, size});
                }

                response.data.orders = response.data.orders.map((order: OrderResponse) => {
                    return {
                        ...order,
                        key: order.id,
                        action: {
                            id: order.id,
                            status: order.status,
                        },
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
    } = fetchOrdersQuery;

    let columns: ColumnsType<OrderResponse> = [
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
        {
            title: "Actions",
            dataIndex: "action",
            key: "action",
            render: (action) => {

                return <>
                    {action.status === 0 && (<>
                        <Button style={{color: "green"}} type="text" shape={"circle"} icon={<CheckCircleOutlined />} color={"green"} onClick={async () => {
                            try {
                                await connection.approveOrder(user, action.id);
                                fetchOrdersQuery.refetch();
                                notificationContext.success("Order approved successfully");
                            } catch (e: any) {
                                notificationContext.error("Order completion failed (" + e.message + ")");
                            }
                        }} ></Button>

                        <Button style={{color: "red"}} type="text" shape={"circle"} icon={<CloseCircleOutlined />} onClick={async () => {
                            try {
                                await connection.rejectOrder(user, action.id);
                                fetchOrdersQuery.refetch();
                                notificationContext.warning("Order rejected successfully");
                            } catch (e: any) {
                                notificationContext.error("Order rejection failed (" + e.message + ")");
                            }
                        }} ></Button>
                </>)}
            </>}
        }
    ];

    columns = columns.filter((column) => {
        if(column.key === "action") {
            return decoded.rol[0] === "ADMIN";
        }

        return true;
    });

    const [open, setOpen] = useState(false);

    const [form] = Form.useForm(undefined);

    return (
        <div>
            <Typography.Title level={4} style={{margin: 0}}>
                Orders for {otherUsername}
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

            <OrderCreateForm
                user={user}
                open={open}
                otherUsername={otherUsername}
                onCreate={(values: any) => {
                    setOpen(false);
                    fetchOrdersQuery.refetch();
                    notificationContext.success("Order created successfully");
                }}
                onError={(error: any) => {
                    notificationContext.error("Order creation failed (" + error.message + ")");
                }}
                onCancel={() => {
                    setOpen(false);
                }
            } />

            <Form
                form={form}
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

            {isOrdersLoading && (<>
                <Skeleton active/>
                <Skeleton active/>
                <Skeleton active/>
            </>)}

            {isOrdersError && (<>
                <Typography.Text type="danger">Error while fetching orders</Typography.Text>
            </>)}

            {ordersData && (<>
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
