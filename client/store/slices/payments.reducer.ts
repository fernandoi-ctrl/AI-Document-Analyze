import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { fetchCredits, startCheckout } from '@/services/paymentsApi'

export interface PaymentsState {
  loading: boolean
  updating: boolean
  updateSuccess: boolean
  errorMessage: string | null
  credits: number | null
  checkoutUrl: string | null
}

const initialState: PaymentsState = {
  loading: false,
  updating: false,
  updateSuccess: false,
  errorMessage: null,
  credits: null,
  checkoutUrl: null,
}

function extractMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) return error.message
  return fallback
}

export const getCredits = createAsyncThunk<number, void, { rejectValue: string }>('payments/fetch_credits', async (_, thunkAPI) => {
  try {
    const { data } = await fetchCredits()
    return data.credits
  } catch (err) {
    return thunkAPI.rejectWithValue(extractMessage(err, 'Failed to load credits'))
  }
})

export const createCheckout = createAsyncThunk<
  string,
  void,
  { rejectValue: string }
>('payments/create_checkout', async (_, thunkAPI) => {
  try {
    const { data } = await startCheckout()
    // No list to refresh — the user is redirected to Stripe externally.
    return data.url
  } catch (err) {
    return thunkAPI.rejectWithValue(extractMessage(err, 'Failed to start checkout'))
  }
})

export const paymentsSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    reset: (state) => {
      state.loading = false
      state.updating = false
      state.updateSuccess = false
      state.errorMessage = null
      state.checkoutUrl = null
    },
    clearCheckoutUrl: (state) => {
      state.checkoutUrl = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCredits.pending, (state) => {
        state.loading = true
        state.errorMessage = null
      })
      .addCase(getCredits.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false
        state.credits = action.payload
      })
      .addCase(getCredits.rejected, (state, action) => {
        state.loading = false
        state.credits = 0
        state.errorMessage = action.payload ?? action.error.message ?? 'Failed to load credits'
      })
      .addCase(createCheckout.pending, (state) => {
        state.updating = true
        state.updateSuccess = false
        state.errorMessage = null
        state.checkoutUrl = null
      })
      .addCase(createCheckout.fulfilled, (state, action: PayloadAction<string>) => {
        state.updating = false
        state.updateSuccess = true
        state.checkoutUrl = action.payload
      })
      .addCase(createCheckout.rejected, (state, action) => {
        state.updating = false
        state.updateSuccess = false
        state.errorMessage = action.payload ?? action.error.message ?? 'Failed to start checkout'
      })
  },
})

export const { reset, clearCheckoutUrl } = paymentsSlice.actions
export default paymentsSlice.reducer
