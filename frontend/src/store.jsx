import {
  applyMiddleware,
  combineReducers,
  configureStore,
} from "@reduxjs/toolkit";
import tmpreducer from "./Reducers/tmpreducer";
import detailsReducer from "./Reducers/DetailsReducer";
import coursesSearchReducer from "./Reducers/CoursesSearchReducer";
import authReducer from "./features/auth/authSlice";
import courseDetailsReducer from "./features/courseDetailsSlice";
import GPAcourses from "./features/GPAcourses";
import thunk from "redux-thunk";
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import pathDetailsReducer from "./features/pathDetailsSlice";
import pathsSearchReducer from "./Reducers/PathsSearchReducer";

const reducers = {
  studentDetails: detailsReducer,
  tmpreducer: tmpreducer,
  coursesSearch: coursesSearchReducer,
  pathsSearch: pathsSearchReducer,
  auth: authReducer,
  pathDetails: pathDetailsReducer,
  courseDetails: courseDetailsReducer,
  gpaCourses: GPAcourses
};
const rootreducer = combineReducers(reducers);

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth']
};

const persistreducer = persistReducer(persistConfig, rootreducer);

const store = configureStore({reducer:persistreducer}, applyMiddleware(thunk))
export default store

export const persistor = persistStore(store);
