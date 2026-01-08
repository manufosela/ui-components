# Plan: Playground Interactivo con API Viewer Element

## Resumen

Implementar un playground interactivo para cada componente usando `api-viewer-element` de [open-wc](https://github.com/open-wc/api-viewer-element).

### Funcionalidades

| Feature | Descripcion |
|---------|-------------|
| **Knobs** | Controles para modificar atributos en tiempo real |
| **CSS Variables** | Panel para ajustar custom properties |
| **Vista previa** | Renderiza el componente con los cambios |
| **Codigo copiable** | Muestra el HTML resultante actualizado |
| **Eventos** | Log de eventos disparados por el componente |
| **Slots** | Editor para contenido de slots |

## Arquitectura

```
packages/{component}/
├── src/
│   └── {component}.js          # Componente (ya existe)
├── demo/
│   ├── index.html              # Demo tradicional (ya existe)
│   └── playground.html         # NUEVO: Playground interactivo
└── custom-elements.json        # NUEVO: Manifest generado
```

### Flujo de datos

```
JSDoc en codigo  -->  CEM Analyzer  -->  custom-elements.json  -->  api-viewer-element
     |                                          |                          |
   @attr                                   properties                   Knobs UI
   @cssprop                               cssProperties               Styles UI
   @slot                                     slots                    Slots UI
   @fires                                   events                   Events log
```

## Dependencias

```json
{
  "devDependencies": {
    "@custom-elements-manifest/analyzer": "^0.10.3"
  }
}
```

**Nota**: `api-viewer-element` se carga via CDN (esm.sh), no requiere instalacion.

## Implementacion

### Fase 1: Configurar CEM Analyzer

**1.1. Instalar dependencia**

```bash
pnpm add -D @custom-elements-manifest/analyzer
```

**1.2. Crear configuracion en la raiz**

```javascript
// custom-elements-manifest.config.mjs
export default {
  globs: ['packages/*/src/*.js'],
  exclude: ['**/*.styles.js', '**/*.test.js'],
  litelement: true,
  outdir: './',
};
```

**1.3. Añadir script en package.json raiz**

```json
{
  "scripts": {
    "cem": "cem analyze",
    "cem:watch": "cem analyze --watch"
  }
}
```

### Fase 2: Mejorar JSDoc (si es necesario)

Los JSDoc actuales ya son buenos. Verificar que cada componente tenga:

```javascript
/**
 * Descripcion del componente.
 *
 * @element my-component
 *
 * @attr {String} name - Descripcion
 * @attr {Number} count - Descripcion (default: 0)
 * @attr {Boolean} disabled - Si esta deshabilitado
 *
 * @cssprop [--my-color=#000] - Color principal
 * @cssprop [--my-size=16px] - Tamano base
 *
 * @fires my-event - Descripcion del evento
 *
 * @slot - Contenido principal
 * @slot header - Contenido del header
 */
```

### Fase 3: Crear template de playground

**3.1. Template base para cada componente**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{Component} - Playground</title>
  <script type="importmap">
    {
      "imports": {
        "lit": "https://esm.sh/lit@3",
        "lit/": "https://esm.sh/lit@3/",
        "api-viewer-element": "https://esm.sh/api-viewer-element"
      }
    }
  </script>
  <style>
    :root {
      --bg-color: #f5f5f7;
      --card-bg: #ffffff;
      --text-color: #1d1d1f;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: var(--bg-color);
      margin: 0;
      padding: 2rem;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
    }
    header {
      margin-bottom: 2rem;
    }
    h1 { color: var(--text-color); margin: 0 0 0.5rem; }
    .subtitle { color: #86868b; margin: 0 0 1rem; }
    a { color: #3b82f6; }
    .nav-links {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }
    api-demo {
      display: block;
      background: var(--card-bg);
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      overflow: hidden;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>{Component Name}</h1>
      <p class="subtitle">Playground interactivo</p>
      <div class="nav-links">
        <a href="index.html">&larr; Demo tradicional</a>
        <a href="../../../">Todos los componentes</a>
        <a href="https://github.com/manufosela/ui-components/tree/main/packages/{component}" target="_blank">GitHub</a>
      </div>
    </header>

    <api-demo src="../custom-elements.json" only="{component-tag}"></api-demo>
  </div>

  <script type="module">
    import 'api-viewer-element';
    import '../src/{component}.js';
  </script>
</body>
</html>
```

### Fase 4: Generar manifests individuales

Opcion A: Un manifest global (mas simple)
```bash
npx cem analyze --litelement --globs "packages/*/src/*.js" --exclude "**/*.styles.js"
```

Opcion B: Un manifest por componente (recomendado para GitHub Pages)
```bash
# Script para generar manifests individuales
for pkg in packages/*/; do
  name=$(basename "$pkg")
  npx cem analyze --litelement \
    --globs "$pkg/src/*.js" \
    --exclude "**/*.styles.js" \
    --outdir "$pkg"
done
```

### Fase 5: Actualizar demos existentes

Añadir link al playground en cada demo:

```html
<!-- En packages/*/demo/index.html -->
<p>
  <a href="../../../">&larr; Back to components</a> |
  <a href="playground.html">Playground interactivo</a> |
  <a href="https://github.com/..." target="_blank">GitHub</a>
</p>
```

### Fase 6: CI/CD

Añadir generacion de manifests antes del deploy a GitHub Pages:

```yaml
# En .github/workflows/pages.yml
- name: Generate Custom Elements Manifests
  run: pnpm cem
```

## Ejemplo: app-modal

Con los JSDoc actuales de `app-modal.js`, el playground mostrara automaticamente:

**Panel Knobs:**
- `title` (text input)
- `message` (text input)
- `max-width` (text input)
- `max-height` (text input)
- `show-header` (checkbox)
- `show-footer` (checkbox)
- `open` (checkbox)
- `button1-text`, `button2-text`, `button3-text` (text inputs)

**Panel Styles:**
- `--app-modal-z-index`
- `--app-modal-bg`
- `--app-modal-radius`
- `--app-modal-confirm-bg`
- `--app-modal-cancel-bg`

**Panel Events:**
- Log de `modal-action1`, `modal-action2`, `modal-action3`, `modal-closed-requested`

**Panel Slots:**
- Editor para el slot default

**Codigo generado:**
```html
<app-modal
  title="Mi titulo"
  message="Mi mensaje"
  button1-text="Aceptar"
  style="--app-modal-bg: #f0f0f0;"
></app-modal>
```

## Comparativa con Storybook

| Aspecto | API Viewer | Storybook |
|---------|------------|-----------|
| **Dependencias** | 1 (CEM analyzer) | ~50+ |
| **CDN compatible** | Si (esm.sh) | No |
| **GitHub Pages** | HTML estatico | Requiere build |
| **Setup** | ~1 hora | ~4 horas |
| **Mantenimiento** | Bajo | Medio-alto |
| **Features** | Knobs, CSS vars, eventos | Mas addons |
| **Curva aprendizaje** | Baja | Media |

## Estimacion de esfuerzo

| Tarea | Esfuerzo |
|-------|----------|
| Configurar CEM analyzer | 30 min |
| Revisar/mejorar JSDoc de 27 componentes | 2-3 horas |
| Crear template playground | 30 min |
| Generar 27 playgrounds | 1 hora (script) |
| Actualizar demos con links | 30 min |
| CI/CD | 30 min |
| **Total** | **~6 horas** |

## Limitaciones conocidas

1. **Slots complejos**: El editor de slots es basico, para slots con estructura compleja puede no ser ideal
2. **Metodos**: api-viewer no expone metodos para probar (solo properties/attributes)
3. **Estilos del viewer**: Requiere CSS custom para que encaje con tu diseño

## Proximos pasos

1. Decidir si implementar
2. Si se aprueba, empezar con un componente piloto (ej: `app-modal`)
3. Validar que funciona bien en GitHub Pages
4. Replicar a los 26 componentes restantes

---

## Referencias

- [api-viewer-element - GitHub](https://github.com/open-wc/api-viewer-element)
- [Custom Elements Manifest Analyzer](https://custom-elements-manifest.open-wc.org/analyzer/getting-started/)
- [API Viewer Demo](https://api-viewer.open-wc.org/)
- [The killer feature of Web Components (2025)](https://daverupert.com/2025/10/custom-elements-manifest-killer-feature/)
