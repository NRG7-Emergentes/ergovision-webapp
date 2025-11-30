# Integración con Backend - MonitoringSession Endpoints

## Endpoints Requeridos

Basado en tu backend, estos son los endpoints que la aplicación usa:

### 1. Crear Sesión de Monitoreo
**POST** `/api/v1/monitoringSession`

**Request Body:**
```json
{
  "startDate": "2025-11-11T15:30:00Z",
  "endDate": "2025-11-11T17:30:00Z",
  "score": 75,
  "goodScore": 75,
  "badScore": 25,
  "goodPostureTime": 5400,
  "badPostureTime": 1800,
  "duration": 7200,
  "numberOfPauses": 3,
  "averagePauseDuration": 180
}
```

**Response Expected:**
```json
{
  "id": 1,
  "startDate": "2025-11-11T15:30:00Z",
  "endDate": "2025-11-11T17:30:00Z",
  "score": 75,
  "goodScore": 75,
  "badScore": 25,
  "goodPostureTime": 5400,
  "badPostureTime": 1800,
  "duration": 7200,
  "numberOfPauses": 3,
  "averagePauseDuration": 180
}
```

---

### 2. Obtener Todas las Sesiones
**GET** `/api/v1/monitoringSession`

**Query Params (opcional):**
- `userId` - Para filtrar por usuario específico

**Response Expected:**
```json
[
  {
    "id": 1,
    "startDate": "2025-11-11T15:30:00Z",
    "endDate": "2025-11-11T17:30:00Z",
    "score": 75,
    "goodScore": 75,
    "badScore": 25,
    "goodPostureTime": 5400,
    "badPostureTime": 1800,
    "duration": 7200,
    "numberOfPauses": 3,
    "averagePauseDuration": 180
  },
  {
    "id": 2,
    "startDate": "2025-11-10T10:15:00Z",
    "endDate": "2025-11-10T13:15:00Z",
    "score": 83,
    "goodScore": 83,
    "badScore": 17,
    "goodPostureTime": 9000,
    "badPostureTime": 1800,
    "duration": 10800,
    "numberOfPauses": 5,
    "averagePauseDuration": 240
  }
]
```

---

### 3. Obtener Sesión por ID
**GET** `/api/v1/monitoringSession/{id}`

**Response Expected:**
```json
{
  "id": 1,
  "startDate": "2025-11-11T15:30:00Z",
  "endDate": "2025-11-11T17:30:00Z",
  "score": 75,
  "goodScore": 75,
  "badScore": 25,
  "goodPostureTime": 5400,
  "badPostureTime": 1800,
  "duration": 7200,
  "numberOfPauses": 3,
  "averagePauseDuration": 180
}
```

---

## Configuración CORS en Backend

Para que funcione desde el frontend en `http://localhost:4200`, tu backend debe permitir peticiones CORS:

### Spring Boot Example:
```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:4200")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

### O con anotación en el Controller:
```java
@RestController
@RequestMapping("/api/v1/monitoringSession")
@CrossOrigin(origins = "http://localhost:4200")
public class MonitoringSessionController {
    
    @PostMapping
    public ResponseEntity<MonitoringSessionResponse> createSession(
        @RequestBody MonitoringSessionDto dto
    ) {
        // Tu lógica aquí
    }
    
    @GetMapping
    public ResponseEntity<List<MonitoringSessionResponse>> getAllSessions(
        @RequestParam(required = false) String userId
    ) {
        // Tu lógica aquí
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<MonitoringSessionResponse> getSessionById(
        @PathVariable Long id
    ) {
        // Tu lógica aquí
    }
}
```

---

## Ejemplo de DTO en Backend (Java)

```java
// Request DTO
public class MonitoringSessionDto {
    private String startDate;          // ISO 8601: "2025-11-11T15:30:00Z"
    private String endDate;            // ISO 8601: "2025-11-11T17:30:00Z"
    private Integer score;             // Overall score 0-100
    private Integer goodScore;         // Good posture score 0-100
    private Integer badScore;          // Bad posture score 0-100
    private Integer goodPostureTime;   // Time in seconds
    private Integer badPostureTime;    // Time in seconds
    private Integer duration;          // Total duration in seconds
    private Integer numberOfPauses;    // Count of pauses
    private Integer averagePauseDuration; // Average pause duration in seconds
    
    // Getters y Setters
}

// Response DTO
public class MonitoringSessionResponse {
    private Long id;
    private String startDate;
    private String endDate;
    private Integer score;
    private Integer goodScore;
    private Integer badScore;
    private Integer goodPostureTime;
    private Integer badPostureTime;
    private Integer duration;
    private Integer numberOfPauses;
    private Integer averagePauseDuration;
    
