import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  IonInput,
  IonItem,
  IonButton,
  IonToast,
  IonIcon,
  IonBackButton,
} from "@ionic/react";
import { add, arrowBack } from "ionicons/icons";
import React, { useRef, useState } from "react";
import { supabase } from "../api/supabaseClient";
import { Link } from "react-router-dom";

const AddRolePage: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLIonInputElement>(null);

  const onAddHandle = async (role: string) => {
    try {
      const response = await supabase
        .from("roles")
        .select("*", { count: "exact", head: true })
        .eq("deleted", false)
        .eq("role", role);

      if (response.count && response.count > 0) {
        setMessage("Role sudah ada");
        setIsOpen(true);
        return;
      } else {
        try {
          const res = await supabase.from("roles").insert([{ role: (role).toLowerCase() }]);
          if (res.status == 201) {
            setMessage("Role berhasil ditambahkan");
            setIsOpen(true);
            return;
          }
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton style={{ color: "#ffffff" }} routerLink="/roles">
              <IonIcon slot="icon-only" icon={arrowBack}></IonIcon>
            </IonButton>
          </IonButtons>

          <IonTitle>Buat Role Baru</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonItem style={{ margin: "25px 20px 25px 20px" }}>
          <IonInput
            ref={inputRef}
            labelPlacement="stacked"
            label="Masukkan Role Baru"
            placeholder="Nama Role"
          />
        </IonItem>
        <IonButton
          fill="solid"
          expand="block"
          color="success"
          style={{ margin: "0px 20px 0px 20px" }}
          onClick={() => onAddHandle(inputRef.current?.value?.toString() || "")}
        >
          <IonIcon slot="start" icon={add}></IonIcon>
          Tambah
        </IonButton>
        <IonToast
          isOpen={isOpen}
          message={message}
          onDidDismiss={() => setIsOpen(false)}
          duration={5000}
        ></IonToast>
      </IonContent>
    </IonPage>
  );
};

export default AddRolePage;
