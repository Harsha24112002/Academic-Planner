import { applyMiddleware, combineReducers, configureStore } from "@reduxjs/toolkit";
import tmpreducer from "./Reducers/tmpreducer";
import detailsReducer from "./Reducers/DetailsReducer";
import thunk from "redux-thunk";

const reducers = {
    studentDetails : detailsReducer,
    tmpreducer : tmpreducer
}
const rootreducer = combineReducers(
    reducers
)

const store = configureStore({reducer:rootreducer}, applyMiddleware(thunk))
export default store