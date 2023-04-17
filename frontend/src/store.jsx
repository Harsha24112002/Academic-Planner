import { applyMiddleware, combineReducers, configureStore } from "@reduxjs/toolkit";
import tmpreducer from "./Reducers/tmpreducer";
import detailsReducer from "./Reducers/DetailsReducer";
import courseDetailsReducer from "./Reducers/CourseDetailsReducer";
import authReducer from "./features/auth/authSlice"
import thunk from "redux-thunk";

const reducers = {
    studentDetails : detailsReducer,
    tmpreducer : tmpreducer,
    courseDetails : courseDetailsReducer,
    auth: authReducer,
}
const rootreducer = combineReducers(
    reducers
)

const store = configureStore({reducer:rootreducer}, applyMiddleware(thunk))
export default store