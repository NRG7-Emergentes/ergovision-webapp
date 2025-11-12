# Guía de Debug - Integración Backend

## Pasos para Identificar el Problema

### 1. Verificar que el Backend está Corriendo

**Abrir terminal y ejecutar:**
```bash
curl http://localhost:8080/api/v1/monitoringSession
```

**Resultado esperado:**
- ✅ Si retorna `[]` (array vacío) → Backend funciona, no hay sesiones guardadas
- ✅ Si retorna un array con datos → Backend funciona y hay sesiones
- ❌ Si da error "Connection refused" → Backend NO está corriendo
- ❌ Si da 404 → Endpoint no existe en el backend

---

### 2. Verificar en el Navegador (F12)

#### A. Pestaña Network
1. Abre DevTools (F12)
2. Ve a la pestaña **Network**
3. Filtra por **Fetch/XHR**
4. Realiza las siguientes acciones:

**Acción 1: Ir a Historial (`/history`)**
- Deberías ver una petición: `GET http://localhost:8080/api/v1/monitoringSession`
- Click en la petición para ver:
  - **Status**: ¿Es 200 OK?
  - **Response**: ¿Qué datos retorna?
  - **Headers**: ¿Tiene CORS habilitado?

**Acción 2: Finish Session**
- Deberías ver una petición: `POST http://localhost:8080/api/v1/monitoringSession`
- Click en la petición para ver:
  - **Status**: ¿Es 200 o 201?
  - **Request Payload**: ¿Qué datos se enviaron?
  - **Response**: ¿Qué retornó el backend?

#### B. Pestaña Console
- Verás logs detallados de cada operación
- Busca mensajes que empiecen con:
  - `[HistoryService]`
  - `=== FINISH SESSION DEBUG ===`
  - `=== HISTORY PAGE - Loading Sessions ===`

---

### 3. Logs Esperados

#### Al hacer "Finish Session":

```
=== FINISH SESSION DEBUG ===
User ID: "123"
Is authenticated: true
Session data to save: {
  startDate: Date,
  duration: 60,
  goodPostureTime: 45,
  badPostureTime: 15,
  numberOfPauses: 1,
  totalPauseTime: 10
}
Session DTO to send: {
  startDate: "2025-11-11T15:30:00.000Z",
  endDate: "2025-11-11T15:31:00.000Z",
  score: 75,
  goodScore: 75,
  badScore: 25,
  goodPostureTime: 45,
  badPostureTime: 15,
  duration: 60,
  numberOfPauses: 1,
  averagePauseDuration: 10
}
[HistoryService] POST request to: http://localhost:8080/api/v1/monitoringSession
[HistoryService] Request body: {...}
✅ Session saved successfully: { id: 1, ... }
```

#### Al ir a Historial:

```
=== HISTORY PAGE - Loading Sessions ===
Making GET request to fetch sessions...
[HistoryService] GET request to: http://localhost:8080/api/v1/monitoringSession
[HistoryService] Raw response from backend: [...]
[HistoryService] Mapped sessions: [...]
✅ Sessions loaded successfully: [...]
```

---

### 4. Errores Comunes y Soluciones

#### Error 1: "Cannot connect to backend"
**Síntoma en Console:**
```
❌ Error loading sessions: HttpErrorResponse
Error details: { status: 0, statusText: "Unknown Error", ... }
```

**Causa:** Backend no está corriendo

**Solución:**
1. Inicia el backend
2. Verifica que esté en puerto 8080
3. Prueba: `curl http://localhost:8080/api/v1/monitoringSession`

---

#### Error 2: "404 Not Found"
**Síntoma en Console:**
```
❌ Error loading sessions: HttpErrorResponse
Error details: { status: 404, statusText: "Not Found", ... }
```

**Causa:** El endpoint no existe en el backend

**Solución:**
1. Verifica que el backend tenga el endpoint `/api/v1/monitoringSession`
2. Verifica que acepte GET y POST
3. Revisa los logs del backend

---

#### Error 3: CORS
**Síntoma en Console:**
```
Access to XMLHttpRequest at 'http://localhost:8080/api/v1/monitoringSession' 
from origin 'http://localhost:4200' has been blocked by CORS policy
```

**Causa:** El backend no permite peticiones desde localhost:4200

**Solución:**
Agrega configuración CORS en el backend:
```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:4200")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*");
    }
}
```

---

#### Error 4: "No sessions found" pero sí hay sesiones
**Síntoma:** 
- GET retorna datos pero frontend muestra "No sessions found"

**Causa:** Los datos del backend no coinciden con la estructura esperada

