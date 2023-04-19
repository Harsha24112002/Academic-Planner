import { applyMiddleware, combineReducers, configureStore } from "@reduxjs/toolkit";
import tmpreducer from "./Reducers/tmpreducer";
import detailsReducer from "./Reducers/DetailsReducer";
import courseDetailsReducer from "./Reducers/CourseDetailsReducer";
import authReducer from "./features/auth/authSlice"
import thunk from "redux-thunk";
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';

const reducers = {
    studentDetails : detailsReducer,
    tmpreducer : tmpreducer,
    courseDetails : courseDetailsReducer,
    auth: authReducer,
}
const rootreducer = combineReducers(
    reducers
)

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth']
};

const persistreducer = persistReducer(persistConfig, rootreducer);

const store = configureStore({reducer:persistreducer}, applyMiddleware(thunk))
export default store

export const persistor = persistStore(store);