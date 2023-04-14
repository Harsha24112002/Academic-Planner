import { applyMiddleware, combineReducers, configureStore } from "@reduxjs/toolkit";
import tmpreducer from "./Reducers/tmpreducer";
import coursesReducer from "./Reducers/CoursesReducer";
import thunk from "redux-thunk";

const reducers = {
    courseList :coursesReducer,
    tmpreducer : tmpreducer
}
const rootreducer = combineReducers(
    reducers
)

const store = configureStore({reducer:rootreducer}, applyMiddleware(thunk))
export default store