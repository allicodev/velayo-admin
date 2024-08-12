import { UserOutlined } from "@ant-design/icons";
import { CSSProperties } from "react";

interface MyProps {
  styles?: CSSProperties;
}

const UserProfilePlaceholder = (props: MyProps) => (
  <div
    style={{
      ...props.styles,
      display: "flex",
      height: 150,
      width: 150,
      borderRadius: "100%",
      justifyContent: "center",
      alignItems: "center",
      background: "#fff",
    }}
  >
    <UserOutlined
      style={{
        fontSize: "4.5em",
        color: "#777",
      }}
    />
  </div>
);

export { UserProfilePlaceholder };
