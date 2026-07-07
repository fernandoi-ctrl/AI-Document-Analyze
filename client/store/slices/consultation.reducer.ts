import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit'
import {
  createConsultation as createConsultationApi,
  deleteConsultation as deleteConsultationApi,
  fetchAvailability,
  fetchConsultation,
  fetchConsultations,
  fetchLawyers,
  updateConsultation as updateConsultationApi,
} from '@/services/consultation.service'
import type {
  AvailabilityQuery,
  AvailabilitySlot,
  Consultation,
  CreateConsultationPayload,
  Lawyer,
  UpdateConsultationPayload,
} from '@/types/consultation'

export interface ConsultationState {
  loading: boolean
  updating: boolean
  updateSuccess: boolean
  errorMessage: string | null
  entities: Consultation[]
  entity: Consultation | null
  totalItems: number
  page: number
  size: number
  availability: AvailabilitySlot[]
  loadingAvailability: boolean
  availabilityError: string | null
  lawyers: Lawyer[]
  loadingLawyers: boolean
  lawyersError: string | null
}

const initialState: ConsultationState = {
  loading: false,
  updating: false,
  updateSuccess: false,
  errorMessage: null,
  entities: [],
  entity: null,
  totalItems: 0,
  page: 0,
  size: 20,
  availability: [],
  loadingAvailability: false,
  availabilityError: null,
  lawyers: [],
  loadingLawyers: false,
  lawyersError: null,
}

function extractMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) return error.message
  return fallback
}

export const getConsultations = createAsyncThunk<
  Consultation[],
  void,
  { rejectValue: string }
>('consultation/fetch_entity_list', async (_, thunkAPI) => {
  try {
    const { data } = await fetchConsultations()
    return data
  } catch (err) {
    return thunkAPI.rejectWithValue(
      extractMessage(err, 'No se pudieron cargar las consultas.'),
    )
  }
})

export const getConsultation = createAsyncThunk<
  Consultation,
  string,
  { rejectValue: string }
>('consultation/fetch_entity', async (id, thunkAPI) => {
  try {
    const { data } = await fetchConsultation(id)
    return data
  } catch (err) {
    return thunkAPI.rejectWithValue(
      extractMessage(err, 'No se pudo cargar la consulta.'),
    )
  }
})

export const createConsultation = createAsyncThunk<
  Consultation,
  CreateConsultationPayload,
  { rejectValue: string }
>('consultation/create_entity', async (payload, thunkAPI) => {
  try {
    const { data } = await createConsultationApi(payload)
    return data
  } catch (err) {
    return thunkAPI.rejectWithValue(
      extractMessage(err, 'No se pudo crear la consulta.'),
    )
  }
})

export const updateConsultation = createAsyncThunk<
  Consultation,
  { id: string; payload: UpdateConsultationPayload },
  { rejectValue: string }
>('consultation/update_entity', async ({ id, payload }, thunkAPI) => {
  try {
    const { data } = await updateConsultationApi(id, payload)
    return data
  } catch (err) {
    return thunkAPI.rejectWithValue(
      extractMessage(err, 'No se pudo actualizar la consulta.'),
    )
  }
})

export const deleteConsultation = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('consultation/delete_entity', async (id, thunkAPI) => {
  try {
    await deleteConsultationApi(id)
    return id
  } catch (err) {
    return thunkAPI.rejectWithValue(
      extractMessage(err, 'No se pudo eliminar la consulta.'),
    )
  }
})

export const getAvailability = createAsyncThunk<
  AvailabilitySlot[],
  { lawyerId: string; query: AvailabilityQuery },
  { rejectValue: string }
>('consultation/fetch_availability', async ({ lawyerId, query }, thunkAPI) => {
  try {
    const { data } = await fetchAvailability(lawyerId, query)
    return data
  } catch (err) {
    return thunkAPI.rejectWithValue(
      extractMessage(err, 'No se pudo cargar la disponibilidad.'),
    )
  }
})

export const getLawyers = createAsyncThunk<
  Lawyer[],
  void,
  { rejectValue: string }
>('consultation/fetch_lawyers', async (_, thunkAPI) => {
  try {
    const { data } = await fetchLawyers()
    return data
  } catch (err) {
    return thunkAPI.rejectWithValue(
      extractMessage(err, 'No se pudo cargar la lista de abogados.'),
    )
  }
})

