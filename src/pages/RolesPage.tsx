import {
  IonPage,
  IonRouterOutlet,
} from "@ionic/react";
import { Redirect, Route } from "react-router-dom";
import RoleListPage from "./RoleListPage";
import AddRolePage from "./AddRolePage";
import EditRolePage from "./EditRolePage";


const RolesPage: React.FC = () => {
  return (
    <IonPage>
      <IonRouterOutlet placeholder={null}>
        <Route exact path="/roles" component={RoleListPage} />
        <Route exact path="/roles/new" component={AddRolePage} />
        <Route exact path="/roles/:id/edit" component={EditRolePage} />
      </IonRouterOutlet>
    </IonPage>
  );
};

export default RolesPage;
