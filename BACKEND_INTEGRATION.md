# Backend Integration - Historia de Sesiones de Monitoreo

## Resumen

La aplicación ahora está integrada con el backend para gestionar las sesiones de monitoreo. Cada vez que un usuario finaliza una sesión, los datos se envían automáticamente al backend y se pueden consultar en el historial.

## Arquitectura

### 1. Modelos (`src/app/history/models/session.model.ts`)

Define las interfaces para la comunicación con el backend:

- **SessionCreateDto**: Datos enviados al backend al crear una sesión
- **SessionResponse**: Respuesta del backend con datos de la sesión
- **SessionSummary**: Modelo para mostrar en la lista de historial
- **SessionDetail**: Modelo detallado para la vista de detalles

### 2. History Service (`src/app/history/services/history.service.ts`)

Maneja todas las operaciones HTTP con el backend:

#### Endpoints utilizados:
- `GET /api/v1/monitoringSession` - Obtener todas las sesiones del usuario
- `GET /api/v1/monitoringSession/{id}` - Obtener detalles de una sesión específica
- `POST /api/v1/monitoringSession` - Crear una nueva sesión

#### Métodos principales:
- `listSessions()`: Obtiene lista de sesiones
- `getSession(id)`: Obtiene detalles de una sesión
- `createSession(data)`: Crea nueva sesión en el backend

### 3. Monitoring Session Service (`src/app/monitoring/services/monitoring-session.service.ts`)

Gestiona el estado de la sesión actual durante el monitoreo:

#### Características:
- Tracking en tiempo real de métricas
- Acumulación de tiempos (total, buena postura, mala postura, pausas)
- Contador de pausas
- Método `saveSession()` para enviar datos al backend

#### Datos rastreados:
```typescript
{
  totalMs: number;        // Tiempo total de monitoreo
  goodPostureMs: number;  // Tiempo en buena postura
  badPostureMs: number;   // Tiempo en mala postura
  pauseMs: number;        // Tiempo total en pausas
  pauseCount: number;     // Número de pausas tomadas
}
```

### 4. Monitoring Active Component

Integra el servicio de sesión:

#### Durante el monitoreo:
- Inicia sesión al montar el componente (`ngOnInit`)
- Actualiza métricas en tiempo real cada segundo
- Registra cada pausa y su duración
- Calcula automáticamente tiempo de buena/mala postura

#### Al finalizar sesión:
1. Calcula tiempo final de buena postura
2. Obtiene userId del AuthService
3. Envía datos al backend mediante `MonitoringSessionService.saveSession()`
4. Muestra notificación de éxito/error
5. Navega al historial

## Flujo de Datos

### Crear Sesión:
```
MonitoringActiveComponent 
  → Tracking en tiempo real
  → Actualiza MonitoringSessionService
  → Usuario presiona "Finish Session"
  → saveSession(userId)
  → POST /api/v1/monitoringSession
  → Navega a /history
```

### Ver Historial:
```
HistoryPageComponent
  → ngOnInit
  → HistoryService.listSessions()
  → GET /api/v1/monitoringSession
  → Muestra lista de sesiones
```

### Ver Detalles:
```
SessionPageComponent
  → ngOnInit con sessionId
  → HistoryService.getSession(id)
  → GET /api/v1/monitoringSession/{id}
  → Muestra detalles completos
```

## Formato de Datos

### Datos enviados al backend (POST /sessions):
```json
{
  "userId": "123",
  "totalMs": 5400000,
  "goodPostureMs": 4320000,
  "badPostureMs": 1080000,
  "pauseMs": 180000,
  "pauseCount": 3
}
```

### Respuesta del backend:
```json
{
  "id": 1,
  "userId": "123",
  "sessionDate": "2025-11-11T10:30:00Z",
  "totalMs": 5400000,
  "goodPostureMs": 4320000,
  "badPostureMs": 1080000,
  "pauseMs": 180000,
  "pauseCount": 3
}
```

## Configuración

### Environment variables (`src/environments/environment.ts`):
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api/v1'
};
```

### App Config (`src/app/app.config.ts`):
- `provideHttpClient()` ya está configurado
- Interceptors pueden añadirse aquí si es necesario

## Manejo de Errores

### HistoryService:
- Todos los métodos HTTP manejan errores mediante `subscribe({ error })`
- Los errores se registran en consola
- Se muestran notificaciones al usuario con `toast.error()`

### Estados de carga:
- `isLoading` signal en componentes de historial
- Mensajes de "Loading..." mientras se obtienen datos
- Mensajes de "No sessions found" cuando no hay datos

## Testing

Para probar la integración:

1. **Iniciar sesión de monitoreo**: `/monitoring/start`
2. **Monitorear durante un tiempo**: Observar tracking de métricas
3. **Tomar pausas**: Verificar que se registren correctamente
4. **Finalizar sesión**: Presionar "Finish Session"
5. **Verificar en historial**: Navegar a `/history` y ver la sesión
6. **Ver detalles**: Click en "Detail" para ver métricas completas

## Extensiones Futuras

### Posibles mejoras:
- [ ] Añadir paginación en lista de historial
- [ ] Filtros por fecha/duración
- [ ] Gráficos de tendencias
- [ ] Exportar datos a CSV/PDF
- [ ] Comparar sesiones
- [ ] Establecer metas de postura
- [ ] Notificaciones de logros

## Notas Importantes

1. **UserId**: Actualmente se usa el token del AuthService como userId. En producción, debería obtenerse del token JWT decodificado.

2. **Sincronización**: Los datos se envían al backend solo al finalizar la sesión. Si la app se cierra inesperadamente, los datos se pierden.

3. **Offline**: No hay soporte offline actualmente. Requiere conexión al backend.

4. **Autenticación**: Asegurarse de que el usuario esté autenticado antes de iniciar monitoreo.

## Troubleshooting

### Error: "User not authenticated"
- Verificar que el usuario haya hecho login
- Verificar que `AuthService.getToken()` retorne un valor válido

### Error: "Failed to save session"
- Verificar que el backend esté corriendo
- Verificar la URL en `environment.ts`
- Verificar la consola del navegador para más detalles
- Verificar que el endpoint POST /api/v1/monitoringSession esté disponible
- Verificar que los campos del DTO coincidan con lo esperado por el backend

### No se muestran sesiones en historial
- Verificar que el backend retorne datos en GET /api/v1/monitoringSession
- Verificar que el formato de respuesta coincida con `SessionResponse`
- Verificar la consola para errores de parsing
- Verificar que el userId sea correcto en las peticiones
