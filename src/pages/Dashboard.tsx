import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonRouter,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonList,
  IonItem,
  IonThumbnail,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonDatetime,
  useIonPopover,
  IonButton,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { supabase } from "../api/supabaseClient";
import { format, parseISO } from "date-fns";

const Dashboard: React.FC = () => {
  const router = useIonRouter();
  const [stores, setStores] = useState<any>([]);
  const [transactions, setTransactions] = useState<any>([]);
  const [selectedStore, setSelectedStore] = useState<any>("");
  const [selectedShift, setSelectedShift] = useState<any>("");
  const [selectedDate, setSelectedDate] = useState<any>();

  const getStores = async () => {
    try {
      const response = await supabase.from("stores").select();
      console.log("ini response", response);
      setStores(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getTransactions = async (
    store_id: string = "",
    shift: any = "",
    selectedDate: any = ""
  ) => {
    const shiftFilter =
      shift === "" ? "shift.eq.1,shift.eq.2" : "shift.eq." + shift;

    const formattedString =
      selectedDate === "" ? "" : format(parseISO(selectedDate), "yyyy-MM-dd");

    // console.log("selectedDateGetTrans", selectedDate)
    // console.log("formattedStringGetTrans", formattedString)

    const query =
      formattedString === ""
        ? supabase
            .from("transactions")
            .select("*, users(name), dining_tables!inner(store_id!inner(name))")
            .ilike("id", `${store_id}%`)
            .or(shiftFilter)
            .order("date", { ascending: false })
        : supabase
            .from("transactions")
            .select("*, users(name), dining_tables!inner(store_id!inner(name))")
            .ilike("id", `${store_id}%`)
            .or(shiftFilter)
            .eq("date", formattedString)
            .order("date", { ascending: false });

    try {
      const response = await query;
      console.log("ini response", response);
      const newData = response?.data?.map((item: any) => {
        const store = item.dining_tables.store_id.name;
        return { ...item, store };
      });
      // console.log("ini newData", newData);
      setTransactions(newData);
    } catch (error) {
      console.log(error);
    }
  };

  function formatNumber(number: number): string {
    const reversedStr: string = number.toString().split("").reverse().join("");
    const formattedStr: string = reversedStr.match(/.{1,3}/g)!.join(".");
    const formattedNumber: string = formattedStr.split("").reverse().join("");
    return formattedNumber;
  }

  const capitalize = (s: string) => {
    if (typeof s !== "string") return "";
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  useEffect(() => {
    getStores();
    getTransactions();
  }, [router]);

  useEffect(() => {
    getTransactions(selectedStore, selectedShift, selectedDate);
  }, [selectedStore, selectedShift, selectedDate]);

  const Popover = () => {
    return (
      <IonDatetime
        presentation="date"
        showClearButton
        showDefaultButtons
        value={selectedDate}
        onIonChange={(e) => {
          // console.log("tgl", e.detail.value);
          if (e.detail.value === undefined) {
            setSelectedDate(undefined);
            return;
          }
          setSelectedDate(e.detail.value);
        }}
      ></IonDatetime>
    );
  };

  const [present, dismiss] = useIonPopover(Popover, {
    onDismiss: (data: any, role: string) => dismiss(data, role),
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Dashboard</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonCard>
          <IonCardHeader style={{ paddingBottom: "0" }}>
            <IonCardTitle>Daftar Warung</IonCardTitle>
            <IonCardSubtitle>Semua Cabang Warmindo Inspirasi</IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent style={{ padding: "0", margin: "0" }}>
            <IonList>
              {stores.map((store: any) => (
                <IonItem key={store.id}>
                  <IonThumbnail slot="start">
                    <img
                      alt={store.name}
                      src={store.pictures}
                      style={{ borderRadius: "8px" }}
                    />
                  </IonThumbnail>
                  <IonLabel>{store.name}</IonLabel>
                </IonItem>
              ))}
            </IonList>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader style={{ paddingBottom: "0" }}>
            <IonCardTitle>Daftar Transaksi</IonCardTitle>
            <IonCardSubtitle>
              Semua Transaksi Warmindo Inspirasi
            </IonCardSubtitle>
            <IonSelect
              aria-label="Stores"
              interface="popover"
              placeholder="Pilih Warung"
              value={selectedStore}
              onIonChange={(e) => setSelectedStore(e.detail.value)}
            >
              <IonSelectOption value={""}>Semua Warung</IonSelectOption>
              {stores.map((store: any) => (
                <IonSelectOption key={store.id} value={store.id}>
                  {store.name}
                </IonSelectOption>
              ))}
            </IonSelect>
            <IonSelect
              aria-label="Shift"
              interface="popover"
              placeholder="Pilih Shift"
              value={selectedShift}
              onIonChange={(e) => setSelectedShift(e.detail.value)}
            >
              <IonSelectOption value={""}>Semua Shift</IonSelectOption>
              <IonSelectOption value={"1"}>Shift 1</IonSelectOption>
              <IonSelectOption value={"2"}>Shift 2</IonSelectOption>
            </IonSelect>
            <IonLabel style={{ marginTop: "12px" }}>
              {selectedDate === undefined
                ? "Semua Tanggal"
                : format(parseISO(selectedDate), "yyyy-MM-dd")}
            </IonLabel>
            <IonButton
              fill="outline"
              onClick={(e: any) =>
                present({
                  event: e,
                  onDidDismiss: (e: CustomEvent) =>
                    console.log(
                      `Popover dismissed with role: ${e.detail.role}`
                    ),
                })
              }
            >
              Pilih Tanggal
            </IonButton>
          </IonCardHeader>
          <IonCardContent style={{ padding: "0", margin: "0" }}>
            {transactions.length == 0 ? (
              <IonItem>
                <IonLabel style={{textAlign: "center"}}>Tidak ada transaksi</IonLabel>
              </IonItem>
            ) : (
              <IonList>
                {transactions.map((item: any) => (
                  <IonCard color="light" key={item.id}>
                    <IonCardHeader style={{ paddingBottom: "0" }}>
                      <IonCardTitle>{item.id}</IonCardTitle>
                      <IonCardSubtitle>{`${item.date}`}</IonCardSubtitle>
                      <IonCardSubtitle
                        style={{ marginTop: "0px" }}
                      >{`${item.store} | Shift ${item.shift}`}</IonCardSubtitle>
                    </IonCardHeader>

                    <IonCardContent>
                      <IonLabel>{`Cashier : ${item.users.name}`}</IonLabel>
                      <br />
                      <IonLabel style={{ margin: "0" }}>{`Rp. ${formatNumber(
                        item.total
                      )} | ${capitalize(
                        item.payment_method.toLowerCase()
                      )}`}</IonLabel>
                    </IonCardContent>
                  </IonCard>
                ))}
              </IonList>
            )}
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Dashboard;