**Solución:**
1. Ve a Console y busca: `[HistoryService] Raw response from backend:`
2. Compara con la estructura esperada:
```json
{
  "id": 1,
  "startDate": "2025-11-11T15:30:00Z",
  "endDate": "2025-11-11T15:31:00Z",
  "score": 75,
  "goodScore": 75,
  "badScore": 25,
  "goodPostureTime": 60,
  "badPostureTime": 20,
  "duration": 80,
  "numberOfPauses": 2,
  "averagePauseDuration": 30
}
```
3. Si los campos son diferentes, avísame para ajustar el mapeo

---

#### Error 5: POST funciona pero no se ve en historial
**Síntoma:**
- POST retorna 200/201
- GET retorna array vacío `[]`

**Causa:** La sesión se guardó pero el GET no la está retornando

**Solución:**
1. Verifica en la base de datos si la sesión se guardó
2. Verifica que el endpoint GET retorne todas las sesiones
3. Si el backend filtra por userId, asegúrate de que esté configurado correctamente

---

### 5. Test Manual Completo

#### Paso 1: Limpiar
```bash
# Limpia localStorage
localStorage.clear()

# O desde Console del navegador:
# > localStorage.clear()
```

#### Paso 2: Backend
```bash
# Verifica que el backend esté corriendo
curl http://localhost:8080/api/v1/monitoringSession

# Debería retornar 200 y [] o [...]
```

#### Paso 3: Frontend
1. Abre `http://localhost:4200`
2. Abre DevTools (F12) → Console
3. Limpia la consola
4. Ve a `/monitoring/start`
5. Espera 30 segundos
6. Presiona "Finish Session"
7. **ESPERA** a ver los logs en consola
8. Ve a `/history`
9. **VERIFICA** los logs en consola

#### Paso 4: Analiza los Logs
- ¿Qué dice la consola?
- ¿Qué muestra la pestaña Network?
- ¿Hay errores en rojo?
- ¿Las peticiones se están haciendo?

---

### 6. Checklist de Verificación

Marca cada ítem cuando lo verifiques:

**Backend:**
- [ ] Backend está corriendo
- [ ] Endpoint GET `/api/v1/monitoringSession` existe
- [ ] Endpoint POST `/api/v1/monitoringSession` existe
- [ ] CORS está configurado para localhost:4200
- [ ] Base de datos está conectada

**Frontend:**
- [ ] `npm start` está corriendo
- [ ] No hay errores de compilación
- [ ] DevTools abierto (F12)
- [ ] Console limpia antes de probar

**Network Tab:**
- [ ] GET se dispara al ir a `/history`
- [ ] POST se dispara al hacer "Finish Session"
- [ ] Ambas peticiones retornan 200/201
- [ ] No hay errores de CORS

**Console:**
- [ ] Logs de `[HistoryService]` aparecen
- [ ] Logs de `=== FINISH SESSION DEBUG ===` aparecen
- [ ] No hay errores en rojo
- [ ] Los datos del backend se muestran correctamente

---

### 7. Información para Reportar

Si después de todo esto sigue sin funcionar, copia y pégame:

1. **Logs completos de la consola** (desde que abres hasta que falla)
2. **Screenshot de la pestaña Network** mostrando las peticiones
3. **Respuesta del backend** (lo que retorna el GET y el POST)
4. **Versión del backend** y tecnología (Java Spring Boot, Node.js, etc.)
5. **Mensaje de error exacto** que aparece

---

## Comandos Rápidos de Debug

### En la Console del Navegador:

```javascript
// 1. Verificar URL del backend
fetch('http://localhost:8080/api/v1/monitoringSession')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)

// 2. Crear sesión de prueba
fetch('http://localhost:8080/api/v1/monitoringSession', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    startDate: new Date(Date.now() - 60000).toISOString(),
    endDate: new Date().toISOString(),
    score: 80,
    goodScore: 80,
    badScore: 20,
    goodPostureTime: 48,
    badPostureTime: 12,
    duration: 60,
    numberOfPauses: 1,
    averagePauseDuration: 10
  })
})
.then(r => r.json())
.then(data => {
  console.log('✅ Sesión creada:', data);
  alert('Sesión creada con ID: ' + data.id);
})
.catch(err => {
  console.error('❌ Error:', err);
  alert('Error: ' + err.message);
})

// 3. Verificar localStorage
console.log('Auth token:', localStorage.getItem('auth_token'));
```

---

## Resumen de URLs

- **Frontend**: `http://localhost:4200`
- **Backend**: `http://localhost:8080`
- **Endpoint GET**: `http://localhost:8080/api/v1/monitoringSession`
- **Endpoint POST**: `http://localhost:8080/api/v1/monitoringSession`
- **Endpoint GET by ID**: `http://localhost:8080/api/v1/monitoringSession/{id}`

---

Sigue estos pasos y comparte conmigo los resultados para poder ayudarte mejor.
