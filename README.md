# Agenda de Citas (Voz + Calendario)

Aplicación web para agendar citas médicas/manuales con dos flujos:
- formulario tradicional
- creación por voz con interpretación de lenguaje natural

## Dependencias usadas

### Core
- `next` + `react` + `react-dom`: framework y renderizado.
- `typescript`: tipado estático.
- `tailwindcss`: estilos utilitarios.

### Formularios y validación
- `react-hook-form`: manejo de estado y control de formularios.
- `yup`: esquema de validación.
- `@hookform/resolvers`: integración `react-hook-form` + `yup`.

### Fechas, calendario y parsing de lenguaje
- `date-fns`: formato y operaciones de fecha/hora.
- `react-big-calendar`: vista de calendario semanal.
- `chrono-node`: extracción de fecha/hora desde texto libre en español.

### UI
- `lucide-react`: iconografía.

## Decisiones de UX

- Flujo de voz en 2 pasos: grabar y luego confirmar antes de guardar.
- Vista de confirmación editable: paciente, fecha, hora, duración y servicio se pueden ajustar sin repetir todo el dictado.
- Manejo de ambigüedades:
  - Si el sistema detecta incertidumbre (ej. hora AM/PM o paciente no reconocido), muestra opciones concretas para resolverla.
- Reintento rápido: botón para volver a grabar en un clic.


## Decisiones técnicas

- Arquitectura separada por responsabilidades:
  - Hook de voz: `useVoiceRecognition`.
  - Parsing de texto: `appoinmentParser`.
  - UI de confirmación/edición: `VoiceAppointmentModal`.
- Resolución de conflictos de agenda:
  - se revisa `localStorage` para detectar citas en la misma hora,
  - se sugiere próxima fecha disponible cuando aplica.
- Persistencia local:
  - almacenamiento en `localStorage`
- Fechas en hora local:
  - se normaliza el manejo de `YYYY-MM-DD` sin depender de conversiones UTC para evitar desfases de día.


## Instalación y ejecución

### 1. Clonar repositorio

```bash
git clone https://github.com/pruiz5514/Docguia.git
cd doc_guia
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Ejecutar en desarrollo

```bash
npm run dev
```

Abrir en navegador:

```bash
http://localhost:3000
```

