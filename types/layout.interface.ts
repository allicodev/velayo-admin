import type { MenuProps } from "antd";
import { ReactNode } from "react";

export interface SiderProps {
  selectedIndex: MenuProps["onClick"];
  selectedKey: string[];
  items: any[];
  isMobile: boolean;
}

export interface ContentProps {
  selectedKey: string;
  children?: ReactNode;
}
