// import { configureStore } from "@reduxjs/toolkit";
// import { setupListeners } from "@reduxjs/toolkit/query";

// import authReducer from "./slices/authSlice";
// import userReducer from "./slices/userSlice";
// import { campaignApi } from "./services/campaignApi";
// import { subCampaignApi } from "./services/subCampaignApi";
// import { transactionApi } from "./services/transactionApi";
// import { fundraiserApi } from "./services/fundraiserApi";

// const setUpStore = () => {
//   const store = configureStore({
//     reducer: {
//       [campaignApi.reducerPath]: campaignApi.reducer,
//       [subCampaignApi.reducerPath]: subCampaignApi.reducer,
//       [transactionApi.reducerPath]: transactionApi.reducer,
//       [fundraiserApi.reducerPath]: fundraiserApi.reducer,

//       //Frontend

//       auth: authReducer,
//       user: userReducer,
//     },
//     middleware: (getDM) => [
//       ...getDM(),
//       campaignApi.middleware,
//       subCampaignApi.middleware,
//       transactionApi.middleware,
//       fundraiserApi.middleware,
//     ],
//   });
//   setupListeners(store.dispatch);
//   return store;
// };

// export const store = setUpStore();

import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";
import { campaignApi } from "./services/campaignApi";
import { subCampaignApi } from "./services/subCampaignApi";
import { transactionApi } from "./services/transactionApi";
import { fundraiserApi } from "./services/fundraiserApi";
import { ngoApi } from "./services/ngoApi"; // ← NEW

const setUpStore = () => {
  const store = configureStore({
    reducer: {
      [campaignApi.reducerPath]: campaignApi.reducer,
      [subCampaignApi.reducerPath]: subCampaignApi.reducer,
      [transactionApi.reducerPath]: transactionApi.reducer,
      [fundraiserApi.reducerPath]: fundraiserApi.reducer,
      [ngoApi.reducerPath]: ngoApi.reducer,
      auth: authReducer,
      user: userReducer,
    },
    middleware: (getDM) =>
      getDM({ serializableCheck: false }).concat(
        campaignApi.middleware,
        subCampaignApi.middleware,
        transactionApi.middleware,
        fundraiserApi.middleware,
        ngoApi.middleware
      ),
  });

  setupListeners(store.dispatch);
  return store;
};

export const store = setUpStore();
