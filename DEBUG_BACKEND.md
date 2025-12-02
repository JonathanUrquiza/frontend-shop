# Debug: Qué esperamos recibir del backend

## Estructura esperada del Producto

El backend debe enviar productos con esta estructura JSON:

```json
{
  "product_id": 1,
  "product_name": "Baby Yoda Blueball",
  "price": 5200.99,
  "stock": 10,
  "sku": "FNK-SW-001",
  "image_front": "star-wars/baby-yoda-1.webp",
  "product_description": "Descripción del producto...",
  "licence": "Star Wars",
  "discount": 0
}
```

## Campos importantes para las imágenes:

### `image_front` (REQUERIDO para mostrar imágenes correctas)
- **Formato esperado:** `"star-wars/baby-yoda-1.webp"` o `"harry-potter/harry-1.webp"`
- **No debe incluir:** `/multimedia/` al inicio (se agrega automáticamente)
- **Debe incluir:** La carpeta de licencia + nombre del archivo con extensión `.webp`
- **Ejemplos válidos:**
  - ✅ `"star-wars/baby-yoda-1.webp"`
  - ✅ `"harry-potter/harry-1.webp"`
  - ✅ `"pokemon/pikachu-1.webp"`
  - ❌ `"/multimedia/star-wars/baby-yoda-1.webp"` (no debe tener `/multimedia/`)
  - ❌ `"baby-yoda-1.webp"` (debe incluir la carpeta de licencia)
  - ❌ `""` o `null` (si está vacío, se mostrará el banner)

### `licence` (OPCIONAL, se usa como fallback)
- **Formato esperado:** `"Star Wars"`, `"Harry Potter"`, `"Pokemon"`, etc.
- Se usa solo si `image_front` está vacío para intentar construir la ruta

## Cómo se procesa:

1. **Si `image_front` tiene valor:**
   - Se normaliza a: `/multimedia/star-wars/baby-yoda-1.webp`
   - Para la card se convierte a: `/multimedia/star-wars/baby-yoda-box.webp`
   - Para hover se mantiene: `/multimedia/star-wars/baby-yoda-1.webp`

2. **Si `image_front` está vacío/null:**
   - Se muestra el banner por defecto: `/multimedia/funkos-banner.webp`

## Logs en consola:

Cuando cargas la página, deberías ver en la consola del navegador:

```
Productos recibidos del backend: [array de productos]
Primer producto ejemplo: {
  product_name: "...",
  image_front: "...",
  licence: "..."
}
Productos normalizados: [primeros 3 productos]
```

Y en cada card:
```
Producto: [nombre], image_front: [valor], imagen final: [ruta final]
```

## Para verificar:

1. Abre la consola del navegador (F12)
2. Busca los logs que empiezan con "Productos recibidos del backend"
3. Verifica que `image_front` tenga el formato: `"carpeta-licencia/nombre-archivo-1.webp"`
4. Si está vacío o null, ese es el problema

