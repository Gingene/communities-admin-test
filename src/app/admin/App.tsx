"use client";

import { Admin } from "@/components/admin/admin";
// import { ListGuesser } from "@/components/admin";
import { Resource, CustomRoutes, Authenticated } from "ra-core";
import { Dashboard } from "./dashboard";
import { dataProvider } from "./dataprovider";
import { authProvider } from "./authprovider";
import { ConcertList } from "./pages/concert";
import { Route } from "react-router";
import { Me } from "./pages/me";

const App = () => (
  <Admin
    dataProvider={dataProvider}
    authProvider={authProvider}
    dashboard={Dashboard}
  >
    <Resource name="concerts" list={ConcertList} />
    <CustomRoutes>
      <Route
        path="/me"
        element={
          <Authenticated>
            <Me />
          </Authenticated>
        }
      />
    </CustomRoutes>
  </Admin>
);

export default App;
