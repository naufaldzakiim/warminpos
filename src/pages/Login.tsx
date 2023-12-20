import {
  IonButton,
  IonContent,
  IonPage,
  IonInput,
  IonImg,
  IonToast,
  useIonRouter,
} from "@ionic/react";
import { Center, Box, Stack, Text } from "@mantine/core";
import React, { useState } from "react";
import { useStorage } from "../hooks/useStorage";
import { supabase } from "../api/supabaseClient";
import { compareSync } from "bcrypt-ts";
import { useHistory } from "react-router-dom";

const Login: React.FC = () => {
  const { user, setAuthUser } = useStorage();
  const [isOpen, setIsOpen] = useState(false);
  const history = useHistory();
  const router = useIonRouter();

  const handleLogin = async (event: any) => {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;

    try {
      const response = await supabase
        .from("users")
        .select("*, roles(role)")
        .eq("username", username);

      console.log("ini response", response);

      if (response.data && response.data.length > 0) {
        const user = response.data[0];
        const isMatched = compareSync(password, user.password);
        console.log("isMatched", isMatched);
        if (isMatched) {
          const newData = { id: user.id, username: user.username, name: user.name, role: user.roles.role };
          console.log("newData", newData);
          const res = await setAuthUser(newData);
          router.push("/dashboard", "root", "replace");
        } else {
          setIsOpen(true);
        }
      } else {
        setIsOpen(true);
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
            padding: "0 25px",
            maxWidth: "600px",
            gap: "1rem",
          }}
        >
          <IonInput
            type="text"
            label="Username"
            name="username"
            labelPlacement="stacked"
            required
            style={{ borderBottom: "1px solid #ccc" }}
          />
          <IonInput
            type="password"
            label="Password"
            name="password"
            labelPlacement="stacked"
            required
            style={{ borderBottom: "1px solid #ccc" }}
          />
          <IonButton expand="block" type="submit">
            Login
          </IonButton>
        </form>
        <IonToast
          isOpen={isOpen}
          message="Username atau Password salah"
          onDidDismiss={() => setIsOpen(false)}
          duration={5000}
        ></IonToast>
      </IonContent>
    </IonPage>
  );
};

const imgStyle = {
  maxWidth: "300px",
  height: "auto",
  margin: "25px auto 25px auto",
};

export default Login;
