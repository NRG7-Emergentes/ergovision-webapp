# Troubleshooting: ¿Por qué no se guardó mi sesión de monitoreo?

## Causas Posibles y Soluciones

### 1. ❌ Usuario No Autenticado

**Síntoma:** Al presionar "Finish Session", ves el mensaje: "User not authenticated. Session data will be lost."

**Causa:** No has iniciado sesión en la aplicación.

**Solución:**
1. Ve a `/sign-in` o `/sign-up`
2. Inicia sesión o crea una cuenta
3. Regresa a `/monitoring/start` e inicia una nueva sesión

**Verificación en Consola:**
```
=== FINISH SESSION DEBUG ===
User ID: null
Is authenticated: false
❌ User not authenticated - cannot save session
```

---

### 2. 🔌 Backend No Está Corriendo

**Síntoma:** Mensaje de error: "Cannot connect to backend. Is the server running?"

**Causa:** El backend en `http://localhost:8080` no está activo.

**Solución:**
1. Abre una terminal en el directorio del backend
2. Ejecuta el comando para iniciar el servidor (ej: `npm start`, `java -jar app.jar`, etc.)
3. Verifica que esté corriendo en el puerto 8080
4. Intenta nuevamente

**Verificación en Consola:**
```
=== FINISH SESSION DEBUG ===
User ID: "123"
Session data to save: { totalMs: 60000, ... }
Attempting to save session to backend...
❌ Error saving session: HttpErrorResponse
Error details: {
  status: 0,
  statusText: "Unknown Error",
  message: "Http failure response for http://localhost:8080/api/v1/sessions: 0 Unknown Error"
}
```

---

### 3. 🚫 Endpoint No Existe (404)

**Síntoma:** Mensaje de error: "Session endpoint not found. Check backend configuration."

**Causa:** El backend está corriendo pero no tiene el endpoint `/api/v1/sessions`

**Solución:**
1. Verifica que el backend tenga implementado el endpoint POST `/api/v1/sessions`
2. Verifica la URL base en `src/environments/environment.ts`
3. Asegúrate de que la ruta del endpoint coincida exactamente

**Verificación en Consola:**
```
❌ Error saving session: HttpErrorResponse
Error details: {
  status: 404,
  statusText: "Not Found",
  url: "http://localhost:8080/api/v1/sessions"
}
```

---

### 4. 🔒 Error de CORS

**Síntoma:** Error en consola sobre CORS policy

**Causa:** El backend no permite peticiones desde `http://localhost:4200`

**Solución (Backend):**
```java
// Spring Boot
@CrossOrigin(origins = "http://localhost:4200")

// O configuración global
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:4200")
                .allowedMethods("GET", "POST", "PUT", "DELETE");
    }
}
```

**Verificación en Consola:**
```
Access to XMLHttpRequest at 'http://localhost:8080/api/v1/sessions' 
from origin 'http://localhost:4200' has been blocked by CORS policy
```

---

### 5. 💥 Error del Servidor (500)

**Síntoma:** Mensaje de error: "Server error. Please contact support."

**Causa:** El backend tiene un error interno al procesar la petición

**Solución:**
1. Revisa los logs del backend
2. Verifica que el endpoint acepte el formato correcto de datos
3. Verifica que la base de datos esté disponible
4. Revisa que los campos requeridos estén siendo enviados

**Formato esperado por el backend:**
```json
{
  "userId": "123",
  "totalMs": 60000,
  "goodPostureMs": 45000,
  "badPostureMs": 15000,
  "pauseMs": 10000,
  "pauseCount": 2
}
```

---

### 6. 🌐 URL del Backend Incorrecta

**Síntoma:** Error 404 o timeout

**Causa:** La URL en `environment.ts` no coincide con el backend

**Solución:**
Edita `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api/v1'  // ← Verifica que esta URL sea correcta
};
```

Posibles variaciones:
- `http://localhost:3000/api/v1`
- `http://localhost:8000/api`
- `https://api.miapp.com/v1`

---

## Cómo Verificar el Problema

### Paso 1: Abre la Consola del Navegador
1. Presiona `F12` en el navegador
2. Ve a la pestaña "Console"
3. Realiza una sesión de monitoreo
4. Presiona "Finish Session"
5. Lee los mensajes que aparecen

### Paso 2: Revisa la Pestaña Network
1. En DevTools, ve a la pestaña "Network"
2. Filtra por "Fetch/XHR"
3. Presiona "Finish Session"
4. Busca la petición POST a `/sessions`
5. Haz click para ver:
   - **Request Headers**: verifica el Content-Type
   - **Request Payload**: verifica los datos enviados
   - **Response**: verifica el error retornado

### Paso 3: Verifica la Autenticación
```javascript
// En la consola del navegador, ejecuta:
localStorage.getItem('auth_token')

// Si retorna null, no estás autenticado
// Si retorna un número de 3 dígitos, estás autenticado
```

---

## Solución Rápida: Modo Debug

Para ver todos los logs detallados, abre la consola antes de finalizar la sesión. Verás:

```
=== FINISH SESSION DEBUG ===
User ID: "123"
Is authenticated: true
Session data to save: {
  userId: "123",
  totalMs: 120000,
  goodPostureMs: 90000,
  badPostureMs: 30000,
  pauseMs: 15000,
  pauseCount: 2
}
Attempting to save session to backend...
✅ Session saved successfully: { id: 1, userId: "123", ... }
```

O en caso de error:
```
❌ Error saving session: HttpErrorResponse
Error details: {
  status: 0,
  statusText: "Unknown Error",
  message: "Http failure response ...",
  url: "http://localhost:8080/api/v1/sessions"
}
Cannot connect to backend. Is the server running?
```

---

## Checklist de Verificación

Antes de iniciar una sesión, verifica:

- [ ] ✅ Estoy autenticado (hice login)
- [ ] ✅ El backend está corriendo
- [ ] ✅ El backend está en el puerto correcto (8080)
- [ ] ✅ El endpoint POST `/api/v1/sessions` existe
- [ ] ✅ CORS está configurado en el backend
- [ ] ✅ La URL en `environment.ts` es correcta
- [ ] ✅ Puedo hacer peticiones GET a `/api/v1/sessions` (verificar en Network tab)

---

## Alternativa: Guardar Localmente

Si el backend no está disponible, puedes modificar temporalmente el código para guardar en localStorage:

```typescript
// En monitoring-session.service.ts
saveSessionLocally(userId: string): void {
  const data = this.sessionData();
  const sessions = JSON.parse(localStorage.getItem('local_sessions') || '[]');
  
  sessions.push({
    id: Date.now(),
    userId,
    sessionDate: new Date().toISOString(),
    ...data
  });
  
  localStorage.setItem('local_sessions', JSON.stringify(sessions));
  console.log('Session saved locally:', sessions);
}
```

**Nota:** Esto es solo temporal. Los datos se perderán si limpias el navegador.

---

## Contacto de Soporte

Si ninguna de estas soluciones funciona:

1. Copia todos los mensajes de la consola
2. Copia la información de la pestaña Network
3. Indica qué mensaje de error viste exactamente
4. Envía la información al equipo de desarrollo

**Información útil para reportar:**
- Versión del navegador
- Sistema operativo
- Hora exacta del error
- Duración de la sesión que intentaste guardar
- Si estabas autenticado o no
