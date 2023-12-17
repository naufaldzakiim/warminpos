import {
  IonButton,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  IonInput,
  IonImg,
} from "@ionic/react";
import { Center, Box, Stack } from "@mantine/core";
import React, { useEffect, useState, useContext } from "react";
import { supabase } from "../api/supabaseClient";
import { UserContext } from "../App";
import bcrypt from "bcrypt";
import { compareSync } from "bcrypt-ts";

const Login: React.FC = () => {
  const { user, setUser } = useContext<any>(UserContext);
  const [data, setData] = useState<any>([]);

  const getData = async (username: string) => {
    const { data, error } = await supabase
      .from("users")
      .select()
      .eq("username", username);
    console.log("ini data", data);
    setData(data);
  };

  const handleLogin = async (event: any) => {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;

    try {
      const response = await supabase
        .from("users")
        .select('*, roles(role)')
        .eq("username", username);
      
      console.log("ini response", response);

      if (response.data && response.data.length > 0) {
        const user = response.data[0];
        const isMatched = compareSync(password, user.password);
        console.log("isMatched", isMatched);
        if (isMatched) {
          setUser(user);
        } else {
          alert("Username atau Password Salah");
        }
      } else {
        alert("Username atau Password salah");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <IonImg
          src="/resources/icon.png"
          alt="The Wisconsin State Capitol building in Madison, WI at night"
          style={imgStyle}
        ></IonImg>
        <form
          onSubmit={handleLogin}
          style={{
            display: "flex",
            flexDirection: "column",
            margin: "0 auto",
            maxWidth: "600px",
            gap: "1rem",
          }}
        >
          <IonInput
            type="text"
            label="Username"
            name="username"
            required
            style={inputStyle}
          />
          <IonInput
            type="password"
            label="Password"
            name="password"
            required
            style={inputStyle}
          />
          <IonButton expand="block" type="submit">
            Login
          </IonButton>
        </form>
      </IonContent>
    </IonPage>
  );
};

const imgStyle = {
  maxWidth: "300px",
  height: "auto",
  margin: "0 auto",
};

const inputStyle = {
  border: "1px solid #ccc",
};

export default Login;
