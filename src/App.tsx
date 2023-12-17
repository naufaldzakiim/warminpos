import React, { useState, createContext } from "react";
import {
  IonApp,
  IonRouterOutlet,
  IonSplitPane,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router-dom";
import Menu from "./components/Menu";
import MenuOwner from "./components/MenuOwner";
import Dashboard from "./pages/Dashboard";
import OrderList from "./pages/OrderList";
import OrderDetail from "./pages/OrderDetail";
import AddOrder from "./pages/AddOrder";
import Profile from "./pages/Profile";
import Login from "./pages/Login";

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

export const UserContext = createContext<any>(null);

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);

  if (user === null) {
    return (
      <IonApp>
        <UserContext.Provider
          value={{
            user,
            setUser,
          }}
        >
          <IonReactRouter>
            <IonRouterOutlet id="main" placeholder={null}>
              <Redirect exact from="/" to="/login" />
              <Route path="/login" component={Login} />
              <Route render={() => <Redirect to="/login" />} />
            </IonRouterOutlet>
          </IonReactRouter>
        </UserContext.Provider>
      </IonApp>
    );
  }

  return (
    <IonApp>
      <UserContext.Provider
        value={{
          user,
          setUser,
        }}
      >
        <IonReactRouter>
          <IonSplitPane contentId="main">
            {/* {user.role == 1 && <MenuOwner/>} */}
            <MenuOwner />
            {/* <Menu /> */}
            <IonRouterOutlet id="main" placeholder={null}>
              <Redirect exact from="/" to="/dashboard" />
              <Route path="/dashboard" component={Dashboard} />
              {/* <Route path="/orders" component={OrderList} />
              <Route path="/orders/new" component={AddOrder} /> */}
              <Route path="/profile" component={Profile} />
              <Route path="/orders/:id" component={OrderDetail} />
              <Route render={() => <Redirect to="/dashboard" />} />
            </IonRouterOutlet>
          </IonSplitPane>
        </IonReactRouter>
      </UserContext.Provider>
    </IonApp>
  );
};

export default App;
