# Plan: Migrar Demos a Storybook

## Resumen Ejecutivo

**Estado actual de Storybook + Lit (Enero 2026):**
- Storybook 8.x soporta **Lit 3** oficialmente via `@storybook/web-components`
- El paquete `@storybook/lit` es **experimental** y no recomendado
- La integración ha mejorado significativamente desde Storybook 7.5

## Evaluación

### Ventajas de Storybook

| Beneficio | Descripción |
|-----------|-------------|
| **Documentación automática** | Genera docs desde JSDoc y Custom Elements Manifest |
| **Controls interactivos** | UI para modificar props en tiempo real |
| **Catálogo unificado** | Todos los componentes en un solo lugar |
| **Testing visual** | Integración con Chromatic para regression testing |
| **Addons** | A11y, viewport, backgrounds, etc. |
| **Estándar de industria** | Familiar para muchos desarrolladores |

### Desventajas / Riesgos

| Riesgo | Descripción |
|--------|-------------|
| **Complejidad de setup** | Configuración inicial puede ser compleja |
| **Dependencias adicionales** | Añade ~50+ dependencias al proyecto |
| **Build time** | Aumenta tiempo de CI |
| **Mantenimiento** | Otra herramienta que mantener actualizada |
| **GitHub Pages** | Requiere build step (no es HTML estático) |

### Comparativa: Demos Actuales vs Storybook

| Aspecto | Demos Actuales | Storybook |
|---------|----------------|-----------|
| **Setup** | Cero config | Requiere configuración |
| **Dependencias** | Ninguna (CDN) | ~50+ paquetes |
| **GitHub Pages** | HTML estático | Requiere build |
| **Interactividad** | Manual (JS) | Controls automáticos |
| **Documentación** | README separado | Integrada con docs |
| **Mantenimiento** | Bajo | Medio-alto |
| **DX para contribuidores** | Simple | Más profesional |

## Recomendación

### Opción A: Mantener demos actuales (Recomendado para proyectos pequeños)
- Las demos actuales funcionan bien
- Cero dependencias adicionales
- Ideal para 27 componentes

### Opción B: Añadir Storybook (Recomendado si el proyecto crece)
- Implementar cuando haya >50 componentes
- O cuando haya múltiples contribuidores
- O cuando se necesite testing visual automatizado

### Opción C: Híbrido
- Mantener demos simples para GitHub Pages
- Añadir Storybook solo para desarrollo local
- Mejor de ambos mundos, pero más mantenimiento

## Plan de Implementación (si se decide Opción B)

### Fase 1: Setup inicial
```bash
npx storybook@latest init --type web_components
```

### Fase 2: Configuración
1. Configurar `main.js` para Lit
2. Añadir Custom Elements Manifest (`@custom-elements-manifest/analyzer`)
3. Configurar autodocs

### Fase 3: Migrar stories
1. Crear template base para stories
2. Migrar componente por componente
3. Añadir controles e interacciones

### Fase 4: CI/CD
1. Build de Storybook en CI
2. Deploy a GitHub Pages (rama separada o subdirectorio)
3. Opcional: Integrar Chromatic para visual testing

## Dependencias requeridas

```json
{
  "devDependencies": {
    "@storybook/web-components": "^8.x",
    "@storybook/web-components-vite": "^8.x",
    "@storybook/addon-essentials": "^8.x",
    "@storybook/addon-a11y": "^8.x",
    "@custom-elements-manifest/analyzer": "^0.x",
    "storybook": "^8.x"
  }
}
```

## Estimación de esfuerzo

| Tarea | Esfuerzo |
|-------|----------|
| Setup inicial | 2-4 horas |
| Configuración CEM | 1-2 horas |
| Migrar 27 componentes | 1-2 días |
| CI/CD setup | 2-4 horas |
| **Total** | **2-3 días** |

## Decisión

**Pregunta clave**: ¿Qué problema resuelve Storybook que las demos actuales no resuelven?

- Si la respuesta es "documentación interactiva y testing visual" → Considerar Storybook
- Si la respuesta es "nada urgente" → Mantener demos actuales

---

## Referencias

- [Storybook 8 Announcement](https://storybook.js.org/blog/storybook-8/)
- [Install Storybook](https://storybook.js.org/docs/get-started/install)
- [Documenting Web Components With Storybook](https://jamesiv.es/blog/frontend/javascript/2025/02/19/documenting-web-components-with-storybook)
- [Web Component Library with Lit](https://medium.com/@yazed.jamal/web-component-library-with-lit-6b7153eb3e96)
