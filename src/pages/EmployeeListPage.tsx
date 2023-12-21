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

const EmployeeListPage: React.FC = () => {
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

  useEffect(() => {
    getData();
  }, [router]);

  const getData = async () => {
    try {
      const response = await supabase
        .from("users")
        .select("*, roles(role)")
        .eq("deleted", false)
        .neq("username", "atmin")
      console.log("ini response", response);
      const newData: any = response?.data?.map((item: any) => {
        return { ...item, role: item.roles.role };
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
        .from("users")
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

  function deleteConfirmation(id: number, name: string) {
    return new Promise<boolean>((resolve, reject) => {
      presentDelete({
        header: `Apakah Anda ingin menghapus karyawan ${name}?`,
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
          <IonTitle>Daftar Karyawan</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        {data.map((item: any) => {
          return (
            <IonItemSliding key={item.id}>
              <IonItem>
                <IonLabel>{capitalize(item.username)}</IonLabel>
              </IonItem>

              <IonItemOptions side="end">
                <IonItemOption
                  color="warning"
                  routerLink={`/employees/${item.id}/edit`}
                >
                  <IonIcon slot="icon-only" icon={pencil} />
                </IonItemOption>

                <IonItemOption color="danger">
                  <IonIcon
                    slot="icon-only"
                    icon={trash}
                    onClick={() => {
                      deleteConfirmation(item.id, capitalize(item.name));
                    }}
                  />
                </IonItemOption>
              </IonItemOptions>
            </IonItemSliding>
          );
        })}
        <IonFab slot="fixed" vertical="bottom" horizontal="end">
          <IonFabButton routerLink="/employees/new">
            <IonIcon icon={add}></IonIcon>
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default EmployeeListPage;
