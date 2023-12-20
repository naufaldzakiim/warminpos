import {
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonInput,
  IonItem,
  IonButton,
  IonToast,
  IonIcon,
  IonSpinner,
} from "@ionic/react";
import { arrowBack, save } from "ionicons/icons";
import React, { useRef, useState, useEffect } from "react";
import { supabase } from "../api/supabaseClient";
import { useParams } from "react-router-dom";

const EditEmployeePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<any>();
  const [roleInput, setRoleInput] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLIonInputElement>(null);
  const [isFetching, setIsFetching] = useState(false);

  const getData = async (id: any) => {
    try {
      setIsFetching(true);
      const response = await supabase
        .from("roles")
        .select()
        .eq("deleted", false)
        .eq("id", id);
      console.log("ini response", response);
      setData(response.data);
      setRoleInput(response.data?.[0]?.role);
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    getData(id);
  }, []);

  const onChangeHandle = (event: any) => {
    setRoleInput(event.target.value);
  };

  const onUpdateHandle = async (role: string) => {
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
          const res = await supabase
            .from("roles")
            .update({
              role: role,
              updated_at: new Date().toLocaleString("en-US", {
                timeZone: "Asia/Jakarta",
              }),
            })
            .eq("id", id);
          if (res.status == 204) {
            setMessage("Role berhasil diperbarui");
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

          <IonTitle>Edit Role</IonTitle>
        </IonToolbar>
      </IonHeader>

      {isFetching ? (
        <IonContent fullscreen>
          <IonSpinner
            name="crescent"
            style={{ margin: "0px auto", width: "100%" }}
          ></IonSpinner>
        </IonContent>
      ) : (
        <IonContent fullscreen>
          <IonItem style={{ margin: "25px 20px 25px 20px" }}>
            <IonInput
              ref={inputRef}
              labelPlacement="stacked"
              label="Masukkan Role Baru"
              placeholder="Nama Role"
              value={roleInput}
              onIonChange={onChangeHandle}
            />
          </IonItem>
          <IonButton
            fill="solid"
            expand="block"
            color="success"
            style={{ margin: "0px 20px 0px 20px" }}
            onClick={() => onUpdateHandle(roleInput)}
          >
            <IonIcon slot="start" icon={save}></IonIcon>
            Simpan
          </IonButton>
          <IonToast
            isOpen={isOpen}
            message={message}
            onDidDismiss={() => setIsOpen(false)}
            duration={5000}
          ></IonToast>
        </IonContent>
      )}
    </IonPage>
  );
};

export default EditEmployeePage;
