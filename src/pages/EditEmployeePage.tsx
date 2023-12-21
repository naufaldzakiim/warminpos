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
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import { arrowBack, save } from "ionicons/icons";
import React, { useRef, useState, useEffect } from "react";
import { supabase } from "../api/supabaseClient";
import { useParams } from "react-router-dom";
import { genSaltSync, hashSync, compareSync } from "bcrypt-ts";

const EditEmployeePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<any>();
  const [form, setForm] = useState<any>({});
  const [roles, setRoles] = useState<any>([]);
  const [stores, setStores] = useState<any>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLIonInputElement>(null);
  const [isFetching, setIsFetching] = useState(false);

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

  const getData = async (id: any) => {
    try {
      setIsFetching(true);
      const response = await supabase
        .from("users")
        .select()
        .eq("deleted", false)
        .eq("id", id);
      console.log("ini response", response);
      const res = response?.data![0];
      const store_id = res.id.substring(0, res.id.length - 9);
      const newData = { ...res, store_id: store_id };
      setData(newData);
      setForm({
        id: newData.id,
        username: newData.username,
        name: newData.name,
        role: newData.role_id,
        store: newData.store_id,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    getRoles();
    getStores();
    getData(id);
  }, []);

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
            .from("users")
            .update({
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

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const newUsername = event.target.username.value;
    const newPassword = event.target.password.value;
    const newName = event.target.name.value;
    const newRole = parseInt(event.target.role.value);
    const newStore = event.target.store.value;

    const salt = genSaltSync(10);
    const hashedNewPassword = hashSync(newPassword, salt);

    // console.log("newUsername", newUsername);
    // console.log("newPassword", newPassword);
    // console.log("newName", newName);
    // console.log("newRole", newRole);
    // console.log("newStore", newStore);

    // console.log("data", data);

    const newData: any = {};

    if (data.username !== newUsername) {
      newData.username = newUsername;
    }

    if (!compareSync(hashedNewPassword, data.password) && newPassword !== "") {
      newData.password = hashedNewPassword;
    }

    if (data.name !== newName) {
      newData.name = newName;
    }

    if (data.role_id !== newRole) {
      newData.role_id = newRole;
    }

    if (data.store_id !== newStore) {
      const suffix = id.substring(data.id.length - 9, data.id.length);
      newData.id = newStore + suffix;
    }

    if (Object.keys(newData).length > 0) {
      newData.updated_at = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
      });
    }

    try {
      const response = await supabase
        .from("users")
        .select("*", { count: "exact", head: true })
        .eq("deleted", false)
        .eq("username", newData.username);

      if (response.count && response.count > 0) {
        setMessage("Username sudah ada");
        setIsOpen(true);
      } else {
        // console.log("newData", newData);

        const res = await supabase
          .from("users")
          .update(newData)
          .eq("id", data.id);
        if (res.status == 204) {
          setMessage("Karyawan berhasil diperbarui");
          setIsOpen(true);
          return;
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  };

  const capitalize = (s: string) => {
    if (typeof s !== "string") return "";
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

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

      {isFetching ? (
        <IonContent fullscreen>
          <IonSpinner
            name="crescent"
            style={{ margin: "0px auto", width: "100%" }}
          ></IonSpinner>
        </IonContent>
      ) : (
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
              value={form && form.username}
              onIonChange={handleChange}
              style={{ borderBottom: "1px solid #ccc" }}
            />
            <IonInput
              type="password"
              label="Password"
              name="password"
              labelPlacement="floating"
              value={form && form.password}
              onIonChange={handleChange}
              style={{ borderBottom: "1px solid #ccc" }}
            />
            <IonInput
              type="text"
              label="Nama Karyawan"
              name="name"
              labelPlacement="floating"
              required
              value={form && form.name}
              onIonChange={handleChange}
              style={{ borderBottom: "1px solid #ccc" }}
            />
            <IonSelect
              label="Pilih Role"
              labelPlacement="floating"
              fill="outline"
              name="role"
              value={form && parseInt(form.role)}
              onIonChange={handleChange}
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
              value={form && form.store}
              onIonChange={handleChange}
            >
              {stores.map((item: any) => {
                return (
                  <IonSelectOption key={item.id} value={item.id}>
                    {capitalize(item.name)}
                  </IonSelectOption>
                );
              })}
            </IonSelect>
            <IonButton
              fill="solid"
              expand="block"
              color="success"
              type="submit"
            >
              <IonIcon slot="start" icon={save}></IonIcon>
              Simpan
            </IonButton>
          </form>
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
