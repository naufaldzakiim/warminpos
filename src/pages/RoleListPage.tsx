import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonIcon,
  IonFab,
  IonFabButton,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  useIonActionSheet,
  useIonModal,
  IonNavLink,
  useIonRouter,
} from "@ionic/react";
import { OverlayEventDetail } from "@ionic/core/components";
import {
  pencil,
  pencilSharp,
  pencilOutline,
  trash,
  trashBinSharp,
  trashBinOutline,
  add,
} from "ionicons/icons";
import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../api/supabaseClient";

const RoleListPage: React.FC = () => {
  const [data, setData] = useState<any>([]);
  const pageDeleteConfirmation = useRef(null);
  const router = useIonRouter();

  const [presentingElementDelete, setPresentingElementDelete] =
    useState<HTMLElement | null>(null);
  const [presentDelete] = useIonActionSheet();

  useEffect(() => {
    getData();
    setPresentingElementDelete(pageDeleteConfirmation.current);
  }, []);

  const getData = async () => {
    try {
      const response = await supabase
        .from("roles")
        .select()
        .eq("deleted", false);
      console.log("ini response", response);
      const newData = response?.data?.filter((item: any) => {
        return item.role !== "owner";
      });
      setData(newData);
    } catch (error) {
      console.log(error);
    }
  };

  const capitalize = (s: string) => {
    if (typeof s !== "string") return "";
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await supabase
        .from("roles")
        .update({
          deleted: true,
          deleted_at: new Date().toLocaleString("en-US", {
            timeZone: "Asia/Jakarta",
          }),
        })
        .eq("id", id);
      getData();
    } catch (error) {
      console.log(error);
    }
  };

  function deleteConfirmation(id: number, role: string) {
    return new Promise<boolean>((resolve, reject) => {
      presentDelete({
        header: `Apakah Anda ingin menghapus role ${role}?`,
        buttons: [
          {
            text: "Ya",
            role: "confirm",
          },
          {
            text: "Tidak",
            role: "cancel",
          },
        ],
        onWillDismiss: (ev) => {
          if (ev.detail.role === "confirm") {
            handleDelete(id);
            resolve(true);
          } else {
            reject();
          }
        },
      });
    });
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Daftar Role Pengguna</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        {data.map((item: any) => {
          return (
            <IonItemSliding key={item.id}>
              <IonItem>
                <IonLabel>{capitalize(item.role)}</IonLabel>
              </IonItem>

              <IonItemOptions side="end">
                <IonItemOption color="warning" routerLink={`/roles/${item.id}/edit`}>
                  <IonIcon
                    slot="icon-only"
                    icon={pencil}
                  />
                </IonItemOption>

                <IonItemOption color="danger">
                  <IonIcon
                    slot="icon-only"
                    icon={trash}
                    onClick={() => {
                      deleteConfirmation(item.id, capitalize(item.role));
                    }}
                  />
                </IonItemOption>
              </IonItemOptions>
            </IonItemSliding>
          );
        })}
          <IonFab slot="fixed" vertical="bottom" horizontal="end">
            <IonFabButton routerLink="/roles/new">
              <IonIcon icon={add}></IonIcon>
            </IonFabButton>
          </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default RoleListPage;
