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
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import { add, arrowBack } from "ionicons/icons";
import React, { useRef, useState, useEffect } from "react";
import { supabase } from "../api/supabaseClient";
import { Link } from "react-router-dom";
import { genSaltSync, hashSync } from "bcrypt-ts";

const AddEmployeePage: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [roles, setRoles] = useState<any>([]);
  const [stores, setStores] = useState<any>([]);
  const inputRef = useRef<HTMLIonInputElement>(null);

  const getRoles = async () => {
    try {
      const response = await supabase
        .from("roles")
        .select("id, role")
        .eq("deleted", false)
        .neq("role", "owner");
      console.log("ini response", response);
      setRoles(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getStores = async () => {
    try {
      const response = await supabase.from("stores").select("id, name");
      console.log("ini response", response);
      setStores(response.data);
    } catch (error) {
      console.log(error);
    }
  };

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
          const res = await supabase
            .from("roles")
            .insert([{ role: role.toLowerCase() }]);
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

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;
    const name = event.target.name.value;
    const role = event.target.role.value;
    const store = event.target.store.value;
    const thisYear = new Date().getFullYear().toString();
    const thisMonth = new Date().getMonth() + 1;

    const salt = genSaltSync(10);
    const hashedPassword = hashSync(password, salt);

    try {
      const response = await supabase
        .from("users")
        .select("*", { count: "exact", head: true })
        .eq("deleted", false)
        .eq("username", username);

      if (response.count && response.count > 0) {
        setMessage("Username sudah ada");
        setIsOpen(true);
        return;
      } else {
        const response = await supabase
          .from("users")
          .select("*", { count: "exact", head: true })
          .ilike("id", "%" + thisYear + thisMonth + "%")
          .neq("username", "atmin");

        const id = `${store}${thisYear}${thisMonth}X${(response.count! + 1)
          .toString()
          .padStart(2, "0")}`;

        const res = await supabase.from("users").insert([
          {
            id: id,
            username: username,
            password: hashedPassword,
            name: name,
            role_id: role,
          },
        ]);

        if (res.status == 201) {
          setMessage("Karyawan berhasil ditambahkan");
          setIsOpen(true);
          return;
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const capitalize = (s: string) => {
    if (typeof s !== "string") return "";
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  useEffect(() => {
    getRoles();
    getStores();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton style={{ color: "#ffffff" }} routerLink="/employees">
              <IonIcon slot="icon-only" icon={arrowBack}></IonIcon>
            </IonButton>
          </IonButtons>

          <IonTitle>Buat Karyawan Baru</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <form
          onSubmit={handleSubmit}
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
            labelPlacement="floating"
            required
            style={{ borderBottom: "1px solid #ccc" }}
          />
          <IonInput
            type="password"
            label="Password"
            name="password"
            labelPlacement="floating"
            required
            style={{ borderBottom: "1px solid #ccc" }}
          />
          <IonInput
            type="text"
            label="Nama Karyawan"
            name="name"
            labelPlacement="floating"
            required
            style={{ borderBottom: "1px solid #ccc" }}
          />
          <IonSelect
            label="Pilih Role"
            labelPlacement="floating"
            fill="outline"
            name="role"
          >
            {roles.map((item: any) => {
              return (
                <IonSelectOption key={item.id} value={item.id}>
                  {capitalize(item.role)}
                </IonSelectOption>
              );
            })}
          </IonSelect>
          <IonSelect
            label="Pilih Warung"
            labelPlacement="floating"
            fill="outline"
            name="store"
          >
            {stores.map((item: any) => {
              return (
                <IonSelectOption key={item.id} value={item.id}>
                  {capitalize(item.name)}
                </IonSelectOption>
              );
            })}
          </IonSelect>
          <IonButton fill="solid" expand="block" color="success" type="submit">
            <IonIcon slot="start" icon={add}></IonIcon>
            Tambah
          </IonButton>
        </form>
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

export default AddEmployeePage;
