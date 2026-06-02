import { combineReducers, configureStore } from '@reduxjs/toolkit'
import auth from './slices/auth.reducer'
import payments from './slices/payments.reducer'
import analyses from './slices/analyses.reducer'

const rootReducer = combineReducers({
  auth,
  payments,
  analyses,
})

export const makeStore = () =>
  configureStore({
    reducer: rootReducer,
  })

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = AppStore['dispatch']
