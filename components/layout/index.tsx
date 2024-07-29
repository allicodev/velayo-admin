import React, { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import {
  Menu,
  Typography,
  Dropdown,
  Layout,
  Affix,
  Avatar,
  Image,
  Button,
} from "antd";
import {
  LogoutOutlined,
  UserOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import Cookies from "js-cookie";

import { SiderProps, ContentProps } from "@/types";
import { AuthStore, useUserStore } from "@/provider/context";
import { verify } from "@/assets/ts/jwt_jose";
import MobileMenu from "./mobile_menu";

const Sider = ({ selectedIndex, selectedKey, items, hide }: SiderProps) => {
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  return hide ? null : (
    <Affix>
      <Layout.Sider
        theme="light"
        style={{
          boxShadow: "2px 0 1px -2px #888",
          minHeight: "100vh",
          zIndex: 2,
        }}
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
          items={items}
          mode="inline"
          onOpenChange={(e) => setOpenKeys([e[e.length - 1]])}
          openKeys={openKeys}
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

const Header = ({
  selectedKey,
  setSelectedKey,
}: {
  selectedKey?: string;
  setSelectedKey: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [width, setWidth] = useState(0);

  const [openMobileMenu, setOpenMobileMenu] = useState(false);

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
      <Affix
        style={{
          boxShadow: "2px 2px 1px -2px #888",
          zIndex: 1,
        }}
      >
        <Layout.Header
          style={{
            backgroundColor: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 60,
            width: "100%",
            paddingInline: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 10,
            }}
          >
            {width < 600 ? (
              <Button
                icon={
                  <MenuUnfoldOutlined
                    style={{ fontSize: "1.2em", padding: 10 }}
                  />
                }
                type="text"
                onClick={() => setOpenMobileMenu(true)}
              />
            ) : (
              <div
                style={{
                  width: 5,
                  height: 30,
                  background: "#98c04c",
                }}
              ></div>
            )}

            <Typography.Text style={{ fontSize: "1.5em" }}>
              {selectedKey?.toLocaleUpperCase()}
            </Typography.Text>
          </div>

          {width > 600 && (
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
          )}
        </Layout.Header>
      </Affix>

      {/* context */}
      {/* <EditProfile open={openEditModal} close={() => setOpenEditModal(false)} /> */}
      <MobileMenu
        open={openMobileMenu}
        close={() => setOpenMobileMenu(false)}
        setSelectedKey={setSelectedKey}
      />
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
        padding: width < 600 ? 0 : 10,
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
