import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  Image,
  Input,
  Row,
  Typography,
  message,
  notification,
} from "antd";
import { UserOutlined, LockOutlined, LoadingOutlined } from "@ant-design/icons";

import Cookies from "js-cookie";

import { UserLoginProps } from "@/types";
import { useUserStore, AuthStore } from "@/provider/context";
import UserService from "@/provider/user.service";

const Login = () => {
  const [form] = Form.useForm();
  const { setUser } = useUserStore();
  const { setAccessToken } = AuthStore();
  const user = new UserService();

  const [isMobile, setIsMobile] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  const handleFinish = async (val: UserLoginProps) => {
    api.open({
      icon: <LoadingOutlined />,
      pauseOnHover: false,
      closable: false,
      message: "Logging In....",
    });

    const response = await user.login(val);
    if (response.success && response?.data?.role == "admin") {
      api.destroy();

      api.open({
        type: "success",
        message: "Login Success",
        description: "You will be now redirected",
        showProgress: true,
        pauseOnHover: false,
        duration: 2,
        closable: false,
        onClose: () => {
          setUser(response.data);
          setAccessToken(response.data!.token);
          Cookies.set("token", response.data!.token);
          window.location.reload();
        },
      });
    } else {
      api.destroy();
      message.error(
        response?.data?.role != "admin"
          ? "Invalid Credentials"
          : response.message
      );
    }
  };

  useEffect(() => {
    setIsMobile(window.innerWidth < 600);
    window.addEventListener("resize", () => {
      setIsMobile(window.innerWidth < 600);
    });
  }, []);

  return (
    <>
      {contextHolder}
      {!isMobile ? (
        <>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              position: "absolute",
              zIndex: 999,
              width: "100%",
              top: "1%",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                fontSize: 50,
                lineHeight: 1,
                gap: 10,
              }}
            >
              <Image src="/logo-2.png" preview={false} width={45} />
              <span style={{ fontSize: "0.5em", fontFamily: "abel" }}>
                Velayo Admin
              </span>
            </div>
          </div>
          <div className="main-container">
            <Row>
              <Col
                span={14}
                style={{
                  height: "calc(100vh - 120px)",
                  borderTopLeftRadius: 10,
                  borderBottomLeftRadius: 10,
                }}
                className="login-container"
              />
              <Col
                span={10}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  background: "#edf2fe",
                  height: "calc(100vh - 120px)",
                  borderTopRightRadius: 10,
                  borderBottomRightRadius: 10,
                }}
              >
                <Card
                  style={{
                    width: 350,
                  }}
                  styles={{
                    body: {
                      paddingLeft: 35,
                      paddingRight: 35,
                      paddingTop: 20,
                      paddingBottom: 20,
                    },
                  }}
                  hoverable
                >
                  <Typography.Title level={3}>
                    Welcome to <br />
                    <strong style={{ fontSize: "1.25em" }}>
                      Velayo Admin Login
                    </strong>
                  </Typography.Title>
                  <Form form={form} onFinish={handleFinish}>
                    <Form.Item
                      name="username"
                      style={{
                        marginBottom: 10,
                      }}
                      rules={[
                        {
                          required: true,
                          message: "Username is empty. Please Provide",
                        },
                      ]}
                    >
                      <Input
                        size="large"
                        className="customInput"
                        prefix={<UserOutlined />}
                        placeholder="Username"
                        style={{
                          marginBottom: 5,
                        }}
                      />
                    </Form.Item>
                    <Form.Item
                      name="password"
                      rules={[
                        {
                          required: true,
                          message: "Password is empty. Please Provide",
                        },
                      ]}
                    >
                      <Input.Password
                        size="large"
                        prefix={<LockOutlined />}
                        placeholder="Password"
                      />
                    </Form.Item>
                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        style={{ height: 50, fontSize: "2em" }}
                        block
                      >
                        Login
                      </Button>
                    </Form.Item>
                  </Form>
                </Card>
              </Col>
            </Row>
          </div>
        </>
      ) : (
        <div
          className="login-container"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
          }}
        >
          <Card
            styles={{
              body: {
                paddingLeft: 35,
                paddingTop: 20,
                paddingBottom: 20,
                marginRight: "5vw",
                width: "90vw",
              },
            }}
            hoverable
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image src="/logo-1.png" preview={false} width={140} />
            </div>
            <Typography.Title style={{ textAlign: "center" }}>
              Admin Login Form
            </Typography.Title>
            <Form form={form} onFinish={handleFinish}>
              <Form.Item
                name="username"
                style={{
                  marginBottom: 10,
                }}
                rules={[
                  {
                    required: true,
                    message: "Username is empty. Please Provide",
                  },
                ]}
              >
                <Input
                  size="large"
                  className="customInput"
                  prefix={<UserOutlined />}
                  placeholder="Username"
                  style={{
                    marginBottom: 5,
                    width: "100%",
                  }}
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Password is empty. Please Provide",
                  },
                ]}
              >
                <Input.Password
                  size="large"
                  prefix={<LockOutlined />}
                  placeholder="Password"
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ height: 50, fontSize: "2em" }}
                  block
                >
                  Login
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      )}
    </>
  );
};

export default Login;
