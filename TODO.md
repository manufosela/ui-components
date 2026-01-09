# TODO

## Accesibilidad

Hacer los componentes accesibles siguiendo estas recomendaciones:

### 1. Usa HTML semantico antes que ARIA

- Si es un boton, usa `<button>` (no un `<div>` con `role="button"`).
- Si es un enlace, usa `<a href>`.
- Si es un input, usa `<input>` / `<textarea>` / `<select>`.
- ARIA es para cuando no existe un elemento semantico que encaje.

### 2. Todo debe funcionar con teclado

- **Tab**: se puede llegar al control.
- **Enter/Espacio**: activa lo que sea "clickable" (si no es `<button>`, te toca implementar).
- **Escape**: cierra dialogos/menus (si aplica).
- **Flechas**: navegan en componentes tipo tabs, menu, listbox (cuando aplican patrones ARIA).
- No "secuestrar" el teclado: evita atajos que rompan navegacion estandar.

### 3. Focus visible y orden logico

- Asegura `:focus-visible` con un estilo claro (no lo elimines).
- No cambies el orden de tabulacion de forma rara.
- No uses `tabindex > 0` (casi nunca). Preferible `0` o `-1` (roving tabindex si aplica).

### 4. No escondas la accesibilidad dentro del Shadow DOM "sin salida"

En Shadow DOM, el texto/labels y relaciones ARIA pueden volverse menos obvias para ATs. Reglas practicas:

- Si el componente es un control, intenta que el foco caiga en el control real (`<button>`, `<input>`, etc.) dentro del shadow.
- Considera `delegatesFocus: true` en el shadow root para componentes tipo input/boton (si te encaja).
- Si expones un "label", asegurate de que el usuario puede etiquetar el componente de forma estandar (ver punto siguiente).

### 5. Nombre accesible obligatorio (accessible name)

Todo control interactivo debe tener nombre accesible:

- Por texto visible dentro (`<button>Guardar</button>`)
- o por `aria-label="..."`,
- o por `aria-labelledby="idDeAlgo"`.

Para Web Components, suele ir bien:

- Permitir `label` como atributo/prop
- y/o soportar `aria-label`/`aria-labelledby` pasandolos al elemento interactivo interno.

### 6. Estados y propiedades accesibles

Cuando cambie el estado, refleja con atributos/ARIA:

- **Deshabilitado**: `disabled` en elemento nativo o `aria-disabled="true"` si no hay disabled.
- **Expandido/collapsado**: `aria-expanded`.
- **Toggle**: `aria-pressed` (boton toggle) o `role="switch"` + `aria-checked`.
- **Seleccion**: `aria-selected` (tabs/options).
- **Oculto visualmente**: usa `hidden` o `aria-hidden="true"` segun el caso (ojo: `aria-hidden` tambien lo oculta a lectores).

### 7. Etiquetas y ayuda (descriptions) para formularios

Para campos:

- **Error**: `aria-invalid="true"` y `aria-describedby="idDelError"` para enlazar mensaje.
- **Ayuda**: `aria-describedby="idDeAyuda"`.

### 8. Anuncia cambios dinamicos cuando sea necesario

Si hay feedback que aparece sin mover el foco (ej. "Guardado", errores globales):

- `role="status"` (no intrusivo) o `aria-live="polite"`.
- Para alertas criticas: `role="alert"` / `aria-live="assertive"` (con cuidado).

### 9. Contraste, tamano tactil y motion

- Contraste suficiente (texto y elementos focus).
- Targets tactiles razonables (~44px recomendado como referencia).
- Evita animaciones que mareen; respeta `prefers-reduced-motion`.

### 10. Sigue patrones ARIA oficiales si estas recreando un widget

Si construyes cosas tipo Tabs, Menu, Combobox, Dialog, Listbox... sigue los [patrones ARIA](https://www.w3.org/WAI/ARIA/apg/patterns/) (roles, teclas, atributos). Si no, te metes en un "casi" que rompe ATs.

---

## Mejoras en componentes

### arc-slider

- [ ] Poder cambiar la posicion de `.value-display` (arriba/abajo)
- [ ] Poder mostrar el valor como badge en el punto del slider
- [ ] Poder mostrar los valores maximo y minimo al principio y final del arco
- [ ] Poder mostrar steps en el arco (valores numericos a lo largo del arco)

### circle-percent

- [x] Añadir ejemplo en demo de avance del 1% cada 100ms al darle a un boton
- [x] Añadir boton de reset en el ejemplo

### app-modal

- [x] Bug: cuando marco el check de `open`, se ve el shadow pero no la modal (fix: doble rAF)

### multi-carousel

- [x] Usar imagenes free en algun ejemplo de la demo (Picsum Photos)

### radar-chart

- [ ] En playground: no se ve como meter el slot con `chart-series` y `chart-values`
- [ ] Añadir ejemplos con slots en el source del playground para que se puedan modificar valores

---

## Playgrounds con slots

Componentes con slots ahora tienen seccion "Live Example" con contenido por defecto:

- [x] **header-nav**: añadido ejemplo con links de navegacion
- [x] **circle-steps**: añadido ejemplo con step-items
- [x] **radar-chart**: añadido ejemplo con chart-series y chart-values
- [x] **behaviour-accordion**: añadido ejemplo con accordion-items
- [x] **tab-nav**: añadido ejemplo con tab-items
- [x] **multi-carousel**: añadido ejemplo con slides
- [x] **nav-list**: añadido ejemplo con nav-items
- [x] **rich-select**: añadido ejemplo con rich-options
- [x] **multi-select**: añadido ejemplo con select-options

Script `generate-playgrounds.js` actualizado para incluir contenido por defecto.
