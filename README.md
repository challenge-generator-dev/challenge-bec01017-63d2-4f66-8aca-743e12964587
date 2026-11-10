# Implementación de CRUD de ordenes en DynamoDB

El sistema de gestión de órdenes requiere la implementación de operaciones CRUD sobre una tabla DynamoDB. La API REST expondrá estas operaciones para permitir la persistencia y consulta de órdenes. Los actores involucrados son el Cliente, que realiza las peticiones, y el Sistema de Ordenes, que gestiona las operaciones en DynamoDB.

## Informacion General

| Campo | Valor |
|-------|-------|
| **Tema** | CRUD de ordenes sobre DynamoDB |
| **Nivel** | advanced-l2 |
| **Tipo** | practical |
| **Tiempo estimado** | 8 horas |

## Fases del Reto

### Fase 0: Configuración del Proyecto

**Objetivo:** Obtener el proyecto base funcional enviando el Código Base a un asistente de IA, que lo analizará, corregirá errores y entregará cada archivo con su ruta.

**Tiempo estimado:** 15-30 minutos

**Instrucciones:**

- Asegúrate de tener instalado para ejecutar el proyecto: Node.js 18+, npm, VS Code o similar.
- Copia todo el contenido del campo **Código Base** de este reto — incluyendo el texto de instrucciones que aparece al inicio.
- Abre un asistente de IA (Claude en claude.ai, ChatGPT o Gemini — se recomienda Claude), pega el contenido copiado en el chat y envíalo.
- El asistente analizará los archivos, corregirá errores y entregará cada archivo con su ruta. Guárdalos en la carpeta donde quieras trabajar, respetando las rutas.
- Ejecuta `npm install && npm run build` (o `npm start`). Si no hay errores, estás listo.

**Entregable:** El proyecto compila/arranca sin errores.

<details>
<summary>Pistas de conocimiento</summary>

- Copia el Código Base completo incluyendo el texto de instrucciones al inicio — esas instrucciones le indican al asistente exactamente qué hacer con los archivos.
- Si el asistente no entrega todos los archivos al terminar el análisis, escríbele: "entrégame todos los archivos con su ruta".
- Si el proyecto tiene errores al arrancar, comparte el mensaje de error con el mismo asistente para que lo corrija.

</details>

### Fase 1: Configuración inicial del entorno

**Objetivo:** Configurar el entorno de desarrollo para interactuar con DynamoDB y exponer una API REST.

**Tiempo estimado:** 2 horas

**Instrucciones:**

- Configurar el entorno de desarrollo con las herramientas necesarias para interactuar con DynamoDB.
- Crear una tabla en DynamoDB para almacenar las órdenes.
- Configurar una API REST que exponga las operaciones CRUD sobre la tabla DynamoDB.

**Entregable:** Entorno de desarrollo configurado con DynamoDB y API REST expuesta.

<details>
<summary>Pistas de conocimiento</summary>

- Utiliza Terraform para gestionar la infraestructura.
- Configura las rutas y métodos necesarios en la API REST para las operaciones CRUD.

</details>

### Fase 2: Implementación de la operación CREATE

**Objetivo:** Implementar la operación de creación de órdenes en DynamoDB.

**Tiempo estimado:** 2 horas

**Instrucciones:**

- Implementar la lógica para crear una nueva orden en DynamoDB.
- Asegurar que la orden creada cumpla con las reglas de negocio (por ejemplo, no permitir órdenes con precio negativo).
- Manejar posibles errores de validación y proporcionar respuestas adecuadas.

**Entregable:** Operación CREATE implementada y funcionando en la API REST.

<details>
<summary>Pistas de conocimiento</summary>

- Utiliza las herramientas de depuración para verificar el correcto funcionamiento de la operación CREATE.
- Implementa validaciones para asegurar la integridad de los datos.

</details>

### Fase 3: Implementación de las operaciones READ, UPDATE y DELETE

**Objetivo:** Implementar las operaciones de lectura, actualización y eliminación de órdenes en DynamoDB.

**Tiempo estimado:** 4 horas

**Instrucciones:**

- Implementar la lógica para leer, actualizar y eliminar órdenes en DynamoDB.
- Asegurar que las operaciones cumplan con las reglas de negocio y manejen posibles errores.
- Proporcionar respuestas adecuadas para cada operación.

**Entregable:** Operaciones READ, UPDATE y DELETE implementadas y funcionando en la API REST.

<details>
<summary>Pistas de conocimiento</summary>

- Utiliza las herramientas de depuración para verificar el correcto funcionamiento de las operaciones READ, UPDATE y DELETE.
- Implementa validaciones y manejo de errores para cada operación.

</details>

## Dimensiones Evaluadas

- **queEs**: ¿Qué es una operación CRUD en el contexto de DynamoDB?
- **paraQueSirve**: ¿Para qué sirve cada operación CRUD en el sistema de gestión de órdenes?
- **comoSeUsa**: ¿Cómo se usa la API REST para interactuar con las operaciones CRUD en DynamoDB?
- **erroresComunes**: ¿Cuáles son los errores comunes que pueden ocurrir durante las operaciones CRUD y cómo se manejan?

## Criterios de Evaluacion

- Configuración correcta del entorno de desarrollo con DynamoDB y API REST.
- Implementación correcta de la operación CREATE con validaciones y manejo de errores.
- Implementación correcta de las operaciones READ, UPDATE y DELETE con validaciones y manejo de errores.

## Como trabajar con un asistente de IA

Hay dos caminos, elegi uno:

- **AGENTS.md** (recomendado) — instrucciones nativas del repo. Abri esta carpeta con tu agente local (Claude Code, Cursor, Codex, Copilot, Gemini) y las carga solo. Sabe que archivos faltan y con que comando se verifica, y completa el scaffold escribiendo en disco.
- **PROMPT_MEJORA.md** — para copiar y pegar en un chat (claude.ai, ChatGPT) si no tenes un agente en el IDE. Declara lo mismo que AGENTS.md; los archivos que te devuelva el chat los guardas en esta carpeta respetando las rutas.

Ninguno de los dos resuelve las fases del reto: eso es tu trabajo.

## Mapa de componentes

El repo tiene una carpeta por componente. Cada uno se instala y verifica dentro de la suya.

| Componente | Carpeta | Rol | Capa | Track | Tecnologias |
|---|---|---|---|---|---|
| `app` | `app/` | practice, chapter | server | Node | Express, DynamoDB |
| `infra` | `infra/` | support | infra | Terraform (AWS) | Terraform |
| `infra-local` | (raiz) | support | infra | Compose local | DynamoDB |

## Orden de arranque

1. `docker compose up -d` (en la raiz) — levanta la infraestructura local.
2. `cd infra && terraform fmt -check -recursive && terraform init -backend=false && terraform validate` — componente `infra` (support).
3. `cd app && npm install && npm run build` — componente `app` (practice, chapter).

### Contratos entre componentes

- `app` expone http (api: http://localhost:3000):
  - `POST /orders`
  - `GET /orders/:id`
  - `PUT /orders/:id`
  - `DELETE /orders/:id`

## Herramientas

- **Terraform**: Herramienta de trabajo del candidato: usala en la fase donde se depura o se prueba la solucion (no es una dependencia del proyecto).

## Verificacion

El proyecto esta listo para trabajar cuando este comando corre sin errores:

```bash
(cd app && npm install && npm run build) && (cd infra && terraform fmt -check -recursive && terraform init -backend=false && terraform validate) && docker compose config -q
```

---

*Reto generado automaticamente por Challenge Generator - Pragma*
