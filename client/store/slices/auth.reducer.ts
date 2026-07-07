import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { loginRequest, registerRequest } from '@/services/authApi'
import { clearSession, writeSession } from '@/lib/sessionStorage'
import type {
  AuthCredentials,
  AuthSession,
  AuthUser,
  LoginResponse,
  RegisterResponse,
} from '@/types/auth'

export interface AuthState {
  loading: boolean
  updating: boolean
  updateSuccess: boolean
  registerSuccess: boolean
  errorMessage: string | null
  user: AuthUser | null
  session: AuthSession | null
}

const initialState: AuthState = {
  loading: false,
  updating: false,
  updateSuccess: false,
  registerSuccess: false,
  errorMessage: null,
  user: null,
  session: null,
}

function extractMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) return error.message
  return fallback
}

// export const loginUser = createAsyncThunk<
//   LoginResponse,
//   AuthCredentials,
//   { rejectValue: string }
// >('auth/login', async (credentials, thunkAPI) => {
//   try {
//     const { data } = await loginRequest(credentials)
//     writeSession({ user: data.user, session: data.session })
//     return data
//   } catch (err) {
//     return thunkAPI.rejectWithValue(extractMessage(err, 'Login failed'))
//   }
// })
export const loginUser = createAsyncThunk<
  LoginResponse,
  AuthCredentials,
  { rejectValue: string }
>('auth/login', async (credentials, thunkAPI) => {
  try {
    const { user, session } = await loginRequest(credentials)

    // Adaptar la respuesta del backend (LoginResponseDto) al formato LoginResponse
    const adapted: LoginResponse = {
      user: {
        id: user.id!,
        email: user.email!,
      },
      session: {
        accessToken: session.accessToken!,
        refreshToken: '', // si no lo tienes, pon vacío
        expiresAt: Date.now() + 3600 * 1000, // ejemplo: 1 hora
      },
    }

    writeSession(adapted)
    return adapted
  } catch (err) {
    return thunkAPI.rejectWithValue(extractMessage(err, 'Login failed'))
  }
})


export const registerUser = createAsyncThunk<
  RegisterResponse,
  AuthCredentials,
  { rejectValue: string }
>('auth/register', async (credentials, thunkAPI) => {
  try {
    const { user, requiresEmailConfirmation } = await registerRequest(credentials)
    return {
      user,
      requiresEmailConfirmation
    }
  } catch (err) {
    return thunkAPI.rejectWithValue(extractMessage(err, 'Register failed'))
  }
})

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.loading = false
      state.updating = false
      state.updateSuccess = false
      state.registerSuccess = false
      state.errorMessage = null
    },
    clearFeedback: (state) => {
      state.errorMessage = null
      state.registerSuccess = false
      state.updateSuccess = false
    },
    logout: (state) => {
      clearSession()
      state.user = null
      state.session = null
      state.updateSuccess = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.updating = true
        state.updateSuccess = false
        state.errorMessage = null
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
        state.updating = false
        state.updateSuccess = true
        state.user = action.payload.user
        state.session = action.payload.session
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.updating = false
        state.updateSuccess = false
        state.errorMessage = action.payload ?? action.error.message ?? 'Login failed'
      })
      .addCase(registerUser.pending, (state) => {
        state.updating = true
        state.registerSuccess = false
        state.errorMessage = null
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.updating = false
        state.registerSuccess = true
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.updating = false
        state.registerSuccess = false
        state.errorMessage = action.payload ?? action.error.message ?? 'Register failed'
      })
  },
})

export const { reset, clearFeedback, logout } = authSlice.actions
export default authSlice.reducer
