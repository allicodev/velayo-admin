import React, { useEffect, useLayoutEffect, useState } from "react";
import { GetServerSideProps } from "next";
import { Menu, Typography, Dropdown, Layout, Affix, Avatar, Image } from "antd";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { PageHeader } from "@ant-design/pro-layout";
import Cookies from "js-cookie";

import { SiderProps, ContentProps } from "@/types";
import { AuthStore, useUserStore } from "@/provider/context";
import { verify } from "@/assets/ts/jwt_jose";

const Sider = ({ selectedIndex, selectedKey, items }: SiderProps) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);
    handleResize(); // Set initial width

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Affix>
      <Layout.Sider
        theme="light"
        defaultCollapsed={true}
        style={{
          boxShadow: "2px 0 1px -2px #888",
          height: width < 600 ? "100vh" : undefined,
        }}
        trigger={width < 600 ? null : undefined}
        collapsible
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: 15.0,
          }}
        >
          <Image preview={false} src="/logo-2.png" width={100} />
        </div>
        <Menu
          onClick={selectedIndex}
          selectedKeys={selectedKey}
          items={items}
          mode="inline"
          defaultSelectedKeys={["dashboard"]}
          style={{
            height: "81vh",
            fontSize: 20,
          }}
        />
      </Layout.Sider>
    </Affix>
  );
};

const Header = ({ selectedKey }: { selectedKey?: string }) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);
    handleResize(); // Set initial width

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { currentUser } = useUserStore();
  return (
    <>
      <Affix>
        <Layout.Header
          style={{
            backgroundColor: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: width < 600 ? "space-between" : "end",
            height: 60,
            width: "100%",
            paddingInline: 10,
          }}
        >
          {width < 600 && (
            <Typography.Text style={{ fontSize: "1.5em" }}>
              {selectedKey?.toLocaleUpperCase()}
            </Typography.Text>
          )}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Typography.Text
                style={{ marginRight: 10, textAlign: "end", fontSize: 22 }}
              >
                {currentUser?.name ?? ""}
              </Typography.Text>
            </div>
            <Dropdown
              menu={{
                items: [
                  {
                    label: "Edit Profile",
                    key: "edit",
                    // onClick: () => setOpenEditModal(true),
                  },
                  {
                    type: "divider",
                  },
                  {
                    label: (
                      <div style={{ color: "#ff0000" }}>
                        logout <LogoutOutlined />
                      </div>
                    ),
                    key: "3",
                    onClick: () => {
                      Cookies.remove("token");
                      window.location.reload();
                    },
                  },
                ],
              }}
              trigger={["click"]}
            >
              <Avatar
                icon={<UserOutlined />}
                size={40}
                style={{ cursor: "pointer" }}
              />
            </Dropdown>
          </div>
        </Layout.Header>
      </Affix>

      {/* context */}
      {/* <EditProfile open={openEditModal} close={() => setOpenEditModal(false)} /> */}
    </>
  );
};

const Content = ({ selectedKey, children }: ContentProps) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);
    handleResize(); // Set initial width

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Layout
      style={{
        backgroundColor: "#f6f8fb",
        minHeight: "94vh",
        padding: "10px",
        overflow: width < 600 ? "scroll" : "hidden",
      }}
    >
      {children}
    </Layout>
  );
};

const Footer = () => {
  return (
    <Layout.Footer
      style={{
        display: "flex",
        justifyContent: "center",
        width: "100%",
        backgroundColor: "#aaa",
      }}
    >
      <Typography.Title level={5} style={{ marginTop: 10 }}></Typography.Title>
    </Layout.Footer>
  );
};

export default function MyLayout() {
  return <></>;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { accessToken } = AuthStore();

  try {
    if (accessToken) {
      await verify(accessToken, process.env.JWT_PRIVATE_KEY!);
      return { props: {} };
    } else {
      throw new Error("No bearer token");
    }
  } catch (e) {
    console.log(e);
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
      props: {},
    };
  }
};

export { Sider, Header, Content, Footer };
