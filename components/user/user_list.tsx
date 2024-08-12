import React, { CSSProperties, useEffect, useState } from "react";
import {
  TableProps,
  Button,
  Table,
  Popconfirm,
  message,
  Dropdown,
  notification,
} from "antd";
import {
  DeleteOutlined,
  UserAddOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { CgMore } from "react-icons/cg";

import dayjs from "dayjs";

import {
  BasicContentProps,
  User as UserProp,
  NewUser as NewUserProp,
} from "@/types";
import NewUser from "./new_user";
import UserService from "@/provider/user.service";
import ViewUser from "./view_user";

const User = ({ title, style, extra }: BasicContentProps) => {
  const [openedNewUser, setOpenedNewUser] = useState(false);
  const [openedUser, setOpenedUser] = useState<NewUserProp | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserProp | null>();
  const [users, setUsers] = useState<UserProp[]>([]);
  const [trigger, setTrigger] = useState(0);
  const [total, setTotal] = useState(0);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [fetching, setFetching] = useState(false);

  const [width, setWidth] = useState(0);

  const isMobile = width < 600;

  const user = new UserService();

  const moreInfoStyle: CSSProperties = {
    display: "flex",
    paddingLeft: 10,
    paddingRight: 10,
    width: "100%",
  };

  const columns: TableProps<UserProp>["columns"] = [
    {
      title: "ID",
      key: "id",
      width: 120,
      dataIndex: "employeeId",
    },
    {
      title: "Name",
      key: "name",
      dataIndex: "name",
      width: 170,
    },
    {
      title: "Username",
      key: "username",
      width: 100,
      dataIndex: "username",
    },
    {
      title: "Email",
      key: "email",
      width: 250,
      dataIndex: "email",
    },
    {
      title: "Role",
      key: "role",
      dataIndex: "role",
      width: 120,
      render: (_) => _.toLocaleUpperCase(),
    },
    {
      title: "Date Created",
      key: "date_created",
      dataIndex: "createdAt",
      width: 150,
      render: (date) => dayjs(date).format("MMMM DD, YYYY"),
    },
    {
      title: "Actions",
      align: "center",
      fixed: "right",
      width: 100,
      render: (_, row) => (
        <Dropdown
          trigger={["click"]}
          placement="bottomLeft"
          menu={{
            items: [
              {
                label: (
                  <div style={moreInfoStyle}>
                    <EditOutlined
                      style={{
                        marginRight: 5,
                      }}
                    />
                    Edit User
                  </div>
                ),
                key: "update",
                onClick: (e) => {
                  // e.stopPropagation();
                  // e.preventDefault();

                  let $ = row as any;
                  delete $.__v;
                  delete $.updatedAt;
                  delete $.createdAt;
                  delete $.password;

                  setOpenedUser($);
                  setOpenedNewUser(true);
                },
              },
              {
                label: (
                  <Popconfirm
                    title="Delete Confirmation"
                    okText="Confirm"
                    icon={null}
                    onConfirm={(e) => {
                      e?.preventDefault();
                      e?.stopPropagation();
                      handeRemoveUser(row?._id ?? "");
                    }}
                    onCancel={(e) => {
                      e?.preventDefault();
                      e?.stopPropagation();
                    }}
                    okButtonProps={{
                      danger: true,
                    }}
                  >
                    <div style={moreInfoStyle}>
                      <DeleteOutlined
                        style={{
                          marginRight: 5,
                        }}
                      />
                      Delete
                    </div>
                  </Popconfirm>
                ),
                key: "delete",
                danger: true,
              },
            ],
          }}
        >
          <Button
            type="text"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            <CgMore
              style={{
                fontSize: "1.4em",
              }}
            />
          </Button>
        </Dropdown>
      ),
    },
  ];

  const getHeader = () => (
    <Button
      icon={<PlusOutlined />}
      type="primary"
      size="large"
      onClick={(e) => setOpenedNewUser(true)}
      style={{ marginBottom: 10, margin: 5 }}
    />
  );

  const handleNewUser = (obj: any) => {
    (async (_) => {
      let res = await _.newUser(obj);
      if (res.success) {
        message.success("Successfully Created");
        setTrigger(trigger + 1);
        setOpenedNewUser(false);
      } else message.warning(res.message);
    })(user);
  };

  const handleSaveUser = (obj: any) => {
    (async (_) => {
      let res = await _.updateUser(obj);
      if (res?.success ?? false) {
        message.success(res?.message ?? "Success");
        setTrigger(trigger + 1);
        setOpenedNewUser(false);
        setOpenedUser(null);
      } else message.warning(res.message);
    })(user);
  };

  const handeRemoveUser = (id: string) => {
    (async (_) => {
      let res = await _.deleteUser({ id });

      if (res.success) {
        message.success(res.message ?? "Deleted Successfully");
        setTrigger(trigger + 1);
      } else message.warning(res.message);
    })(user);
  };

  const getUsers = ({
    role,
    page,
    pageSize,
    updateUsers = true,
  }: {
    role?: string | null;
    page: number;
    pageSize?: number;
    updateUsers?: boolean;
  }): Promise<UserProp[] | any | void> =>
    new Promise(async (resolve, reject) => {
      setFetching(true);
      if (!pageSize) pageSize = 10;

      let res = await user.getUsers({
        role: role ? [role.toLocaleLowerCase()] : undefined,
        page,
        pageSize,
      });

      if (res?.success ?? false) {
        if (!updateUsers) {
          return resolve(res.data);
        }

        setFetching(false);
        setUsers(res?.data ?? []);
        setTotal(res.meta?.total ?? 10);
        resolve(res.data);
      } else {
        setFetching(false);
        reject();
      }
    });

  useEffect(() => {
    getUsers({ page: 1, pageSize: 10, role: selectedRole });
  }, [trigger, open, selectedRole]);

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);
    handleResize(); // Set initial width

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div style={{ padding: 10 }}>
      {getHeader()}
      <Table
        loading={fetching}
        dataSource={users}
        columns={columns.filter((e) =>
          isMobile
            ? !["username", "email", "date_created"].includes(
                e.key?.toString() ?? ""
              )
            : true
        )}
        style={{ ...style, padding: 5, cursor: "pointer" }}
        rowKey={(e) => e.username}
        scroll={{
          y: "75vh",
          x: true,
        }}
        onRow={(data) => {
          return {
            onClick: () => setSelectedUser(data),
          };
        }}
        pagination={{
          defaultPageSize: 10,
          total,
          onChange: (page, pageSize) =>
            getUsers({
              page,
              pageSize,
              role: selectedRole,
            }),
        }}
      />

      {/* context */}
      <NewUser
        open={openedNewUser}
        close={() => {
          setOpenedNewUser(false);
          setOpenedUser(null);
        }}
        onAdd={handleNewUser}
        onSave={handleSaveUser}
        user={openedUser}
      />
      <ViewUser
        user={selectedUser}
        open={selectedUser != null}
        close={() => setSelectedUser(null)}
      />
    </div>
  );
};

export default User;
