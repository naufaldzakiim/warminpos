import {
  IonPage,
  IonRouterOutlet,
} from "@ionic/react";
import { Redirect, Route } from "react-router-dom";
import EmployeeListPage from "./EmployeeListPage";
import AddEmployeePage from "./AddEmployeePage";
import EditEmployeePage from "./EditEmployeePage";


const EmployeesPage: React.FC = () => {
  return (
    <IonPage>
      <IonRouterOutlet placeholder={null}>
        <Route exact path="/employees" component={EmployeeListPage} />
        <Route exact path="/employees/new" component={AddEmployeePage} />
        <Route exact path="/employees/:id/edit" component={EditEmployeePage} />
      </IonRouterOutlet>
    </IonPage>
  );
};

export default EmployeesPage;