    // Getters y Setters
}
```

---

## Validación de Datos

El backend debería validar:

1. **startDate** - No nulo, formato ISO 8601
2. **endDate** - No nulo, formato ISO 8601, debe ser después de startDate
3. **score** - Entre 0 y 100
4. **goodScore** - Entre 0 y 100
5. **badScore** - Entre 0 y 100
6. **goodPostureTime** - Mayor o igual a 0 (en segundos)
7. **badPostureTime** - Mayor o igual a 0 (en segundos)
8. **duration** - Mayor que 0 (en segundos)
9. **numberOfPauses** - Mayor o igual a 0
10. **averagePauseDuration** - Mayor o igual a 0 (en segundos)

**Relaciones lógicas:**
- `goodPostureTime + badPostureTime ≤ duration`
- `goodScore + badScore = 100`
- `score` generalmente igual a `goodScore`
- Si `numberOfPauses > 0`, entonces `averagePauseDuration > 0`

---

## Testing de Endpoints

### 1. Test con cURL - Crear Sesión:
```bash
curl -X POST http://localhost:8080/api/v1/monitoringSession \
  -H "Content-Type: application/json" \
  -d '{
    "startDate": "2025-11-11T15:30:00Z",
    "endDate": "2025-11-11T17:30:00Z",
    "score": 75,
    "goodScore": 75,
    "badScore": 25,
    "goodPostureTime": 5400,
    "badPostureTime": 1800,
    "duration": 7200,
    "numberOfPauses": 3,
    "averagePauseDuration": 180
  }'
```

### 2. Test con cURL - Obtener Todas:
```bash
curl http://localhost:8080/api/v1/monitoringSession
```

### 3. Test con cURL - Obtener por ID:
```bash
curl http://localhost:8080/api/v1/monitoringSession/1
```

---

## Troubleshooting Backend

### Error: 404 Not Found
**Causa:** El endpoint no está mapeado correctamente
**Solución:** 
- Verifica que el `@RequestMapping` sea `/api/v1/monitoringSession`
- Verifica que el backend esté corriendo

### Error: 400 Bad Request
**Causa:** Los datos enviados no coinciden con el DTO esperado
**Solución:**
- Revisa los logs del backend para ver qué campo falta o es inválido
- Verifica que los tipos de datos coincidan (String, Long, Integer)
- Verifica que los nombres de campos coincidan exactamente

### Error: 500 Internal Server Error
**Causa:** Error en la lógica del backend o base de datos
**Solución:**
- Revisa los logs del backend
- Verifica la conexión a la base de datos
- Verifica que las entidades JPA estén configuradas correctamente

### Error: CORS
**Causa:** El backend no permite peticiones desde localhost:4200
**Solución:**
- Agrega la configuración CORS mencionada arriba
- Reinicia el backend después de agregar CORS

---

## Ejemplo de Entity JPA (Java)

```java
@Entity
@Table(name = "monitoring_sessions")
public class MonitoringSession {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private LocalDateTime startDate;
    
    @Column(nullable = false)
    private LocalDateTime endDate;
    
    @Column(nullable = false)
    private Integer score;
    
    @Column(nullable = false)
    private Integer goodScore;
    
    @Column(nullable = false)
    private Integer badScore;
    
    @Column(nullable = false)
    private Integer goodPostureTime;  // in seconds
    
    @Column(nullable = false)
    private Integer badPostureTime;   // in seconds
    
    @Column(nullable = false)
    private Integer duration;         // in seconds
    
    @Column(nullable = false)
    private Integer numberOfPauses;
    
    @Column(nullable = false)
    private Integer averagePauseDuration;  // in seconds
    
    // Getters y Setters
}
```

---

## Verificación Rápida

1. **Backend corriendo?**
   ```bash
   curl http://localhost:8080/api/v1/monitoringSession
   ```
   Debería retornar JSON (aunque sea array vacío `[]`)

2. **CORS configurado?**
   Desde la consola del navegador en `http://localhost:4200`:
   ```javascript
   fetch('http://localhost:8080/api/v1/monitoringSession')
     .then(r => r.json())
     .then(console.log)
     .catch(console.error)
   ```
   Si funciona → CORS OK
   Si error CORS → Falta configurar CORS

3. **POST funcionando?**
   ```javascript
   fetch('http://localhost:8080/api/v1/monitoringSession', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       startDate: new Date(Date.now() - 3600000).toISOString(),
       endDate: new Date().toISOString(),
       score: 80,
       goodScore: 80,
       badScore: 20,
       goodPostureTime: 2880,
       badPostureTime: 720,
       duration: 3600,
       numberOfPauses: 2,
       averagePauseDuration: 120
     })
   })
   .then(r => r.json())
   .then(console.log)
   .catch(console.error)
   ```

---

## Próximos Pasos

1. ✅ Verifica que tu backend tenga estos 3 endpoints implementados
2. ✅ Configura CORS en el backend
3. ✅ Prueba los endpoints con cURL o Postman
4. ✅ Inicia sesión en el frontend
5. ✅ Realiza una sesión de monitoreo
6. ✅ Presiona "Finish Session" y revisa la consola

Si todo está bien configurado, verás:
```
✅ Session saved successfully: { id: 1, userId: "123", ... }
```

Y la sesión aparecerá en el historial.
