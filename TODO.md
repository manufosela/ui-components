# TODO - Revisión de Componentes

## Contexto

Repositorio de componentes UI basados en Web Components con Lit, pensados para usarse tanto con Lit como con JavaScript vanilla.
El objetivo es mejorar calidad, accesibilidad, consistencia y experiencia de uso, sin introducir frameworks adicionales.

---

## Checklist de Revisión por Componente

### 1. API pública del componente

- [ ] **Props / atributos públicos**
  - Nombre claro y consistente
  - Tipos correctos
  - Valores por defecto explícitos
  - Diferencia clara entre atributos HTML y propiedades JS

- [ ] **Eventos emitidos**
  - Nombre (kebab-case)
  - Cuándo se disparan
  - event.detail bien definido

- [ ] **Slots**
  - Slots nombrados correctamente
  - Fallbacks razonables
  - Casos de uso documentables

- [ ] **CSS Custom Properties**
  - Variables expuestas claramente
  - Evitar estilos "hardcodeados" que impidan tematizar

### 2. Accesibilidad (A11y)

- [ ] Navegación completa con teclado
- [ ] Gestión correcta del foco
  - Foco inicial
  - Foco al cerrar (si aplica)
- [ ] Roles ARIA correctos
- [ ] aria-* dinámicos (selected, expanded, checked...)
- [ ] Compatible con lectores de pantalla
- [ ] No romper el flujo de tabulación global
- [ ] Estados deshabilitado / error / readonly correctamente anunciados

> Para componentes complejos (modal, select, tabs, rating...): especificar qué patrón ARIA sigue (dialog, listbox, combobox, radiogroup...)

### 3. Responsabilidad única y arquitectura interna

- [ ] Cada método hace una sola cosa
- [ ] No hay lógica duplicada
- [ ] Separación clara entre:
  - Lógica
  - Render
  - Gestión de eventos
- [ ] Dependencias externas mínimas
- [ ] Posible inyección de dependencias si aplica
- [ ] No acoplar el componente a un entorno concreto (Lit-only)

### 4. Consistencia con el resto del sistema

- [ ] Naming consistente (props, eventos, slots)
- [ ] Patrón común de estados (active, selected, open, etc.)
- [ ] Mismo criterio para:
  - Atributos vs propiedades
  - Eventos de cambio
- [ ] Ejemplos compatibles con JavaScript vanilla (no solo Lit templates)

### 5. Experiencia de desarrollador (DX)

- [ ] Instalación clara
- [ ] Ejemplo mínimo funcional
- [ ] Ejemplo avanzado
- [ ] API autoexplicativa sin leer el código
- [ ] Errores silenciosos evitados (warnings claros en dev)

### 6. Performance y bundle

- [ ] Tamaño razonable del bundle
- [ ] No recalcular renders innecesarios
- [ ] Uso correcto de willUpdate, updated, shouldUpdate
- [ ] Evitar listeners globales innecesarios
- [ ] Limpieza correcta en disconnectedCallback

### 7. Testing

- [ ] Tests de render básico
- [ ] Tests de interacción
- [ ] Tests de teclado
- [ ] Tests de eventos emitidos
- [ ] Casos límite (sin props, valores inválidos)

### 8. Documentación

- [ ] Resumen del componente
- [ ] Props / atributos
- [ ] Eventos
- [ ] Slots
- [ ] CSS variables
- [ ] Ejemplos
- [ ] Notas de accesibilidad

---

## Estado de Revisión por Componente

| Componente | API | A11y | Arquitectura | Consistencia | DX | Performance | Tests | Docs |
|------------|-----|------|--------------|--------------|-----|-------------|-------|------|
| app-modal | | | | | | | | |
| arc-slider | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| behaviour-accordion | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| calendar-inline | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| circle-percent | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| circle-steps | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| click-clock | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| data-card | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| header-nav | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| historical-line | | | | | | | | |
| lcd-digit | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| loading-layer | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| marked-calendar | | | | | | | | |
| modal-dialog | | | | | | | | |
| multi-carousel | | | | | | | | |
| multi-select | | | | | | | | |
| nav-list | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| qr-code | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| radar-chart | | | | | | | | |
| rich-inputfile | | | | | | | | |
| rich-select | | | | | | | | |
| slide-notification | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| slider-underline | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| stars-rating | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| tab-nav | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| theme-toggle | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| toast-notification | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
