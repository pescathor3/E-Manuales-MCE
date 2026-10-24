# E_Manuales-MCE · Catálogo dinámico por JSON

El catálogo carga sus tarjetas desde **`manuales.json`**. Para añadir, actualizar u ocultar manuales ya no se edita `index.html`.

## Instalar en GitHub Pages

1. En tu repositorio `pescathor3/E_Manuales-MCE`, sube a la **raíz** `index.html` y `manuales.json`.
2. Sube también la carpeta `portadas/` con las imágenes que ya contiene.
3. Activa **Settings → Pages → Deploy from a branch → main → /(root)** si todavía no está activado.
4. La URL prevista del catálogo es `https://pescathor3.github.io/E_Manuales-MCE/`.

**Importante:** en el repositorio ya existente, reemplaza el `index.html` anterior por el nuevo *y añade `manuales.json` y `portadas/` en el mismo commit*. El nuevo catálogo no puede cargar las tarjetas sin `manuales.json`.

## Agregar un manual (sin editar código HTML)

1. Exporta el manual del estudiante y prepara sus archivos para la web (`index.html`, `modelo.js`, `contornos.js`, según corresponda).
2. Súbelos a su propia carpeta, por ejemplo `starter/nuevo-robot/`.
3. Sube una imagen `.webp`, `.png` o `.jpg` a `portadas/`, por ejemplo `portadas/nuevo-robot.png`.
4. Abre `manuales.json` en GitHub, pulsa el lápiz de edición y añade una nueva entrada **dentro del arreglo `manuales`**, separándola de la anterior con una coma.
5. Guarda con **Commit changes**. El catálogo actualizará automáticamente su tarjeta cuando se publique el cambio.

### Ejemplo de entrada

```json
{
  "id": "nuevo-robot",
  "titulo": "Nuevo Robot",
  "nivel": "Explorer",
  "estado": "publicado",
  "pasos": 32,
  "descripcion": "Construye un nuevo modelo y explora sus mecanismos.",
  "imagen": "portadas/nuevo-robot.png",
  "url": "explorer/nuevo-robot/",
  "palabras_clave": ["robot", "motores", "ensamble"]
}
```

**Campos y valores permitidos**

| Campo | Uso |
|---|---|
| `id` | Identificador único, sin espacios (por ejemplo `pinza-robot`) |
| `titulo` | Nombre visible del manual |
| `nivel` | `Starter`, `Explorer`, `Deployer` o `Master` |
| `estado` | `publicado`, `preparacion` u `oculto` |
| `pasos` | Entero (por ejemplo `49`) o `null` cuando aún no se conoce |
| `descripcion` | Explicación breve del reto |
| `imagen` | Ruta relativa, por ejemplo `portadas/pinza-robot.webp` |
| `url` | URL de GitHub Pages o ruta relativa, como `starter/nuevo-robot/` |
| `palabras_clave` | Lista de términos para la búsqueda |

- `publicado`: muestra **Abrir manual** solo si `url` tiene un enlace válido.
- `preparacion`: muestra la tarjeta con **Próximamente**, sin enlace.
- `oculto`: el modelo no aparece en el catálogo (sirve para borradores).
- En `pasos`, `null` muestra **Ensamble 3D**.
- Para publicar Carrusel, cambia su `estado` a `publicado` y añade su `url`.
- Los enlaces publicados actuales de Pinza Robot, Pato Robot y Robot Móvil **se conservaron** en el JSON; se pueden cambiar por rutas del repositorio central cuando migres sus archivos.
- Si no hay portada, puedes dejar `imagen` como cadena vacía: el catálogo indicará "Sin imagen".

## Pruebas locales

GitHub Pages sirve archivos mediante HTTPS y puede cargar `manuales.json` sin configuración adicional. Si abres el `index.html` con doble clic (`file://`), algunos navegadores bloquean la lectura JSON por seguridad.

- **Para probar localmente sin servidor:** abre `index.html` y, si aparece el aviso, selecciona el archivo `manuales.json` con el botón que ofrece la página.
- **Para probar como sitio web:** en la carpeta descomprimida ejecuta `python -m http.server 8000` y visita `http://localhost:8000/`.

No necesitas Python para publicar ni utilizar el catálogo en GitHub Pages.

## Rutas recomendadas

```text
E_Manuales-MCE/
├── index.html
├── manuales.json
├── portadas/
│   ├── logo-mce.webp
│   ├── pinza-robot.webp
│   ├── pato-robot.webp
│   ├── carrusel.webp
│   └── robot-movil.svg
├── starter/
│   ├── pinza-robot/
│   └── pato-robot/
├── explorer/
└── deployer/
    └── robot-movil/
```

Cada alumno puede escanear el QR que apunte directamente a `starter/pato-robot/` (o la carpeta que corresponda); el catálogo general es independiente del QR específico.
