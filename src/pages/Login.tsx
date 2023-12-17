import {
  IonButton,
  IonContent,
  IonPage,
  IonInput,
  IonImg,
  IonToast
} from "@ionic/react";
import { Center, Box, Stack, Text } from "@mantine/core";
import React, { useContext, useState } from "react";
import { supabase } from "../api/supabaseClient";
import { UserContext } from "../App";
import { compareSync } from "bcrypt-ts";

const Login: React.FC = () => {
  const { user, setUser } = useContext<any>(UserContext);
  const [isOpen, setIsOpen] = useState(false);

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
            style={{borderBottom: "1px solid #ccc"}}
          />
          <IonInput
            type="password"
            label="Password"
            name="password"
            labelPlacement="stacked"
            required
            style={{borderBottom: "1px solid #ccc"}}
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
