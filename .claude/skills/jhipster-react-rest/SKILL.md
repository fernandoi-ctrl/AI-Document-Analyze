---
name: jhipster-react-rest
description: Patrón JHipster para cualquier interacción con servicios REST desde React usando Redux Toolkit (createAsyncThunk, createSlice). Se aplica a toda llamada a backend: GET, POST, PUT, DELETE, acciones personalizadas.
---

# JHipster React REST Integration Skill

Eres un experto en la integración de frontend React con APIs REST siguiendo las mejores prácticas de JHipster. Cada vez que necesites **interactuar con un servicio del backend** (listar, crear, actualizar, eliminar o cualquier acción personalizada), debes aplicar este patrón.

## Ámbito de aplicación

Este skill se activa automáticamente cuando el código implica:

- Llamadas a cualquier endpoint REST (ej. `/api/...`).
- Creación de thunks con `createAsyncThunk`.
- Definición de slices con `createSlice` y `extraReducers`.
- Manejo de estados asíncronos (`loading`, `updating`, `error`, `success`).

## Patrón estándar para cada entidad

### 1. Crear los thunks (createAsyncThunk)

Cada operación REST recibe su propio thunk. Nombres estándar:

| Operación      | Nombre del thunk     | Método | Endpoint                               | Dispara después |
|----------------|----------------------|--------|----------------------------------------|-----------------|
| Obtener lista  | `getEntities`        | GET    | `/api/entities?page=&size=&sort=`      | –               |
| Obtener uno    | `getEntity`          | GET    | `/api/entities/:id`                    | –               |
| Crear          | `createEntity`       | POST   | `/api/entities`                        | `getEntities`   |
| Actualizar     | `updateEntity`       | PUT    | `/api/entities/:id`                    | `getEntities`   |
| Eliminar       | `deleteEntity`       | DELETE | `/api/entities/:id`                    | `getEntities`   |
| Acción custom  | `<verb>Entity`       | (cualquiera) | `/api/entities/:id/<action>`       | `getEntities`   |

**Regla inquebrantable:** Después de cualquier mutación (`create`, `update`, `delete`, acción custom) se debe **disparar `getEntities`** para refrescar la lista.

#### Ejemplo de thunk de mutación con refresh

```typescript
export const completeEntity = createAsyncThunk(
  'task/complete_entity',
  async (id: string | number, thunkAPI) => {
    const requestUrl = `${apiUrl}/${id}/complete`;
    const result = await axios.put<ITask>(requestUrl);
    thunkAPI.dispatch(getEntities({}));   // ← refresh obligatorio
    return result;
  }
);
Ejemplo de thunk con paginación/filtros
typescript
export const getEntities = createAsyncThunk(
  'task/fetch_entity_list',
  async ({ page, size, sort, completed }: { page?: number; size?: number; sort?: string; completed?: boolean }) => {
    const params = new URLSearchParams();
    if (page !== undefined) params.append('page', String(page));
    if (size !== undefined) params.append('size', String(size));
    if (sort) params.append('sort', sort);
    if (completed !== undefined) params.append('completed', String(completed));
    const requestUrl = `${apiUrl}?${params.toString()}`;
    return axios.get<ITask[]>(requestUrl);
  }
);
2. Definir el estado inicial (EntityState)
typescript
interface EntityState<T> {
  loading: boolean;        // true durante GETs
  errorMessage: string | null;
  entities: T[];           // lista obtenida
  entity: T;               // elemento individual
  links: { next: number }; // paginación
  updating: boolean;       // true durante mutaciones
  totalItems: number;      // total para paginación
  updateSuccess: boolean;  // true tras mutación exitosa
}
3. Crear el slice con createSlice (nunca createEntitySlice)
typescript
export const EntitySlice = createSlice({
  name: 'entity',
  initialState,
  reducers: {
    reset: (state) => {
      state.loading = false;
      state.updating = false;
      state.updateSuccess = false;
      state.errorMessage = null;
      state.entity = defaultValue;
    },
  },
  extraReducers: (builder) => {
    builder
      // ===== getEntities =====
      .addCase(getEntities.pending, (state) => { state.loading = true; })
      .addCase(getEntities.fulfilled, (state, action) => {
        state.loading = false;
        state.entities = action.payload.data;
        state.totalItems = parseInt(action.payload.headers['x-total-count'], 10);
      })
      .addCase(getEntities.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.error.message;
      })
      // ===== createEntity / updateEntity / deleteEntity / custom =====
      .addCase(createEntity.pending, (state) => { state.updating = true; })
      .addCase(createEntity.fulfilled, (state) => {
        state.updating = false;
        state.updateSuccess = true;
        state.entity = defaultValue;
      })
      .addCase(createEntity.rejected, (state, action) => {
        state.updating = false;
        state.updateSuccess = false;
        state.errorMessage = action.error.message;
      })
      // ... repetir para update, delete, custom
  }
});
4. Integración en el store global
En app/shared/reducers/index.ts:

typescript
import entity from 'app/entities/entity/entity.reducer';
const rootReducer = combineReducers({ entity, ...otros });
5. Uso en componentes React
tsx
const dispatch = useDispatch();
const { entities, loading, totalItems } = useSelector((state: IRootState) => state.entity);

useEffect(() => {
  dispatch(getEntities({ page: 0, size: 20, sort: 'id,asc' }));
}, []);

const handleCreate = (data) => dispatch(createEntity(data));
const handleComplete = (id) => dispatch(completeEntity(id));
Excepciones y consideraciones
Si la mutación no requiere refrescar la lista (ej. marcar como favorito sin afectar el listado actual), se puede omitir dispatch(getEntities), pero debe documentarse con un comentario.

Para operaciones que no son CRUD (ej. subir archivo, exportar datos), los thunks deben seguir el patrón de manejo de loading/errorMessage, pero sin necesidad de getEntities al final.

Siempre usar axios (no fetch directamente) para mantener consistencia con JHipster.

Activación del skill
Este skill se aplica automáticamente cuando el código realiza cualquier llamada HTTP a un backend REST, especialmente si se usa Redux Toolkit. Si estás trabajando en un archivo que contiene createAsyncThunk, axios.get/post/put/delete, o defines un slice, debes seguir estas reglas.