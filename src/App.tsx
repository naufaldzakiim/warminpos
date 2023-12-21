import React, { useState, useEffect } from "react";
import {
  IonApp,
  IonRouterOutlet,
  IonSplitPane,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router-dom";
import { useStorage } from "./hooks/useStorage";
import Menu from "./components/Menu";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import RolesPage from "./pages/RolesPage";
import EmployeesPage from "./pages/EmployeesPage";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";

import "@mantine/core/styles.css";

setupIonicReact();

const App: React.FC = () => {
  const { getAuthUser, isAuthUser } = useStorage();
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState<any>();

  // const getAuth = async () => {
  //   const auth = await isAuthUser();
  //   setIsAuth(auth);
  // }

  // useEffect(() => {
  //   getAuth();
  // }, []);

  // useEffect(() => {
  //   console.log("user di app", user);
  //   console.log("isAuth di app", isAuth);
  // }, [user]);

  // if (!isAuth) {
  //   return (
  //     <IonApp>
  //       <IonReactRouter>
  //         <IonRouterOutlet id="main" placeholder={null}>
  //           <Route exact path="/login" component={Login} />
  //           <Redirect exact from="/" to="/login" />
  //           <Route render={() => <Redirect to="/login" />} />
  //         </IonRouterOutlet>
  //       </IonReactRouter>
  //     </IonApp>
  //   );
  // }

  return (
    <IonApp>
      <IonReactRouter>
        <IonSplitPane contentId="main">
          <Menu />
          <IonRouterOutlet id="main" placeholder={null}>
            <Redirect exact from="/" to="/login" />
            {/* <Redirect exact from="/login" to="/dashboard" /> */}
            <Route exact path="/login" component={Login} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/roles" component={RolesPage} />
            <Route path="/employees" component={EmployeesPage} />
            <Route path="/profile" component={Profile} />
            <Route render={() => <Redirect to="/dashboard" />} />
          </IonRouterOutlet>
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
