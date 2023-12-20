import "./Menu.css";
import React from "react";
import { useStorage } from "../hooks/useStorage";
import MenuOwner from "./MenuOwner";
import MenuEmployee from "./MenuEmployee";

const Menu: React.FC = () => {
  const { user } = useStorage();

  return <>{user?.role == "owner" ? <MenuOwner /> : <MenuEmployee />}</>;
};

export default Menu;