export const consultationSlice = createSlice({
  name: 'consultation',
  initialState,
  reducers: {
    reset: () => initialState,
    clearEntity: (state) => {
      state.entity = null
    },
    clearAvailability: (state) => {
      state.availability = []
      state.availabilityError = null
    },
    clearUpdateSuccess: (state) => {
      state.updateSuccess = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getConsultations.pending, (state) => {
        state.loading = true
        state.errorMessage = null
      })
      .addCase(getConsultations.fulfilled, (state, action: PayloadAction<Consultation[]>) => {
        state.loading = false
        state.entities = action.payload
        state.totalItems = action.payload.length
      })
      .addCase(getConsultations.rejected, (state, action) => {
        state.loading = false
        state.entities = []
        state.totalItems = 0
        state.errorMessage =
          action.payload ?? action.error.message ?? 'No se pudieron cargar las consultas.'
      })

      .addCase(getConsultation.pending, (state) => {
        state.loading = true
        state.errorMessage = null
        state.entity = null
      })
      .addCase(getConsultation.fulfilled, (state, action: PayloadAction<Consultation>) => {
        state.loading = false
        state.entity = action.payload
      })
      .addCase(getConsultation.rejected, (state, action) => {
        state.loading = false
        state.errorMessage =
          action.payload ?? action.error.message ?? 'No se pudo cargar la consulta.'
      })

      .addCase(createConsultation.pending, (state) => {
        state.updating = true
        state.updateSuccess = false
        state.errorMessage = null
      })
      .addCase(createConsultation.fulfilled, (state, action: PayloadAction<Consultation>) => {
        state.updating = false
        state.updateSuccess = true
        state.entity = action.payload
        state.entities = [action.payload, ...state.entities]
        state.totalItems = state.entities.length
      })
      .addCase(createConsultation.rejected, (state, action) => {
        state.updating = false
        state.updateSuccess = false
        state.errorMessage =
          action.payload ?? action.error.message ?? 'No se pudo crear la consulta.'
      })

      .addCase(updateConsultation.pending, (state) => {
        state.updating = true
        state.updateSuccess = false
        state.errorMessage = null
      })
      .addCase(updateConsultation.fulfilled, (state, action: PayloadAction<Consultation>) => {
        state.updating = false
        state.updateSuccess = true
        state.entity = action.payload
        state.entities = state.entities.map((c) =>
          c.id === action.payload.id ? action.payload : c,
        )
      })
      .addCase(updateConsultation.rejected, (state, action) => {
        state.updating = false
        state.updateSuccess = false
        state.errorMessage =
          action.payload ?? action.error.message ?? 'No se pudo actualizar la consulta.'
      })

      .addCase(deleteConsultation.pending, (state) => {
        state.updating = true
        state.updateSuccess = false
        state.errorMessage = null
      })
      .addCase(deleteConsultation.fulfilled, (state, action: PayloadAction<string>) => {
        state.updating = false
        state.updateSuccess = true
        state.entities = state.entities.filter((c) => c.id !== action.payload)
        state.totalItems = state.entities.length
        if (state.entity?.id === action.payload) state.entity = null
      })
      .addCase(deleteConsultation.rejected, (state, action) => {
        state.updating = false
        state.updateSuccess = false
        state.errorMessage =
          action.payload ?? action.error.message ?? 'No se pudo eliminar la consulta.'
      })

      .addCase(getAvailability.pending, (state) => {
        state.loadingAvailability = true
        state.availabilityError = null
      })
      .addCase(getAvailability.fulfilled, (state, action: PayloadAction<AvailabilitySlot[]>) => {
        state.loadingAvailability = false
        state.availability = action.payload
      })
      .addCase(getAvailability.rejected, (state, action) => {
        state.loadingAvailability = false
        state.availability = []
        state.availabilityError =
          action.payload ?? action.error.message ?? 'No se pudo cargar la disponibilidad.'
      })

      .addCase(getLawyers.pending, (state) => {
        state.loadingLawyers = true
        state.lawyersError = null
      })
      .addCase(getLawyers.fulfilled, (state, action: PayloadAction<Lawyer[]>) => {
        state.loadingLawyers = false
        state.lawyers = action.payload
      })
      .addCase(getLawyers.rejected, (state, action) => {
        state.loadingLawyers = false
        state.lawyers = []
        state.lawyersError =
          action.payload ?? action.error.message ?? 'No se pudo cargar la lista de abogados.'
      })
  },
})

export const { reset, clearEntity, clearAvailability, clearUpdateSuccess } =
  consultationSlice.actions

export default consultationSlice.reducer
