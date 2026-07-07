import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit';
import { fetchAnalyses } from '@/services/analysesApi'
import type { AnalysisSummary } from '@/types/analysis'

export interface AnalysesState {
  loading: boolean
  errorMessage: string | null
  entities: AnalysisSummary[]
  totalItems: number | null
}

const initialState: AnalysesState = {
  loading: false,
  errorMessage: null,
  entities: [],
  totalItems: null,
}

function extractMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) return error.message
  return fallback
}

export const getEntities = createAsyncThunk<
  AnalysisSummary[],
  void,
  { rejectValue: string }
>('analyses/fetch_entity_list', async (_: any, thunkAPI: { rejectWithValue: (arg0: string) => any; }) => {
  try {
    const data = await fetchAnalyses()
    return data
  } catch (err) {
    return thunkAPI.rejectWithValue(extractMessage(err, 'Failed to load analyses'))
  }
})

export const analysesSlice = createSlice({
  name: 'analyses',
  initialState,
  reducers: {
    reset: (state) => {
      state.loading = false
      state.errorMessage = null
      state.entities = []
      state.totalItems = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getEntities.pending, (state) => {
        state.loading = true
        state.errorMessage = null
      })
      .addCase(getEntities.fulfilled, (state, action: PayloadAction<AnalysisSummary[]>) => {
        state.loading = false
        state.entities = action.payload
        state.totalItems = action.payload.length
      })
      .addCase(getEntities.rejected, (state, action) => {
        state.loading = false
        state.entities = []
        state.totalItems = 0
        state.errorMessage = action.payload ?? action.error.message ?? 'Failed to load analyses'
      })
  },
})

export const { reset } = analysesSlice.actions
export default analysesSlice.reducer
