import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
  IonButton,
  useIonRouter,
} from "@ionic/react";
import { useLocation } from "react-router-dom";
import {
  personCircleSharp,
  personCircleOutline,
  gridSharp,
  gridOutline,
  listSharp,
  listOutline,
  powerSharp,
  powerOutline,
  shieldCheckmarkSharp,
  shieldCheckmarkOutline,
  peopleSharp,
  peopleOutline,
} from "ionicons/icons";
import { Stack, Button } from "@mantine/core";
import "./Menu.css";
import { UserContext } from "../App";
import React, { useContext } from "react";

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}

const appPages: AppPage[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    iosIcon: gridOutline,
    mdIcon: gridSharp,
  },
  {
    title: "Role Pengguna",
    url: "/roles",
    iosIcon: shieldCheckmarkOutline,
    mdIcon: shieldCheckmarkSharp,
  },
  {
    title: "Karyawan",
    url: "/employee",
    iosIcon: peopleOutline,
    mdIcon: peopleSharp,
  },
  {
    title: "Pesanan",
    url: "/orders",
    iosIcon: listOutline,
    mdIcon: listSharp,
  },
  {
    title: "Profile",
    url: "/profile",
    iosIcon: personCircleOutline,
    mdIcon: personCircleSharp,
  },
];

const Menu: React.FC = () => {
  const { user, setUser } = useContext<any>(UserContext);
  const router = useIonRouter();

  const location = useLocation();
  const baseRoute = "/" + location.pathname.split("/")[1];

  const handleLogout = () => {
    setUser(null);
    router.push("/login", "root", "replace");
  };

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <Stack h="100%" w="100%" justify="space-between">
          <IonList id="inbox-list">
            <IonListHeader>WarmInPos</IonListHeader>
            <IonNote>Halo</IonNote>
            {appPages.map((appPage, index) => {
              return (
                <IonMenuToggle key={index} autoHide={false}>
                  <IonItem
                    className={baseRoute === appPage.url ? "selected" : ""}
                    routerLink={appPage.url}
                    routerDirection="none"
                    lines="none"
                    detail={false}
                  >
                    <IonIcon
                      aria-hidden="true"
                      slot="start"
                      ios={appPage.iosIcon}
                      md={appPage.mdIcon}
                    />
                    <IonLabel>{appPage.title}</IonLabel>
                  </IonItem>
                </IonMenuToggle>
              );
            })}
          </IonList>
          <IonButton
            fill="solid"
            expand="block"
            color="danger"
            onClick={() => {
              setUser(null);
            }}
          >
            <IonIcon slot="start" icon={powerOutline}></IonIcon>
            Logout
          </IonButton>
        </Stack>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
