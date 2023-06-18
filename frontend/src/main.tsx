import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './ui/app/App';
import '@fontsource/poppins';
import '@fontsource/alfa-slab-one';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {Provider} from "react-redux";
import {store} from "./ui/app/store";

import {library} from '@fortawesome/fontawesome-svg-core';
import {fad} from '@fortawesome/pro-duotone-svg-icons';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {UploadPage} from "./ui/pages/UploadPage.tsx";
import {MultiTrackPage} from "./ui/pages/MultiTrackPage.tsx";
import {HomePage} from "./ui/pages/HomePage.tsx";
import {HomeLayout} from "./ui/layouts/HomeLayout.tsx";
import {InternalLayout} from "./ui/layouts/InternalLayout.tsx";

const router = createBrowserRouter([
    {
      path: "/",
      element: <App/>,
      children: [
        {
          path: "",
          element: <HomeLayout/>,
          children: [
            {
              path: "",
              element: <HomePage/>
            }
          ]
        },
        {
          element: <InternalLayout/>,
          children: [
            {
              path: "upload",
              element: <UploadPage/>
            }, {
              path: "revoice",
              element: <MultiTrackPage/>
            }

          ]
        }
      ]
    },
  ]
);

library.add(fad);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <section>
        <RouterProvider router={router}/>
      </section>
    </Provider>
  </React.StrictMode>
);


