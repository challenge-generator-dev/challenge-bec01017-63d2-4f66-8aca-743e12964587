# Prompt para Mejorar el Codigo Base

Copia y pega el contenido del bloque de abajo en un asistente de IA (Claude, ChatGPT)
para obtener el proyecto completo y arrancable. Guarda los archivos que te devuelva en la
carpeta del repo, respetando exactamente las rutas.

Si preferis trabajar en tu editor con un agente local (Claude Code, Cursor, Copilot), usa `AGENTS.md` en vez de este archivo: dice lo mismo pero para que escriba los archivos en disco.

## Las dos reglas que no se negocian

1. **Completa el boilerplate.** Todo lo que el proyecto necesita para compilar y arrancar: manifiesto de dependencias, punto de entrada, configuracion, capa de interfaz, y las capas del patron arquitectonico declarado. Eso es andamiaje y es tu trabajo.
2. **NO resuelvas el reto.** Los entregables de las fases son el trabajo de la persona. El hueco pedagogico se deja como esta: el proyecto arranca, pero lo que el reto pide implementar NO esta implementado.

Dicho de otra forma: si algo impide compilar, arreglalo. Si algo es logica de negocio incompleta, validaciones ausentes, un secreto hardcodeado o un patron mejorable, dejalo exactamente como esta — es lo que la persona tiene que encontrar.

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

## Lo que le falta a este proyecto

Esto NO lo tenes que adivinar: salio de comparar el proyecto contra la arquitectura declarada del reto y de un analisis estatico del codigo. Completalo TODO.

### Boilerplate del stack que falta

Sin esto no compila ni arranca. Es andamiaje, no toca nada de lo pedagogico:

- **app/src/app.module.ts** — Sin el modulo raiz, Nest no tiene arbol de dependencias que resolver y el bootstrap falla.

### Referencias colgando en el codigo que si esta

Cada una rompe la compilacion:

- `app/src/domain/models/Order.ts` — `OrderItem.reduce`: Se invoca `reduce` sobre `OrderItem`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- `app/src/domain/models/Order.ts` — `OrderItem.push`: Se invoca `push` sobre `OrderItem`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- `app/src/domain/models/Order.ts` — `OrderItem.filter`: Se invoca `filter` sobre `OrderItem`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- `app/src/shared/dto/OrderResponseDTO.ts` — `OrderItemResponse.map`: Se invoca `map` sobre `OrderItemResponse`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- `app/src/shared/dto/OrderResponseDTO.ts` — `OrderItemResponse.reduce`: Se invoca `reduce` sobre `OrderItemResponse`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.
- `app/src/shared/validations/orderValidation.ts` — `OrderItem.forEach`: Se invoca `forEach` sobre `OrderItem`, pero esa clase no declara ese metodo. Agregalo con su implementacion real, o usa uno de los que si declara.

## Como saber que terminaste

```bash
(cd app && npm install && npm run build) && (cd infra && terraform fmt -check -recursive && terraform init -backend=false && terraform validate) && docker compose config -q
```

Ese comando corriendo sin errores es la definicion de "listo".

---

```
## Briefing del reto (autoridad)
Este bloque manda sobre los archivos adjuntos. El stack y el rol salen de AQUÍ, no de un topic genérico ni de markdown placeholder.

### Perfil
Chapter Backend, Especialidad Desarrollador, Tecnología Node, Advanced L2

### Brecha de conocimiento
CRUD de ordenes en DynamoDB expuesto por una API REST (corrida e2e 20261109213213585), Implementa operaciones CRUD de ordenes sobre una tabla DynamoDB expuestas por una API REST

### Misión / candidato
Persistir y consultar ordenes

### Reto
- Tema: CRUD de ordenes sobre DynamoDB
- Seniority: advanced-l2
- Tipo: practical
- Título: Implementación de CRUD de ordenes en DynamoDB
- Tiempo estimado: 8 horas

### Fases (trabajo del HUMANO — PROHIBIDO completarlas)
No implementes estos entregables. Dejalos como hueco pedagógico. El asistente solo materializa el proyecto arrancable para que el participante pueda trabajar.
- Fase 1: Configuración inicial del entorno — objetivo: Configurar el entorno de desarrollo para interactuar con DynamoDB y exponer una API REST. — entregable (NO resolver): Entorno de desarrollo configurado con DynamoDB y API REST expuesta.
- Fase 2: Implementación de la operación CREATE — objetivo: Implementar la operación de creación de órdenes en DynamoDB. — entregable (NO resolver): Operación CREATE implementada y funcionando en la API REST.
- Fase 3: Implementación de las operaciones READ, UPDATE y DELETE — objetivo: Implementar las operaciones de lectura, actualización y eliminación de órdenes en DynamoDB. — entregable (NO resolver): Operaciones READ, UPDATE y DELETE implementadas y funcionando en la API REST.

Eres un asistente experto en análisis, corrección y generación de archivos de cualquier tipo:
código fuente, documentación, hojas de cálculo, documentos Word, configuraciones, entre otros.
Voy a enviarte una cadena de texto que contiene uno o más archivos. Cada archivo está delimitado por un marcador con el siguiente formato:
// === ARCHIVO: ruta/del/archivo.extension ===
o también puede aparecer como:
## === ARCHIVO: ruta/del/archivo.extension ===
Lo que sigue al marcador puede ser:

El contenido real del archivo (código, texto, YAML, etc.)
Una descripción en lenguaje natural de lo que debe contener el archivo


TU TAREA
PASO 0 — ¿Esto es un proyecto o una carcasa?
Antes de extraer archivos, leé el Briefing (si está) y diagnosticá el adjunto.

Es CARCASA si ocurre CUALQUIERA de estas:
- No hay manifiesto de dependencias del stack del briefing (manifest.json de VTEX IO / package.json / pom.xml / build.gradle / requirements.txt / go.mod / *.tf / *.csproj, según corresponda)
- Hay un "binario" que en realidad es un comentario ("no puede ser mostrado como texto plano", placeholder .fig/.docx vacío)
- Los markdowns ya completan entregables de fases posteriores ("se implementó fade-in", lista de áreas ya resuelta)

Si es CARCASA:
- MATERIALIZÁ un proyecto que arranca en el stack del briefing (VTEX IO Store Framework, Angular, Terraform, pytest, Nest, etc.). Incluí manifiesto, punto de entrada y capa de interfaz reales.
- NO copies los markdowns de "solución" como si fueran el producto. Son ruido de generación.
- NO resuelvas las fases del briefing (están marcadas PROHIBIDO). Dejá el hueco pedagógico: el flujo existe, las microinteracciones/calidad/infra que el reto pide NO están hechas.
- Después seguí al PASO 5 (entrega de archivos).

Si es un proyecto REAL (manifiesto + código que compila o arranca):
- Seguí PASO 1 en adelante. 🔴 compilación sí. 🟡 pedagógico no.

PASO 1 — Detección y extracción
Identifica todos los archivos presentes en la cadena. Para cada archivo extrae:

Su ruta completa (ej: src/main/java/com/pragma/Service.java)
Su contenido o descripción

PASO 2 — Clasificación por tipo
Clasifica cada archivo en una de estas categorías:
A) Código fuente (Java, Python, TypeScript, JavaScript, Kotlin, etc.)
B) Configuración / documentación (YAML, properties, Markdown, JSON, txt, etc.)
C) Excel (.xlsx, .xls, .csv)
D) Word (.docx, .doc)
E) Otro tipo de archivo binario o especial
PASO 3 — Clasificación de errores en código fuente

Objetivo prioritario: que el proyecto compile. No corrijas flujo de negocio ni lógica funcional.

Antes de modificar cualquier archivo de código fuente, clasifica cada problema encontrado en una de estas dos categorías:
🔴 ERROR DE COMPILACIÓN — corregir siempre
Son errores que impiden que el proyecto arranque, sin valor pedagógico:

Import faltante o incorrecto
Clase, método o variable referenciada que no existe en ningún archivo del proyecto
Error de sintaxis
Anotación con atributos inválidos
Dependencia ausente en pom.xml, package.json, etc.
Archivo referenciado que no existe y debe ser creado con implementación mínima

→ CORREGIR estos errores.
🟡 PROBLEMA FUNCIONAL O DE CALIDAD — preservar siempre
Son problemas que no impiden compilar. Pueden ser intencionales para el aprendizaje:

Clave secreta hardcodeada ("secret", "password123")
API deprecada que funciona pero tiene reemplazo moderno
Lógica de negocio incorrecta o incompleta
Código redundante o de baja legibilidad
Falta de validaciones en flujo de negocio
Patrones de diseño incorrectos pero funcionales
Concurrencia no segura
Configuración funcional pero no óptima

→ PRESERVAR tal cual. No corregir, no mejorar, no comentar.
PASO 4 — Procesamiento según tipo de archivo
Tipo A — Código fuente
Aplica únicamente las correcciones clasificadas como 🔴 ERROR DE COMPILACIÓN.
No alteres ningún elemento clasificado como 🟡 PROBLEMA FUNCIONAL O DE CALIDAD.
Si falta un archivo referenciado, créalo con la implementación mínima necesaria para compilar.
Tipo B — Configuración / documentación
Extrae el contenido tal cual, sin modificaciones salvo errores evidentes de sintaxis
(ej: YAML mal indentado).
Tipo C — Excel (.xlsx)
Si viene con contenido real, genera el archivo respetando ese contenido.
Si viene con descripción en lenguaje natural, genera un archivo Excel funcional con:

Fila de encabezados en negrita con color de fondo distintivo
Columnas con ancho ajustado al contenido
Tipos de dato correctos por columna
Validaciones si la descripción lo indica
Hojas nombradas descriptivamente si hay más de una
Filas de ejemplo si no hay datos reales

Tipo D — Word (.docx)
Si viene con contenido real, genera el archivo respetando ese contenido.
Si viene con descripción en lenguaje natural, genera un documento Word funcional con:

Estilos de título (Título 1, Título 2) para jerarquía de secciones
Fuente legible (Calibri o equivalente), tamaño 11-12pt para cuerpo
Márgenes estándar
Tabla de contenido si tiene múltiples secciones
Tablas con encabezados en negrita si aplica

Tipo E — Otro
Genera el archivo con el contenido o estructura más apropiada según la descripción.
PASO 5 — Entrega de archivos
Entregá cada archivo con su ruta completa, respetando exactamente la estructura de rutas
indicada por los marcadores: un bloque por archivo, precedido por su ruta. No generes ZIPs
ni archivos adjuntos.
La entrega debe incluir:

Archivos de código con únicamente los errores de compilación corregidos
Archivos de configuración y documentación sin cambios
Archivos nuevos creados para resolver dependencias de compilación faltantes
Archivos Excel y Word generados desde descripción

IMPORTANTE: Entregá los archivos completos al finalizar. No preguntes si el usuario
quiere recibirlos. Simplemente entregalos; No debes desplegar en el chat el resumen de lo que arreglaste, solo entregá los archivos.

REGLAS IMPORTANTES

No omitas ningún archivo aunque no tenga errores ni modificaciones
Respeta los nombres y rutas exactas indicadas por los marcadores
Si un archivo no tiene marcador claro, infiere el nombre desde su contenido
Si la cadena contiene solo documentación, placeholders o binarios fake, NO la reproduzcas:
aplicá PASO 0 (materializar el proyecto del briefing). Reproducir la carcasa es un fallo.
No agregues texto después del último archivo entregado
No preguntes si el usuario quiere los archivos: simplemente entregalos siempre
Si detectas que falta un archivo de configuración necesario para compilar
(pom.xml, package.json, requirements.txt, build.gradle, etc.), créalo e inclúyelo
inferiendo su contenido desde los imports y frameworks detectados en el código
Nunca corrijas problemas 🟡 aunque parezcan obvios o fáciles de mejorar.
El participante que recibirá este proyecto los debe encontrar y resolver él mismo.


INPUT
Aquí está la cadena con los archivos:

// === ARCHIVO: app/package.json ===
{
  "name": "order-management-api",
  "version": "1.0.0",
  "description": "API REST para gestión de órdenes en DynamoDB",
  "main": "dist/main.js",
  "scripts": {
    "build": "tsc",
    "start": "node dist/main.js",
    "dev": "ts-node src/main.ts",
    "test": "jest",
    "test:watch": "jest --watch"
  },
  "dependencies": {
    "@aws-sdk/client-dynamodb": "^3.600.0",
    "@aws-sdk/lib-dynamodb": "^3.600.0",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.14.1",
    "dotenv": "^16.4.5",
    "express": "^4.21.0",
    "reflect-metadata": "^0.2.2",
    "uuid": "^9.0.1"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/jest": "^29.5.12",
    "@types/node": "^22.5.0",
    "@types/uuid": "^9.0.8",
    "jest": "^29.7.0",
    "supertest": "^7.0.0",
    "ts-node": "^10.9.2",
    "typescript": "^5.7.3"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}

// === ARCHIVO: app/tsconfig.json ===
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "**/*.test.ts"]
}

// === ARCHIVO: app/src/main.ts ===
import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import { OrderController } from './infrastructure/controllers/OrderController';
import { errorHandler } from './infrastructure/middlewares/errorHandler';
import { validateDto } from './infrastructure/middlewares/validationMiddleware';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { CreateOrderDTO } from './shared/dto/CreateOrderDTO';
import { UpdateOrderDTO } from './shared/dto/UpdateOrderDTO';
import dotenv from 'dotenv';

dotenv.config();

const dynamoDBClient = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  endpoint: process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'fakeAccessKeyId',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'fakeSecretAccessKey',
  },
});

const docClient = DynamoDBDocumentClient.from(dynamoDBClient);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const orderController = new OrderController(docClient as any);

app.post(
  '/orders',
  validateDto(CreateOrderDTO),
  (req: Request, res: Response, next: NextFunction) => {
    orderController.createOrder(req, res, next);
  }
);

app.get('/orders/:id', (req: Request, res: Response, next: NextFunction) => {
  orderController.getOrder(req, res, next);
});

app.put(
  '/orders/:id',
  validateDto(UpdateOrderDTO),
  (req: Request, res: Response, next: NextFunction) => {
    orderController.updateOrder(req, res, next);
  }
);

app.delete('/orders/:id', (req: Request, res: Response, next: NextFunction) => {
  orderController.deleteOrder(req, res, next);
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

// === ARCHIVO: app/src/domain/models/Order.ts ===
import { v4 as uuidv4 } from 'uuid';

export interface OrderItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
}

export enum OrderStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    PROCESSING = 'PROCESSING',
    SHIPPED = 'SHIPPED',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED'
}

export class Order {
    private readonly _id: string;
    private _customerId: string;
    private _items: OrderItem[];
    private _status: OrderStatus;
    private _createdAt: Date;
    private _updatedAt: Date;

    constructor(customerId: string, items: OrderItem[], status: OrderStatus = OrderStatus.PENDING) {
        this._id = uuidv4();
        this._customerId = customerId;
        this._items = items;
        this._status = status;
        this._createdAt = new Date();
        this._updatedAt = new Date();
    }

    get id(): string {
        return this._id;
    }

    get customerId(): string {
        return this._customerId;
    }

    set customerId(value: string) {
        this._customerId = value;
        this._updatedAt = new Date();
    }

    get items(): OrderItem[] {
        return this._items;
    }

    set items(value: OrderItem[]) {
        this._items = value;
        this._updatedAt = new Date();
    }

    get status(): OrderStatus {
        return this._status;
    }

    set status(value: OrderStatus) {
        this._status = value;
        this._updatedAt = new Date();
    }

    get createdAt(): Date {
        return this._createdAt;
    }

    get updatedAt(): Date {
        return this._updatedAt;
    }

    calculateTotal(): number {
        return this._items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    addItem(item: OrderItem): void {
        this._items.push(item);
        this._updatedAt = new Date();
    }

    removeItem(productId: string): void {
        this._items = this._items.filter(item => item.productId !== productId);
        this._updatedAt = new Date();
    }
}

// === ARCHIVO: app/src/domain/ports/OrderRepository.ts ===
import { Order } from '../models/Order';

export interface OrderRepository {
    create(order: Order): Promise<Order>;
    findById(id: string): Promise<Order | null>;
    update(order: Order): Promise<Order>;
    delete(id: string): Promise<void>;
    findByCustomerId(customerId: string): Promise<Order[]>;
}

// === ARCHIVO: app/src/infrastructure/repositories/DynamoOrderRepository.ts ===
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand, UpdateCommand, DeleteCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { Order, OrderItem, OrderStatus } from '../../domain/models/Order';
import { OrderRepository } from '../../domain/ports/OrderRepository';

export class DynamoOrderRepository implements OrderRepository {
    private readonly client: DynamoDBDocumentClient;
    private readonly tableName: string;

    constructor(client: DynamoDBClient, tableName: string = 'Orders') {
        this.client = DynamoDBDocumentClient.from(client);
        this.tableName = tableName;
    }

    async create(order: Order): Promise<Order> {
        const params = {
            TableName: this.tableName,
            Item: {
                id: order.id,
                customerId: order.customerId,
                items: order.items.map(item => ({
                    productId: item.productId,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity
                })),
                status: order.status,
                total: order.calculateTotal(),
                createdAt: order.createdAt.toISOString(),
                updatedAt: order.updatedAt.toISOString()
            },
            ConditionExpression: 'attribute_not_exists(id)'
        };

        try {
            await this.client.send(new PutCommand(params));
            return order;
        } catch (error) {
            if (error instanceof Error && error.name === 'ConditionalCheckFailedException') {
                throw new Error('Order with this ID already exists');
            }
            throw error;
        }
    }

    async findById(id: string): Promise<Order | null> {
        const params = {
            TableName: this.tableName,
            Key: { id }
        };

        const result = await this.client.send(new GetCommand(params));
        if (!result.Item) {
            return null;
        }

        return this.mapDynamoItemToOrder(result.Item);
    }

    async update(order: Order): Promise<Order> {
        const params = {
            TableName: this.tableName,
            Key: { id: order.id },
            UpdateExpression: 'SET customerId = :customerId, items = :items, status = :status, total = :total, updatedAt = :updatedAt',
            ExpressionAttributeValues: {
                ':customerId': order.customerId,
                ':items': order.items.map(item => ({
                    productId: item.productId,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity
                })),
                ':status': order.status,
                ':total': order.calculateTotal(),
                ':updatedAt': order.updatedAt.toISOString()
            },
            ReturnValues: 'ALL_NEW' as const
        };

        const result = await this.client.send(new UpdateCommand(params));
        if (!result.Attributes) {
            throw new Error('Order not found');
        }

        return this.mapDynamoItemToOrder(result.Attributes);
    }

    async delete(id: string): Promise<void> {
        const params = {
            TableName: this.tableName,
            Key: { id }
        };

        await this.client.send(new DeleteCommand(params));
    }

    async findByCustomerId(customerId: string): Promise<Order[]> {
        const params = {
            TableName: this.tableName,
            IndexName: 'customerId-index',
            KeyConditionExpression: 'customerId = :customerId',
            ExpressionAttributeValues: {
                ':customerId': customerId
            }
        };

        const result = await this.client.send(new QueryCommand(params));
        if (!result.Items) {
            return [];
        }

        return result.Items.map(item => this.mapDynamoItemToOrder(item));
    }

    private mapDynamoItemToOrder(item: Record<string, unknown>): Order {
        const items = (item.items as Array<Record<string, unknown>>).map((i) => ({
            productId: i.productId as string,
            name: i.name as string,
            price: i.price as number,
            quantity: i.quantity as number
        }));

        const order = new Order(
            item.customerId as string,
            items,
            item.status as OrderStatus
        );

        Object.defineProperty(order, '_id', { value: item.id });
        Object.defineProperty(order, '_createdAt', { value: new Date(item.createdAt as string) });
        Object.defineProperty(order, '_updatedAt', { value: new Date(item.updatedAt as string) });

        return order;
    }
}

// === ARCHIVO: app/src/app.ts ===
import express, { Application, Request, Response, NextFunction } from 'express';
import 'reflect-metadata';
import { OrderController } from './infrastructure/controllers/OrderController';
import { errorHandler } from './infrastructure/middlewares/errorHandler';
import { validateQueryParams } from './infrastructure/middlewares/validationMiddleware';
import { createDynamoDBClient as createDynamoClient } from './infrastructure/config/dynamoConfig';
import { DynamoOrderRepository } from './infrastructure/repositories/DynamoOrderRepository';
import { OrderService } from './application/services/OrderService';

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const dynamoClient = createDynamoClient();
const orderRepository = new DynamoOrderRepository(dynamoClient, process.env.DYNAMODB_TABLE || 'Orders');
const orderService = new OrderService(orderRepository);
const orderController = new OrderController(orderService);

app.use(validateQueryParams);

app.post('/orders', (req: Request, res: Response, next: NextFunction) => 
  orderController.createOrder(req, res, next));
app.get('/orders/:id', (req: Request, res: Response, next: NextFunction) => 
  orderController.getOrder(req, res, next));
app.put('/orders/:id', (req: Request, res: Response, next: NextFunction) => 
  orderController.updateOrder(req, res, next));
app.delete('/orders/:id', (req: Request, res: Response, next: NextFunction) => 
  orderController.deleteOrder(req, res, next));

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`DynamoDB Table: ${process.env.DYNAMODB_TABLE || 'Orders'}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;

// === ARCHIVO: app/src/shared/dto/CreateOrderDTO.ts ===
import { IsString, IsNotEmpty, IsArray, ValidateNested, IsOptional, Min, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderItemDTO {
    @IsString()
    @IsNotEmpty()
    productId!: string;

    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsNumber()
    @Min(1)
    quantity!: number;

    @IsNumber()
    @Min(0)
    price!: number;
}

export class CreateOrderDTO {
    @IsString()
    @IsNotEmpty({ message: 'El ID del cliente es requerido' })
    customerId!: string;

    @IsArray({ message: 'Los items de la orden deben ser un arreglo' })
    @ValidateNested({ each: true })
    @Type(() => CreateOrderItemDTO)
    @IsNotEmpty({ message: 'La orden debe contener al menos un item' })
    items!: CreateOrderItemDTO[];

    @IsOptional()
    @IsString()
    notes?: string;

    constructor(data?: Partial<CreateOrderDTO>) {
        if (data) {
            this.customerId = data.customerId!;
            this.items = data.items!;
            this.notes = data.notes;
        }
    }

    validate(): void {
        if (!this.customerId || this.customerId.trim().length === 0) {
            throw new Error('El ID del cliente no puede estar vacío');
        }
        if (!this.items || this.items.length === 0) {
            throw new Error('La orden debe contener al menos un item');
        }
        this.items.forEach((item, index) => {
            if (!item.productId || !item.name) {
                throw new Error(`Item en posición ${index}: producto inválido`);
            }
            if (item.quantity <= 0 || item.price < 0) {
                throw new Error(`Item en posición ${index}: cantidad o precio inválido`);
            }
        });
    }
}

// === ARCHIVO: app/src/shared/dto/UpdateOrderDTO.ts ===
import { IsString, IsOptional, IsArray, ValidateNested, IsEnum, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '../../domain/models/Order';

export class UpdateOrderItemDTO {
    @IsString()
    @IsOptional()
    productId?: string;

    @IsString()
    @IsOptional()
    productName?: string;

    @IsNumber()
    @Min(1)
    @IsOptional()
    quantity?: number;

    @IsNumber()
    @Min(0)
    @IsOptional()
    unitPrice?: number;
}

export class UpdateOrderDTO {
    @IsOptional()
    @IsString({ message: 'El ID del cliente debe ser una cadena de texto' })
    customerId?: string;

    @IsOptional()
    @IsArray({ message: 'Los items deben ser un arreglo' })
    @ValidateNested({ each: true })
    @Type(() => UpdateOrderItemDTO)
    items?: UpdateOrderItemDTO[];

    @IsOptional()
    @IsEnum(OrderStatus, { message: 'Estado de orden inválido' })
    status?: OrderStatus;

    @IsOptional()
    @IsString({ message: 'Las notas deben ser texto' })
    notes?: string;

    constructor(data?: Partial<UpdateOrderDTO>) {
        if (data) {
            this.customerId = data.customerId;
            this.items = data.items;
            this.status = data.status;
            this.notes = data.notes;
        }
    }

    hasChanges(): boolean {
        return !!(
            this.customerId !== undefined ||
            this.items !== undefined ||
            this.status !== undefined ||
            this.notes !== undefined
        );
    }

    validatePartial(): void {
        if (this.items !== undefined && this.items.length === 0) {
            throw new Error('No se puede actualizar la orden con un arreglo de items vacío');
        }
        if (this.items) {
            this.items.forEach((item, index) => {
                if (item.quantity !== undefined && item.quantity <= 0) {
                    throw new Error(`Item en posición ${index}: la cantidad debe ser mayor a 0`);
                }
                if (item.unitPrice !== undefined && item.unitPrice < 0) {
                    throw new Error(`Item en posición ${index}: el precio no puede ser negativo`);
                }
            });
        }
    }
}

// === ARCHIVO: app/src/shared/dto/OrderResponseDTO.ts ===
import { OrderStatus } from '../../domain/models/Order';

export interface OrderItemResponse {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
}

export class OrderResponseDTO {
    readonly id: string;
    readonly customerId: string;
    readonly items: OrderItemResponse[];
    readonly status: OrderStatus;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly total: number;
    readonly notes?: string;

    constructor(
        id: string,
        customerId: string,
        items: OrderItemResponse[],
        status: OrderStatus,
        createdAt: Date,
        updatedAt: Date,
        total: number,
        notes?: string
    ) {
        this.id = id;
        this.customerId = customerId;
        this.items = items;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.total = total;
        this.notes = notes;
    }

    static fromDomain(order: any): OrderResponseDTO {
        const items: OrderItemResponse[] = order.items.map((item: any) => ({
            productId: item.productId,
            productName: item.name,
            quantity: item.quantity,
            unitPrice: item.price,
            subtotal: (item.price || 0) * (item.quantity || 0)
        }));

        const total = order.calculateTotal ? order.calculateTotal() : 0;

        return new OrderResponseDTO(
            order.id,
            order.customerId,
            items,
            order.status,
            order.createdAt,
            order.updatedAt,
            total,
            (order as any).notes
        );
    }

    toJSON(): Record<string, any> {
        return {
            id: this.id,
            customerId: this.customerId,
            items: this.items,
            status: this.status,
            createdAt: this.createdAt instanceof Date ? this.createdAt.toISOString() : this.createdAt,
            updatedAt: this.updatedAt instanceof Date ? this.updatedAt.toISOString() : this.updatedAt,
            total: this.total,
            notes: this.notes
        };
    }

    isActive(): boolean {
        return this.status !== OrderStatus.CANCELLED && this.status !== OrderStatus.DELIVERED;
    }

    canTransitionTo(newStatus: OrderStatus): boolean {
        const validTransitions: Partial<Record<OrderStatus, OrderStatus[]>> = {
            [OrderStatus.PENDING]: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
            [OrderStatus.PROCESSING]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
            [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED, OrderStatus.CANCELLED],
            [OrderStatus.DELIVERED]: [],
            [OrderStatus.CANCELLED]: []
        };
        const transitions = validTransitions[this.status];
        return transitions ? transitions.includes(newStatus) : false;
    }

    getItemCount(): number {
        return this.items.reduce((sum, item) => sum + item.quantity, 0);
    }

    getTotalItems(): number {
        return this.items.length;
    }
}

// === ARCHIVO: app/src/shared/errors/OrderError.ts ===
export enum OrderErrorType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  CREATION_ERROR = 'CREATION_ERROR',
  UPDATE_ERROR = 'UPDATE_ERROR',
  DELETE_ERROR = 'DELETE_ERROR',
  NOT_AUTHORIZED = 'NOT_AUTHORIZED',
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  INVALID_STATUS_TRANSITION = 'INVALID_STATUS_TRANSITION',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
}

export class OrderError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly metadata?: any;

  constructor(message: string, code: string, statusCode: number = 500, metadata?: any) {
    super(message);
    this.name = 'OrderError';
    this.code = code;
    this.statusCode = statusCode;
    this.metadata = metadata;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class OrderNotFoundError extends OrderError {
  constructor(orderId: string) {
    super(`Orden con ID ${orderId} no encontrada`, OrderErrorType.NOT_FOUND, 404);
    this.name = 'OrderNotFoundError';
  }
}

export class OrderValidationError extends OrderError {
  constructor(message: string, public readonly field?: string) {
    super(message, OrderErrorType.VALIDATION_ERROR, 400, { field });
    this.name = 'OrderValidationError';
  }
}

export class OrderCreationError extends OrderError {
  constructor(message: string, public readonly cause?: Error) {
    super(message, OrderErrorType.CREATION_ERROR, 500, { cause: cause?.message });
    this.name = 'OrderCreationError';
  }
}

export class OrderUpdateError extends OrderError {
  constructor(message: string, public readonly cause?: Error) {
    super(message, OrderErrorType.UPDATE_ERROR, 500, { cause: cause?.message });
    this.name = 'OrderUpdateError';
  }
}

export class OrderDeleteError extends OrderError {
  constructor(message: string, public readonly cause?: Error) {
    super(message, OrderErrorType.DELETE_ERROR, 500, { cause: cause?.message });
    this.name = 'OrderDeleteError';
  }
}

export class OrderNotAuthorizedError extends OrderError {
  constructor(customerId: string, orderId: string) {
    super(
      `Cliente ${customerId} no autorizado para acceder a la orden ${orderId}`,
      OrderErrorType.NOT_AUTHORIZED,
      403,
      { customerId, orderId }
    );
    this.name = 'OrderNotAuthorizedError';
  }
}

export class OrderAlreadyExistsError extends OrderError {
  constructor(orderId: string) {
    super(`La orden con ID ${orderId} ya existe`, OrderErrorType.ALREADY_EXISTS, 409, { orderId });
    this.name = 'OrderAlreadyExistsError';
  }
}

export class InvalidOrderStatusTransitionError extends OrderError {
  constructor(currentStatus: string, targetStatus: string) {
    super(
      `Transición de estado inválida de ${currentStatus} a ${targetStatus}`,
      OrderErrorType.INVALID_STATUS_TRANSITION,
      400,
      { currentStatus, targetStatus }
    );
    this.name = 'InvalidOrderStatusTransitionError';
  }
}

// === ARCHIVO: app/src/shared/validations/orderValidation.ts ===
import { Order, OrderItem, OrderStatus } from '../../domain/models/Order';
import { OrderValidationError } from '../errors/OrderError';

export interface OrderValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateOrderData(customerId: string, items: OrderItem[]): void {
  const errors: string[] = [];

  if (!customerId || customerId.trim().length === 0) {
    errors.push('El ID del cliente es requerido');
  }

  if (!items || items.length === 0) {
    errors.push('La orden debe contener al menos un ítem');
  }

  if (errors.length > 0) {
    throw new OrderValidationError(errors.join('; '));
  }
}

export function validateOrderItem(item: OrderItem): void {
  const errors: string[] = [];

  if (!item.productId || item.productId.trim().length === 0) {
    errors.push('El ID del producto es requerido');
  }

  if (item.quantity === undefined || item.quantity <= 0) {
    errors.push('La cantidad del producto debe ser mayor a 0');
  }

  if (item.price === undefined || item.price < 0) {
    errors.push('El precio unitario no puede ser negativo');
  }

  if (errors.length > 0) {
    throw new OrderValidationError(errors.join('; '), 'items');
  }
}

export function validateOrderItems(items: OrderItem[]): void {
  if (!items || items.length === 0) {
    throw new OrderValidationError('La orden debe contener al menos un ítem', 'items');
  }

  items.forEach((item, index) => {
    try {
      validateOrderItem(item);
    } catch (error) {
      if (error instanceof OrderValidationError) {
        throw new OrderValidationError(`Ítem ${index + 1}: ${error.message}`, 'items');
      }
      throw error;
    }
  });
}

export function validateTotalCalculation(order: Order): void {
  const calculatedTotal = order.calculateTotal();
  
  if (calculatedTotal < 0) {
    throw new OrderValidationError('El total de la orden no puede ser negativo', 'total');
  }
}

export function validateStatusTransition(currentStatus: OrderStatus, targetStatus: OrderStatus): boolean {
  const validTransitions: Record<OrderStatus, OrderStatus[]> = {
    [OrderStatus.PENDING]: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
    [OrderStatus.PROCESSING]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
    [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
    [OrderStatus.DELIVERED]: [],
    [OrderStatus.CANCELLED]: []
  };

  const allowedTransitions = validTransitions[currentStatus];
  return allowedTransitions ? allowedTransitions.includes(targetStatus) : false;
}

export function validateOrderUpdate(customerId: string, items: OrderItem[], status?: OrderStatus): void {
  const errors: string[] = [];

  if (customerId && customerId.trim().length === 0) {
    errors.push('El ID del cliente no puede estar vacío');
  }

  if (items && items.length > 0) {
    try {
      validateOrderItems(items);
    } catch (error) {
      if (error instanceof OrderValidationError) {
        errors.push(error.message);
      }
    }
  }

  if (status !== undefined && !Object.values(OrderStatus).includes(status)) {
    errors.push(`Estado '${status}' no es válido`);
  }

  if (errors.length > 0) {
    throw new OrderValidationError(errors.join('; '));
  }
}

export function validateOrderId(orderId: string): void {
  if (!orderId || orderId.trim().length === 0) {
    throw new OrderValidationError('El ID de la orden es requerido', 'id');
  }
}

// === ARCHIVO: app/src/application/services/OrderService.ts ===
import { Order, OrderItem, OrderStatus } from '../../domain/models/Order';
import { OrderRepository } from '../../domain/ports/OrderRepository';
import {
  OrderNotFoundError,
  OrderValidationError,
  OrderCreationError,
  OrderUpdateError,
  OrderDeleteError
} from '../../shared/errors/OrderError';
import {
  validateOrderData,
  validateOrderItems,
  validateTotalCalculation,
  validateStatusTransition,
  validateOrderUpdate,
  validateOrderId
} from '../../shared/validations/orderValidation';

export interface CreateOrderInput {
  customerId: string;
  items: OrderItem[];
}

export interface UpdateOrderInput {
  customerId?: string;
  items?: OrderItem[];
  status?: OrderStatus;
}

export class OrderService {
  constructor(private readonly orderRepository: OrderRepository) {
    if (!orderRepository) {
      throw new OrderValidationError('El repositorio de órdenes es requerido');
    }
  }

  async createOrder(input: CreateOrderInput): Promise<Order> {
    const { customerId, items } = input;

    try {
      validateOrderData(customerId, items);
      validateOrderItems(items);

      const order = new Order(customerId, items, OrderStatus.PENDING);
      validateTotalCalculation(order);

      const createdOrder = await this.orderRepository.create(order);
      return createdOrder;
    } catch (error) {
      if (error instanceof OrderValidationError) {
        throw error;
      }
      throw new OrderCreationError(
        `Error al crear la orden: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        error instanceof Error ? error : undefined
      );
    }
  }

  async getOrder(orderId: string): Promise<Order> {
    validateOrderId(orderId);

    try {
      const order = await this.orderRepository.findById(orderId);
      
      if (!order) {
        throw new OrderNotFoundError(orderId);
      }

      return order;
    } catch (error) {
      if (error instanceof OrderNotFoundError || error instanceof OrderValidationError) {
        throw error;
      }
      throw new OrderValidationError(
        `Error al obtener la orden: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }

  async updateOrder(orderId: string, input: UpdateOrderInput): Promise<Order> {
    validateOrderId(orderId);

    const itemsToValidate = input.items ?? [];
    if (input.customerId !== undefined || input.items !== undefined || input.status !== undefined) {
      validateOrderUpdate(input.customerId || '', itemsToValidate, input.status);
    }

    try {
      const existingOrder = await this.orderRepository.findById(orderId);

      if (!existingOrder) {
        throw new OrderNotFoundError(orderId);
      }

      if (input.status !== undefined) {
        const hasValidTransition = validateStatusTransition(existingOrder.status, input.status);
        if (!hasValidTransition) {
          throw new OrderValidationError(
            `Transición de estado inválida de ${existingOrder.status} a ${input.status}`
          );
        }
        existingOrder.status = input.status;
      }

      if (input.customerId !== undefined) {
        existingOrder.customerId = input.customerId;
      }

      if (input.items !== undefined && input.items.length > 0) {
        const itemsToValidate: OrderItem[] = input.items;
        validateOrderItems(itemsToValidate);
        existingOrder.items = itemsToValidate;
        validateTotalCalculation(existingOrder);
      }

      const updatedOrder = await this.orderRepository.update(existingOrder);
      return updatedOrder;
    } catch (error) {
      if (
        error instanceof OrderNotFoundError ||
        error instanceof OrderValidationError
      ) {
        throw error;
      }
      throw new OrderUpdateError(
        `Error al actualizar la orden: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        error instanceof Error ? error : undefined
      );
    }
  }

  async deleteOrder(orderId: string): Promise<void> {
    validateOrderId(orderId);

    try {
      const existingOrder = await this.orderRepository.findById(orderId);

      if (!existingOrder) {
        throw new OrderNotFoundError(orderId);
      }

      await this.orderRepository.delete(orderId);
    } catch (error) {
      if (error instanceof OrderNotFoundError || error instanceof OrderValidationError) {
        throw error;
      }
      throw new OrderDeleteError(
        `Error al eliminar la orden: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        error instanceof Error ? error : undefined
      );
    }
  }

  async getOrdersByCustomer(customerId: string): Promise<Order[]> {
    if (!customerId || customerId.trim().length === 0) {
      throw new OrderValidationError('El ID del cliente es requerido', 'customerId');
    }

    try {
      const orders = await this.orderRepository.findByCustomerId(customerId);
      return orders;
    } catch (error) {
      throw new OrderValidationError(
        `Error al obtener las órdenes del cliente: ${error instanceof Error ? error.message : 'Error desconocido'}`
      );
    }
  }
}

// === ARCHIVO: app/src/infrastructure/controllers/OrderController.ts ===
import { Request, Response, NextFunction, Router } from 'express';
import { CreateOrderDTO } from '../../shared/dto/CreateOrderDTO';
import { UpdateOrderDTO } from '../../shared/dto/UpdateOrderDTO';
import { OrderResponseDTO } from '../../shared/dto/OrderResponseDTO';
import { OrderService, CreateOrderInput, UpdateOrderInput } from '../../application/services/OrderService';
import { OrderError } from '../../shared/errors/OrderError';

interface OrderItemInput {
    productId: string;
    quantity: number;
    name: string;
    price: number;
}

export class OrderController {
    private readonly router: Router;
    private readonly basePath = '/orders';

    constructor(private readonly orderService: OrderService) {
        this.router = Router();
        this.setupRoutes();
    }

    private setupRoutes(): void {
        this.router.post(this.basePath, this.createOrder.bind(this));
        this.router.get(`${this.basePath}/:id`, this.getOrder.bind(this));
        this.router.put(`${this.basePath}/:id`, this.updateOrder.bind(this));
        this.router.delete(`${this.basePath}/:id`, this.deleteOrder.bind(this));
    }

    getRouter(): Router {
        return this.router;
    }

    private mapItemsToOrderInput(items: Array<{ productId?: string; quantity?: number }>): OrderItemInput[] {
        return items.map((item): OrderItemInput => {
            const productId = item.productId ?? '';
            const quantity = item.quantity ?? 1;
            return {
                productId,
                quantity,
                name: productId,
                price: quantity * 100
            };
        });
    }

    async createOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const createOrderDTO: CreateOrderDTO = req.body;
            const input: CreateOrderInput = {
                customerId: createOrderDTO.customerId,
                items: this.mapItemsToOrderInput(createOrderDTO.items || [])
            };
            const order = await this.orderService.createOrder(input);
            const response: OrderResponseDTO = OrderResponseDTO.fromDomain(order);
            res.status(201).json(response.toJSON());
        } catch (error) {
            if (error instanceof OrderError) {
                res.status(500).json({ message: error.message, code: error.code });
                return;
            }
            next(error);
        }
    }

    async getOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const order = await this.orderService.getOrder(id);
            if (!order) {
                res.status(404).json({ message: 'Order not found', code: 'ORDER_NOT_FOUND' });
                return;
            }
            const response: OrderResponseDTO = OrderResponseDTO.fromDomain(order);
            res.status(200).json(response.toJSON());
        } catch (error) {
            if (error instanceof OrderError) {
                res.status(500).json({ message: error.message, code: error.code });
                return;
            }
            next(error);
        }
    }

    async updateOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const updateOrderDTO: UpdateOrderDTO = req.body;
            const input: UpdateOrderInput = {
                customerId: updateOrderDTO.customerId,
                items: updateOrderDTO.items ? this.mapItemsToOrderInput(updateOrderDTO.items) : undefined
            };
            const order = await this.orderService.updateOrder(id, input);
            if (!order) {
                res.status(404).json({ message: 'Order not found', code: 'ORDER_NOT_FOUND' });
                return;
            }
            const response: OrderResponseDTO = OrderResponseDTO.fromDomain(order);
            res.status(200).json(response.toJSON());
        } catch (error) {
            if (error instanceof OrderError) {
                res.status(500).json({ message: error.message, code: error.code });
                return;
            }
            next(error);
        }
    }

    async deleteOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            await this.orderService.deleteOrder(id);
            res.status(204).send();
        } catch (error) {
            if (error instanceof OrderError) {
                res.status(500).json({ message: error.message, code: error.code });
                return;
            }
            next(error);
        }
    }
}

// === ARCHIVO: app/src/infrastructure/config/dynamoConfig.ts ===
import { DynamoDBClient, DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const getClientConfig = (): DynamoDBClientConfig => {
    const region = process.env.AWS_REGION || 'us-east-1';
    const endpoint = process.env.DYNAMODB_ENDPOINT;
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

    const config: DynamoDBClientConfig = { region };

    if (endpoint) {
        config.endpoint = endpoint;
    }

    if (accessKeyId && secretAccessKey) {
        config.credentials = {
            accessKeyId,
            secretAccessKey
        };
    }

    return config;
};

interface DocumentClientConfig {
    client: DynamoDBClient;
    marshallOptions?: {
        removeUndefinedValues?: boolean;
        convertClassInstanceToMap?: boolean;
        convertTopLevelContainer?: boolean;
    };
    unmarshallOptions?: {
        wrapNumbers?: boolean;
    };
}

const getDocumentClientConfig = (client: DynamoDBClient): DocumentClientConfig => {
    return {
        client,
        marshallOptions: {
            removeUndefinedValues: true,
            convertClassInstanceToMap: true
        },
        unmarshallOptions: {
            wrapNumbers: false
        }
    };
};

export const createDynamoDBClient = (): DynamoDBClient => {
    const config = getClientConfig();
    return new DynamoDBClient(config);
};

export const createDocumentClient = (client: DynamoDBClient): DynamoDBDocumentClient => {
    const config = getDocumentClientConfig(client);
    return DynamoDBDocumentClient.from(client, config);
};

export const getTableName = (): string => {
    return process.env.DYNAMODB_TABLE_NAME || 'Orders';
};

export const initializeDynamoDB = (): { documentClient: DynamoDBDocumentClient; tableName: string } => {
    const dbClient = createDynamoDBClient();
    const documentClient = createDocumentClient(dbClient);
    const tableName = getTableName();

    return { documentClient, tableName };
};

// === ARCHIVO: app/src/infrastructure/middlewares/errorHandler.ts ===
import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { OrderError } from '../../shared/errors/OrderError';

export const errorHandler: ErrorRequestHandler = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    console.error(`[ErrorHandler] Error occurred:`, {
        message: error.message,
        stack: error.stack,
        path: req.path,
        method: req.method,
        timestamp: new Date().toISOString()
    });

    if (error instanceof OrderError) {
        res.status(error.statusCode).json({
            message: error.message,
            code: error.code,
            timestamp: new Date().toISOString()
        });
        return;
    }

    if (error.name === 'ValidationError') {
        res.status(400).json({
            message: 'Validation failed',
            code: 'VALIDATION_ERROR',
            details: error.message,
            timestamp: new Date().toISOString()
        });
        return;
    }

    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        res.status(401).json({
            message: 'Unauthorized',
            code: 'AUTH_ERROR',
            timestamp: new Date().toISOString()
        });
        return;
    }

    const errorCode = (error as any).code;
    if (errorCode === 'CONDITIONAL_CHECK_FAILED') {
        res.status(409).json({
            message: 'Resource conflict',
            code: 'CONFLICT',
            timestamp: new Date().toISOString()
        });
        return;
    }

    if (error.name === 'ResourceNotFoundException' || errorCode === 'ResourceNotFoundException') {
        res.status(404).json({
            message: 'Resource not found',
            code: 'NOT_FOUND',
            timestamp: new Date().toISOString()
        });
        return;
    }

    res.status(500).json({
        message: 'Internal server error',
        code: 'INTERNAL_ERROR',
        timestamp: new Date().toISOString()
    });
};

// === ARCHIVO: app/src/infrastructure/middlewares/validationMiddleware.ts ===
import { Request, Response, NextFunction } from 'express';
import { validate, ValidationError } from 'class-validator';
import { OrderError, OrderErrorType } from '../../shared/errors/OrderError';

export function validateDto<T extends object>(dtoClass: new (...args: any[]) => T) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dtoInstance = Object.assign(new dtoClass(), req.body);
      
      const errors: ValidationError[] = await validate(dtoInstance, {
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      });

      if (errors.length > 0) {
        const validationErrors = errors.map((error) => ({
          field: error.property,
          constraints: error.constraints ? Object.values(error.constraints) : [],
        }));

        const error = new OrderError(
          'Validation failed',
          OrderErrorType.VALIDATION_ERROR,
          400,
          validationErrors
        );
        res.status(400).json({
          error: error.message,
          details: error.metadata,
        });
        return;
      }

      req.body = dtoInstance;
      next();
    } catch (err) {
      if (err instanceof OrderError) {
        res.status(400).json({
          error: err.message,
          details: err.metadata,
        });
        return;
      }

      const unexpectedError = new OrderError(
        'An unexpected error occurred during validation',
        OrderErrorType.INTERNAL_ERROR,
        500
      );
      res.status(500).json({
        error: unexpectedError.message,
      });
    }
  };
}

export function validateQueryParams(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { id } = req.params;

  if (!id || typeof id !== 'string' || id.trim().length === 0) {
    const error = new OrderError(
      'Invalid order ID parameter',
      OrderErrorType.VALIDATION_ERROR,
      400
    );
    res.status(400).json({
      error: error.message,
    });
    return;
  }

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id.trim())) {
    const error = new OrderError(
      'Order ID must be a valid UUID',
      OrderErrorType.VALIDATION_ERROR,
      400
    );
    res.status(400).json({
      error: error.message,
    });
    return;
  }

  next();
}

export function validationMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  next();
}

// === ARCHIVO: app/test/application/services/OrderService.test.ts ===
import { OrderService } from '../../../src/application/services/OrderService';
import { OrderRepository } from '../../../src/domain/ports/OrderRepository';
import { Order, OrderStatus, OrderItem } from '../../../src/domain/models/Order';
import { OrderError } from '../../../src/shared/errors/OrderError';

describe('OrderService', () => {
  let orderService: OrderService;
  let mockOrderRepository: jest.Mocked<OrderRepository>;

  const mockOrderItem: OrderItem = {
    productId: 'prod-123',
    productName: 'Test Product',
    quantity: 2,
    unitPrice: 25.00,
  };

  const mockOrderData = {
    customerId: 'cust-456',
    items: [mockOrderItem],
    status: OrderStatus.PENDING,
  };

  beforeEach(() => {
    mockOrderRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByCustomerId: jest.fn(),
    };

    orderService = new OrderService(mockOrderRepository);
  });

  describe('createOrder', () => {
    it('should create an order successfully', async () => {
      const expectedOrder = new Order(
        mockOrderData.customerId,
        mockOrderData.items,
        mockOrderData.status
      );

      mockOrderRepository.create.mockResolvedValue(expectedOrder);

      const result = await orderService.createOrder(
        mockOrderData.customerId,
        mockOrderData.items
      );

      expect(mockOrderRepository.create).toHaveBeenCalledTimes(1);
      expect(result.customerId).toBe(mockOrderData.customerId);
      expect(result.items).toHaveLength(1);
    });

    it('should throw error when items array is empty', async () => {
      await expect(
        orderService.createOrder(mockOrderData.customerId, [])
      ).rejects.toThrow(OrderError);

      expect(mockOrderRepository.create).not.toHaveBeenCalled();
    });

    it('should throw error when customer ID is empty', async () => {
      await expect(
        orderService.createOrder('', mockOrderData.items)
      ).rejects.toThrow(OrderError);

      expect(mockOrderRepository.create).not.toHaveBeenCalled();
    });

    it('should throw error when repository fails', async () => {
      mockOrderRepository.create.mockRejectedValue(
        new Error('DynamoDB connection failed')
      );

      await expect(
        orderService.createOrder(mockOrderData.customerId, mockOrderData.items)
      ).rejects.toThrow(OrderError);
    });
  });

  describe('getOrder', () => {
    it('should return order when found', async () => {
      const expectedOrder = new Order(
        mockOrderData.customerId,
        mockOrderData.items,
        mockOrderData.status
      );

      mockOrderRepository.findById.mockResolvedValue(expectedOrder);

      const result = await orderService.getOrder('order-123');

      expect(mockOrderRepository.findById).toHaveBeenCalledWith('order-123');
      expect(result).toBeDefined();
      expect(result?.customerId).toBe(mockOrderData.customerId);
    });

    it('should return null when order not found', async () => {
      mockOrderRepository.findById.mockResolvedValue(null);

      const result = await orderService.getOrder('non-existent-id');

      expect(result).toBeNull();
    });

    it('should throw error when ID is invalid', async () => {
      await expect(orderService.getOrder('')).rejects.toThrow(OrderError);
      await expect(orderService.getOrder('   ')).rejects.toThrow(OrderError);
    });
  });

  describe('updateOrder', () => {
    it('should update order status successfully', async () => {
      const existingOrder = new Order(
        mockOrderData.customerId,
        mockOrderData.items,
        OrderStatus.PENDING
      );

      const updatedOrder = new Order(
        mockOrderData.customerId,
        mockOrderData.items,
        OrderStatus.CONFIRMED
      );

      mockOrderRepository.findById.mockResolvedValue(existingOrder);
      mockOrderRepository.update.mockResolvedValue(updatedOrder);

      const result = await orderService.updateOrder('order-123', {
        status: OrderStatus.CONFIRMED,
      });

      expect(mockOrderRepository.update).toHaveBeenCalledTimes(1);
      expect(result.status).toBe(OrderStatus.CONFIRMED);
    });

    it('should throw error when order not found', async () => {
      mockOrderRepository.findById.mockResolvedValue(null);

      await expect(
        orderService.updateOrder('non-existent', { status: OrderStatus.CONFIRMED })
      ).rejects.toThrow(OrderError);
    });

    it('should throw error when update data is empty', async () => {
      await expect(
        orderService.updateOrder('order-123', {})
      ).rejects.toThrow(OrderError);
    });
  });

  describe('deleteOrder', () => {
    it('should delete order successfully', async () => {
      const existingOrder = new Order(
        mockOrderData.customerId,
        mockOrderData.items,
        OrderStatus.PENDING
      );

      mockOrderRepository.findById.mockResolvedValue(existingOrder);
      mockOrderRepository.delete.mockResolvedValue();

      await orderService.deleteOrder('order-123');

      expect(mockOrderRepository.delete).toHaveBeenCalledWith('order-123');
    });

    it('should throw error when order not found', async () => {
      mockOrderRepository.findById.mockResolvedValue(null);

      await expect(orderService.deleteOrder('non-existent')).rejects.toThrow(
        OrderError
      );
    });

    it('should throw error when trying to delete cancelled order', async () => {
      const cancelledOrder = new Order(
        mockOrderData.customerId,
        mockOrderData.items,
        OrderStatus.CANCELLED
      );

      mockOrderRepository.findById.mockResolvedValue(cancelledOrder);

      await expect(orderService.deleteOrder('order-123')).rejects.toThrow(
        OrderError
      );
    });
  });

  describe('getOrdersByCustomer', () => {
    it('should return orders for a customer', async () => {
      const orders = [
        new Order(mockOrderData.customerId, [mockOrderItem], OrderStatus.PENDING),
        new Order(mockOrderData.customerId, [mockOrderItem], OrderStatus.CONFIRMED),
      ];

      mockOrderRepository.findByCustomerId.mockResolvedValue(orders);

      const result = await orderService.getOrdersByCustomer('cust-456');

      expect(mockOrderRepository.findByCustomerId).toHaveBeenCalledWith('cust-456');
      expect(result).toHaveLength(2);
    });

    it('should return empty array when customer has no orders', async () => {
      mockOrderRepository.findByCustomerId.mockResolvedValue([]);

      const result = await orderService.getOrdersByCustomer('cust-456');

      expect(result).toHaveLength(0);
    });
  });
});

// === ARCHIVO: app/test/infrastructure/controllers/OrderController.test.ts ===
import request from 'supertest';
import express, { Express } from 'express';
import { OrderController } from '../../../src/infrastructure/controllers/OrderController';
import { OrderService } from '../../../src/application/services/OrderService';
import { OrderRepository } from '../../../src/domain/ports/OrderRepository';
import { Order, OrderStatus, OrderItem } from '../../../src/domain/models/Order';
import { validateDto, validateQueryParams } from '../../../src/infrastructure/middlewares/validationMiddleware';
import { errorHandler } from '../../../src/infrastructure/middlewares/errorHandler';
import { CreateOrderDTO } from '../../../src/shared/dto/CreateOrderDTO';
import { UpdateOrderDTO } from '../../../src/shared/dto/UpdateOrderDTO';

describe('OrderController', () => {
  let app: Express;
  let mockOrderService: jest.Mocked<OrderService>;
  let mockOrderRepository: jest.Mocked<OrderRepository>;

  const mockOrderItem: OrderItem = {
    productId: 'prod-123',
    productName: 'Test Product',
    quantity: 2,
    unitPrice: 25.00,
  };

  const mockOrder = new Order('cust-456', [mockOrderItem], OrderStatus.PENDING);

  beforeAll(() => {
    mockOrderRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByCustomerId: jest.fn(),
    };

    mockOrderService = {
      createOrder: jest.fn(),
      getOrder: jest.fn(),
      updateOrder: jest.fn(),
      deleteOrder: jest.fn(),
      getOrdersByCustomer: jest.fn(),
    } as unknown as jest.Mocked<OrderService>;
  });

  beforeEach(() => {
    app = express();
    app.use(express.json());

    const controller = new OrderController(mockOrderService);

    app.post(
      '/orders',
      validateDto(CreateOrderDTO),
      (req, res, next) => controller.createOrder(req, res, next)
    );
    app.get(
      '/orders/:id',
      validateQueryParams,
      (req, res, next) => controller.getOrder(req, res, next)
    );
    app.put(
      '/orders/:id',
      validateQueryParams,
      validateDto(UpdateOrderDTO),
      (req, res, next) => controller.updateOrder(req, res, next)
    );
    app.delete(
      '/orders/:id',
      validateQueryParams,
      (req, res, next) => controller.deleteOrder(req, res, next)
    );

    app.use(errorHandler);
  });

  describe('POST /orders', () => {
    it('should create order successfully', async () => {
      mockOrderService.createOrder.mockResolvedValue(mockOrder);

      const response = await request(app)
        .post('/orders')
        .send({
          customerId: 'cust-456',
          items: [mockOrderItem],
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.customerId).toBe('cust-456');
    });

    it('should return 400 for invalid request body', async () => {
      const response = await request(app)
        .post('/orders')
        .send({
          customerId: '',
          items: [],
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 when customerId is missing', async () => {
      const response = await request(app)
        .post('/orders')
        .send({
          items: [mockOrderItem],
        });

      expect(response.status).toBe(400);
    });

    it('should return 400 when items array is empty', async () => {
      const response = await request(app)
        .post('/orders')
        .send({
          customerId: 'cust-456',
          items: [],
        });

      expect(response.status).toBe(400);
    });

    it('should return 500 when service throws error', async () => {
      mockOrderService.createOrder.mockRejectedValue(
        new Error('Database error')
      );

      const response = await request(app)
        .post('/orders')
        .send({
          customerId: 'cust-456',
          items: [mockOrderItem],
        });

      expect(response.status).toBe(500);
    });
  });

  describe('GET /orders/:id', () => {
    it('should return order when found', async () => {
      mockOrderService.getOrder.mockResolvedValue(mockOrder);

      const response = await request(app).get('/orders/550e8400-e29b-41d4-a716-446655440000');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body.customerId).toBe('cust-456');
    });

    it('should return 404 when order not found', async () => {
      mockOrderService.getOrder.mockResolvedValue(null);

      const response = await request(app).get('/orders/550e8400-e29b-41d4-a716-446655440000');

      expect(response.status).toBe(404);
    });

    it('should return 400 for invalid UUID format', async () => {
      const response = await request(app).get('/orders/invalid-id');

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('UUID');
    });

    it('should return 500 when service throws error', async () => {
      mockOrderService.getOrder.mockRejectedValue(new Error('DB error'));

      const response = await request(app).get('/orders/550e8400-e29b-41d4-a716-446655440000');

      expect(response.status).toBe(500);
    });
  });

  describe('PUT /orders/:id', () => {
    it('should update order successfully', async () => {
      const updatedOrder = new Order('cust-456', [mockOrderItem], OrderStatus.CONFIRMED);
      mockOrderService.updateOrder.mockResolvedValue(updatedOrder);

      const response = await request(app)
        .put('/orders/550e8400-e29b-41d4-a716-446655440000')
        .send({
          status: OrderStatus.CONFIRMED,
        });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('CONFIRMED');
    });

    it('should return 404 when order not found', async () => {
      mockOrderService.updateOrder.mockResolvedValue(null as any);

      const response = await request(app)
        .put('/orders/550e8400-e29b-41d4-a716-446655440000')
        .send({
          status: OrderStatus.CONFIRMED,
        });

      expect(response.status).toBe(404);
    });

    it('should return 400 for empty update data', async () => {
      const response = await request(app)
        .put('/orders/550e8400-e29b-41d4-a716-446655440000')
        .send({});

      expect(response.status).toBe(400);
    });

    it('should return 400 for invalid UUID', async () => {
      const response = await request(app)
        .put('/orders/invalid-uuid')
        .send({
          status: OrderStatus.CONFIRMED,
        });

      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /orders/:id', () => {
    it('should delete order successfully', async () => {
      mockOrderService.deleteOrder.mockResolvedValue();

      const response = await request(app).delete('/orders/550e8400-e29b-41d4-a716-446655440000');

      expect(response.status).toBe(204);
    });

    it('should return 404 when order not found', async () => {
      mockOrderService.deleteOrder.mockRejectedValue(
        Object.assign(new Error('Not found'), { type: 'NOT_FOUND' })
      );

      const response = await request(app).delete('/orders/550e8400-e29b-41d4-a716-446655440000');

      expect(response.status).toBe(404);
    });

    it('should return 400 for invalid UUID', async () => {
      const response = await request(app).delete('/orders/bad-id');

      expect(response.status).toBe(400);
    });

    it('should return 500 when service throws unexpected error', async () => {
      mockOrderService.deleteOrder.mockRejectedValue(new Error('DB failure'));

      const response = await request(app).delete('/orders/550e8400-e29b-41d4-a716-446655440000');

      expect(response.status).toBe(500);
    });
  });

  describe('Error handling', () => {
    it('should handle validation errors from DTO middleware', async () => {
      const response = await request(app)
        .post('/orders')
        .send({
          customerId: 'valid-customer-id',
          items: [
            {
              productId: 'prod-1',
              productName: 'Product 1',
              quantity: 1,
              unitPrice: 10,
            },
          ],
        });

      expect(response.status).not.toBe(500);
    });

    it('should handle malformed JSON', async () => {
      const response = await request(app)
        .post('/orders')
        .set('Content-Type', 'application/json')
        .send('{ invalid json }');

      expect(response.status).toBe(400);
    });
  });
});

// === ARCHIVO: infra/providers.tf ===
# Configuración del provider AWS para Terraform
# Este archivo define la versión del provider y la región donde se desplegarán los recursos.
# Además, incluye configuraciones adicionales para mejorar la experiencia de desarrollo
# como el uso de endpoints locales cuando se trabaja con LocalStack.

# Configuración principal del provider AWS
provider "aws" {
  region = var.aws_region

  # Configuración para permitir el uso de LocalStack en desarrollo
  # LocalStack simula los servicios AWS localmente, evitando costos y acelerando el desarrollo
  dynamic "endpoints" {
    for_each = var.localstack_endpoints_enabled ? [1] : []
    content {
      dynamodb = "http://localhost:4566"
      s3       = "http://localhost:4566"
      lambda   = "http://localhost:4566"
      sns      = "http://localhost:4566"
      sqs      = "http://localhost:4566"
    }
  }

  # Configuración para evitar la validación de certificados SSL cuando se usa LocalStack
  skip_credentials_validation = var.localstack_endpoints_enabled
  skip_requesting_account_id  = var.localstack_endpoints_enabled
  skip_metadata_api_check     = var.localstack_endpoints_enabled
}

# Variables utilizadas en la configuración del provider
variable "aws_region" {
  description = "Región de AWS donde se desplegarán los recursos"
  type        = string
  default     = "us-east-1"
}

variable "localstack_endpoints_enabled" {
  description = "Indica si se deben usar endpoints de LocalStack para desarrollo local"
  type        = bool
  default     = false
}

variable "environment" {
  description = "Nombre del entorno (dev, staging, prod)"
  type        = string
  default     = "dev"

  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "El entorno debe ser uno de: dev, staging, prod."
  }
}

variable "tags" {
  description = "Etiquetas aplicadas a todos los recursos"
  type        = map(string)
  default     = {}
}

// === ARCHIVO: infra/variables.tf ===
# Variables globales para la configuración de la infraestructura
# Estas variables permiten parametrizar la configuración de los recursos
# como la tabla DynamoDB, facilitando la reutilización y el despliegue en diferentes entornos.

# Variables de configuración general
variable "project_name" {
  description = "Nombre del proyecto para prefijar recursos"
  type        = string
  default     = "orders-system"
}

# Variables específicas para la tabla DynamoDB
variable "dynamodb_table_name" {
  description = "Nombre de la tabla DynamoDB para órdenes"
  type        = string
  default     = "orders"
}

variable "dynamodb_billing_mode" {
  description = "Modo de facturación para la tabla DynamoDB (PROVISIONED o PAY_PER_REQUEST)"
  type        = string
  default     = "PAY_PER_REQUEST"

  validation {
    condition     = contains(["PROVISIONED", "PAY_PER_REQUEST"], var.dynamodb_billing_mode)
    error_message = "El modo de facturación debe ser PROVISIONED o PAY_PER_REQUEST."
  }
}

variable "dynamodb_read_capacity" {
  description = "Capacidad de lectura provisionada (solo aplicable si billing_mode es PROVISIONED)"
  type        = number
  default     = 5
}

variable "dynamodb_write_capacity" {
  description = "Capacidad de escritura provisionada (solo aplicable si billing_mode es PROVISIONED)"
  type        = number
  default     = 5
}

variable "dynamodb_hash_key" {
  description = "Nombre del atributo clave hash (partition key)"
  type        = string
  default     = "order_id"
}

variable "dynamodb_range_key" {
  description = "Nombre del atributo clave range (sort key), si aplica"
  type        = string
  default     = null
}

variable "dynamodb_attributes" {
  description = "Lista de atributos de la tabla DynamoDB"
  type = list(object({
    name = string
    type = string
  }))
  default = [
    {
      name = "order_id"
      type = "S"
    },
    {
      name = "customer_id"
      type = "S"
    },
    {
      name = "order_date"
      type = "S"
    },
    {
      name = "status"
      type = "S"
    },
    {
      name = "total_amount"
      type = "N"
    }
  ]
}

variable "dynamodb_global_secondary_indexes" {
  description = "Lista de índices secundarios globales para la tabla"
  type = list(object({
    name            = string
    hash_key        = string
    range_key       = string
    projection_type = string
    read_capacity   = number
    write_capacity  = number
  }))
  default = [
    {
      name            = "customer_index"
      hash_key        = "customer_id"
      range_key       = "order_date"
      projection_type = "INCLUDE"
      read_capacity   = 5
      write_capacity  = 5
    }
  ]
}

variable "dynamodb_ttl_attribute" {
  description = "Nombre del atributo que almacena el TTL para expirar items"
  type        = string
  default     = null
}

variable "dynamodb_stream_enabled" {
  description = "Indica si se habilita el stream para la tabla"
  type        = bool
  default     = false
}

variable "dynamodb_stream_view_type" {
  description = "Tipo de vista del stream (KEYS_ONLY, NEW_IMAGE, OLD_IMAGE, NEW_AND_OLD_IMAGES)"
  type        = string
  default     = null

  validation {
    condition     = var.dynamodb_stream_enabled ? contains(["KEYS_ONLY", "NEW_IMAGE", "OLD_IMAGE", "NEW_AND_OLD_IMAGES"], var.dynamodb_stream_view_type) : true
    error_message = "El tipo de vista del stream debe ser KEYS_ONLY, NEW_IMAGE, OLD_IMAGE o NEW_AND_OLD_IMAGES."
  }
}

// === ARCHIVO: infra/modules/dynamodb/variables.tf ===
# Variables para el módulo de DynamoDB
# Estas variables permiten configurar la tabla DynamoDB de acuerdo a los requisitos del dominio,
# incluyendo esquemas de particionamiento, índices secundarios y capacidades provisionadas.

variable "table_name" {
  description = "Nombre de la tabla DynamoDB"
  type        = string
}

variable "billing_mode" {
  description = "Modo de facturación para la tabla DynamoDB (PROVISIONED o PAY_PER_REQUEST)"
  type        = string
  default     = "PAY_PER_REQUEST"

  validation {
    condition     = contains(["PROVISIONED", "PAY_PER_REQUEST"], var.billing_mode)
    error_message = "El modo de facturación debe ser PROVISIONED o PAY_PER_REQUEST."
  }
}

variable "read_capacity" {
  description = "Capacidad de lectura provisionada (solo aplicable si billing_mode es PROVISIONED)"
  type        = number
  default     = 5
}

variable "write_capacity" {
  description = "Capacidad de escritura provisionada (solo aplicable si billing_mode es PROVISIONED)"
  type        = number
  default     = 5
}

variable "hash_key" {
  description = "Nombre del atributo clave hash (partition key)"
  type        = string
}

variable "range_key" {
  description = "Nombre del atributo clave range (sort key), si aplica"
  type        = string
  default     = null
}

variable "attributes" {
  description = "Lista de atributos de la tabla DynamoDB"
  type = list(object({
    name = string
    type = string
  }))
}

variable "global_secondary_indexes" {
  description = "Lista de índices secundarios globales para la tabla"
  type = list(object({
    name            = string
    hash_key        = string
    range_key       = string
    projection_type = string
    read_capacity   = number
    write_capacity  = number
  }))
  default = []
}

variable "ttl_attribute" {
  description = "Nombre del atributo que almacena el TTL para expirar items"
  type        = string
  default     = null
}

variable "stream_enabled" {
  description = "Indica si se habilita el stream para la tabla"
  type        = bool
  default     = false
}

variable "stream_view_type" {
  description = "Tipo de vista del stream (KEYS_ONLY, NEW_IMAGE, OLD_IMAGE, NEW_AND_OLD_IMAGES)"
  type        = string
  default     = null
}

variable "tags" {
  description = "Tags para la tabla DynamoDB"
  type        = map(string)
  default     = {}
}

variable "project_name" {
  description = "Nombre del proyecto para prefijar recursos"
  type        = string
}

// === ARCHIVO: infra/versions.tf ===
terraform {
  required_version = ">= 1.8.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.55.0"
    }
  }
}

// Configuración del provider AWS que se utilizará en todos los recursos
provider "aws" {
  region = var.aws_region

  // Configuración para manejo de credenciales mediante variables de entorno
  // o perfil de AWS configurado localmente
  skip_credentials_validation = false
  skip_requesting_account_id  = false
  skip_metadata_api_check     = true
}

// Configuración de aliases para múltiples regiones si es necesario
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"
}

// === ARCHIVO: infra/README.md ===
# Módulo de Infraestructura AWS

Este directorio contiene la configuración de infraestructura como código utilizando Terraform para el sistema de gestión de órdenes. El módulo implementa recursos de AWS necesarios para persistir y gestionar órdenes en DynamoDB, con soporte opcional para notificaciones y logging.

## Estructura del Módulo

```
infra/
├── versions.tf          # Configuración de versiones de Terraform y providers
├── main.tf              # Configuración principal y composición de recursos
├── variables.tf         # Definición de variables de entrada del módulo raíz
├── outputs.tf           # Definición de outputs del módulo raíz
├── providers.tf         # Configuración de providers del módulo raíz
├── environments/
│   └── dev/
│       └── terraform.tfvars  # Variables específicas del entorno dev
└── modules/
    └── dynamodb/
        ├── main.tf      # Definición de la tabla DynamoDB
        ├── variables.tf# Variables específicas del módulo DynamoDB
        └── outputs.tf  # Outputs del módulo DynamoDB
```

## Recursos Definidos

El módulo crea y configura los siguientes recursos de AWS:

- **Tabla DynamoDB**: Almacena las órdenes del sistema con atributos para id, cliente, productos, total, estado y timestamps. Soporta claves de partición y ordenamiento, índices secundarios globales, y TTL configurable.
- **Provider AWS**: Configurado para la región especificada en variables de entorno.
- **S3 Bucket de Logs**: Almacenamiento de logs de la aplicación cuando está habilitado mediante variable.
- **SNS Topic**: Notificaciones de eventos de órdenes cuando está habilitado mediante variable.
- **DynamoDB Streams**: Captura de cambios en la tabla para procesamiento de eventos.

## Uso del Módulo

Para inicializar y aplicar la configuración en el entorno de desarrollo:

```bash
cd environments/dev
terraform init
terraform plan
terraform apply
```

Para destruir los recursos cuando ya no sean necesarios:

```bash
terraform destroy
```

## Validación Local

Para validar la configuración de Terraform antes de aplicar:

```bash
terraform validate
terraform fmt -check
terraform fmt
```

Para ver el plan de cambios sin aplicar:

```bash
terraform plan -out=tfplan
terraform show tfplan
```

## Variables Requeridas

Las siguientes variables deben definirse en el archivo terraform.tfvars del entorno:

- `aws_region`: Región de AWS donde se crearán los recursos (ej. us-east-1)
- `environment`: Nombre del entorno (dev, staging, prod)
- `table_name`: Nombre de la tabla DynamoDB
- `dynamodb_read_capacity`: Capacidad de lectura para modo PROVISIONED
- `dynamodb_write_capacity`: Capacidad de escritura para modo PROVISIONED
- `dynamodb_billing_mode`: Modo de facturación (PAY_PER_REQUEST o PROVISIONED)
- `common_tags`: Tags comunes para todos los recursos en formato map
- `enable_logging`: Habilitar bucket de logs S3 (true/false)
- `enable_event_notifications`: Habilitar SNS para eventos (true/false)
- `enable_dynamodb_streams`: Habilitar DynamoDB Streams (true/false)

## Variables Opcionales

El módulo DynamoDB acepta las siguientes variables opcionales:

- `hash_key`: Nombre del atributo de clave de partición (default: "id")
- `range_key`: Nombre del atributo de clave de ordenamiento (opcional)
- `global_secondary_indexes`: Lista de índices secundarios globales
- `ttl_attribute`: Nombre del atributo TTL para expiración automática
- `stream_view_type`: Tipo de vista del stream (KEYS_ONLY, NEW_IMAGE, OLD_IMAGE, NEW_AND_OLD_IMAGES)

## Outputs

El módulo expone los siguientes outputs para consumo por otros módulos o aplicaciones:

- `dynamodb_table_info`: Información de la tabla DynamoDB incluyendo nombre, ARN y stream ARN
- `sns_topic_arn`: ARN del topic SNS para eventos de órdenes
- `aws_account_info`: Información de la cuenta AWS (account_id, región)
- `s3_bucket_name`: Nombre del bucket S3 de logs (si está habilitado)

## Consideraciones de Seguridad

- La tabla DynamoDB utiliza cifrado por defecto con AWS managed keys (AWSOwned key)
- Para mayor seguridad en producción, considerar usar AWS KMS customer managed keys
- Habilitar `enable_deletion_protection` en entornos de producción para prevenir eliminaciones accidentales
- Usar IAM roles con menores privilegios para el acceso a recursos
- Los logs en S3 deben tener Lifecycle rules configuradas para retención adecuada
- Configurar políticas de acceso restrictivas en el bucket de logs
- Para SNS, configurar políticas de suscripción apropiadas y protección contra spam

## Consideraciones de Rendimiento

- Para cargas de trabajo altas, considerar usar PAY_PER_REQUEST en lugar de PROVISIONED
- Los índices secundarios globales incurren en costos adicionales de almacenamiento y capacidad
- DynamoDB Streams tiene costos por cada millón de eventos procesados
- Monitorear ConsumedCapacityUnits para optimizar capacidad provisionada

## Manejo de Estados

Terraform guarda el estado de la infraestructura en archivos local o en backend remoto. Para este módulo se recomienda usar un backend remoto con estado bloqueante para evitar conflictos en entornos con múltiples usuarios.

## Notas de Desarrollo

Este módulo forma parte de un sistema mayor de gestión de órdenes y está diseñado para integrarse con la API REST que consume los endpoints CRUD sobre la tabla DynamoDB. La configuración del módulo permite ajustar parámetros de capacidad y características según las necesidades del entorno de despliegue.

// === ARCHIVO: infra/main.tf ===
# Configuración principal de infraestructura para el sistema de órdenes
# Este archivo composes los módulos y recursos necesarios para la API

# Módulo principal de DynamoDB para persistencia de órdenes
module "dynamodb_orders" {
  source = "./modules/dynamodb"

  # Nombre de la tabla derivado del entorno y contexto
  table_name = var.table_name != "" ? var.table_name : "orders-${var.environment}"

  # Configuración de capacidad read/write
  read_capacity  = var.dynamodb_read_capacity
  write_capacity = var.dynamodb_write_capacity

  # Habilitar modo serverless si está disponible y configurado
  billing_mode = var.dynamodb_billing_mode

  # Configuración de clave de ordenación
  sort_key_name = var.sort_key_name
  sort_key_type = var.sort_key_type

  # Etiquetas para identificación y costos
  tags = merge(
    var.common_tags,
    {
      Environment = var.environment
      ManagedBy   = "terraform"
      Project     = "orders-system"
      Component   = "database"
    }
  )
}

# Recurso adicional para bucket S3 de logs si está habilitado
resource "aws_s3_bucket" "logs" {
  count = var.enable_logging ? 1 : 0

  bucket = "orders-${var.environment}-logs-${data.aws_caller_identity.current.account_id}"

  tags = merge(
    var.common_tags,
    {
      Environment = var.environment
      ManagedBy   = "terraform"
      Project     = "orders-system"
      Component   = "logging"
    }
  )
}

# Configuración de lifecycle para el bucket de logs
resource "aws_s3_bucket_versioning" "logs" {
  count = var.enable_logging ? 1 : 0

  bucket = aws_s3_bucket.logs[0].id

  versioning_configuration {
    status = "Enabled"
  }
}

# Obtención de información de la cuenta actual para construcción de ARNs
data "aws_caller_identity" "current" {}

# Obtención de la región actual de AWS
data "aws_region" "current" {}

# Recurso de SNS para notificaciones de eventos de órdenes
resource "aws_sns_topic" "orders_events" {
  count = var.enable_event_notifications ? 1 : 0

  name = "orders-${var.environment}-events"

  tags = merge(
    var.common_tags,
    {
      Environment = var.environment
      ManagedBy   = "terraform"
      Project     = "orders-system"
      Component   = "messaging"
    }
  )
}

# Política de acceso al topic de SNS
resource "aws_sns_topic_policy" "orders_events" {
  count = var.enable_event_notifications ? 1 : 0

  arn = aws_sns_topic.orders_events[0].arn

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "dynamodb.amazonaws.com"
        }
        Action   = "sns:Publish"
        Resource = aws_sns_topic.orders_events[0].arn
        Condition = {
          ArnLike = {
            "aws:SourceArn" = module.dynamodb_orders.table_arn
          }
        }
      }
    ]
  })
}

# Output que expone la información de la tabla DynamoDB para otros módulos
output "dynamodb_table_info" {
  description = "Información de la tabla DynamoDB de órdenes"
  value = {
    name       = module.dynamodb_orders.table_name
    arn        = module.dynamodb_orders.table_arn
    stream_arn = var.enable_dynamodb_streams ? module.dynamodb_orders.stream_arn : null
  }
}

# Output que expone el topic de SNS para notificaciones
output "sns_topic_arn" {
  description = "ARN del topic SNS para eventos de órdenes"
  value       = var.enable_event_notifications ? aws_sns_topic.orders_events[0].arn : null
}

# Output con información de la cuenta y región
output "aws_account_info" {
  description = "Información de la cuenta AWS"
  value = {
    account_id = data.aws_caller_identity.current.account_id
    region     = data.aws_region.current.name
  }
}

// === ARCHIVO: infra/outputs.tf ===
# Outputs de la infraestructura
# Exponen información relevante sobre los recursos creados para su consumo

output "dynamodb_table_name" {
  description = "Nombre de la tabla de órdenes en DynamoDB"
  value       = module.dynamodb.orders_table_name
}

output "dynamodb_table_arn" {
  description = "ARN de la tabla de órdenes en DynamoDB"
  value       = module.dynamodb.orders_table_arn
}

output "dynamodb_table_endpoint" {
  description = "Endpoint de la tabla de órdenes en DynamoDB"
  value       = "https://dynamodb.${var.aws_region}.amazonaws.com"
}

output "dynamodb_partition_key" {
  description = "Nombre de la clave de partición de la tabla"
  value       = module.dynamodb.partition_key_name
}

output "dynamodb_sort_key" {
  description = "Nombre de la clave de ordenación de la tabla"
  value       = module.dynamodb.sort_key_name
}

output "environment" {
  description = "Nombre del entorno desplegado"
  value       = var.environment
}

output "table_status" {
  description = "Estado actual de la tabla DynamoDB"
  value       = module.dynamodb.orders_table_status
}

output "tags_applied" {
  description = "Etiquetas aplicadas a los recursos"
  value       = var.tags
}

// === ARCHIVO: infra/environments/dev/terraform.tfvars ===
# Variables específicas para el entorno de desarrollo
# Estas variables configuran la infraestructura para el ambiente dev

environment = "dev"

# Configuración de la tabla DynamoDB
table_name         = "orders-dev"
billing_mode       = "PAY_PER_REQUEST"
partition_key_name = "orderId"
partition_key_type = "S"
sort_key_name      = "createdAt"
sort_key_type      = "S"

# Habilitar eliminación suave (Soft Delete)
enable_deletion_protection = false

# Configuración de capacidad (para billing mode PROVISIONED)
dynamodb_read_capacity  = 5
dynamodb_write_capacity = 5

# Configuración de TTL
enable_ttl    = true
ttl_attribute = "expiresAt"

# Región y perfil de AWS
aws_region  = "us-east-1"
aws_profile = "default"

# Tags para identificación
common_tags = {
  Environment = "dev"
  Project     = "orders-crud"
  ManagedBy   = "terraform"
  CostCenter  = "engineering"
  Owner       = "dev-team"
}

# Habilitar características opcionales
enable_logging             = false
enable_event_notifications = false
enable_dynamodb_streams    = false

# Configuración de servidor local (para desarrollo sin AWS)
use_local_stack      = false
local_stack_endpoint = "http://localhost:8000"

// === ARCHIVO: infra/modules/dynamodb/main.tf ===
# Módulo de Terraform para crear la tabla DynamoDB de órdenes
# Este módulo crea una tabla DynamoDB optimizada para operaciones CRUD
# de órdenes con soporte para múltiples patrones de acceso

# Recurso principal: tabla DynamoDB para almacenar órdenes
resource "aws_dynamodb_table" "orders" {
  name         = var.table_name
  billing_mode = var.billing_mode
  hash_key     = var.hash_key_attribute
  range_key    = var.range_key_attribute != null ? var.range_key_attribute : null

  # Configuración de capacidad bajo demanda para escalar automáticamente
  dynamic "attribute" {
    for_each = var.attributes
    content {
      name = attribute.value.name
      type = attribute.value.type
    }
  }

  # Configuración de lectura/escritura según el modo de facturación
  dynamic "server_side_encryption" {
    for_each = var.server_side_encryption ? [1] : []
    content {
      enabled     = true
      kms_key_arn = var.kms_key_arn
    }
  }

  # Configuración de TTL para limpieza automática de datos si está habilitado
  dynamic "ttl" {
    for_each = var.ttl_attribute != null ? [var.ttl_attribute] : []
    content {
      attribute_name = ttl
      enabled        = true
    }
  }

  # Configuración de etiquetas para identificación y costeo
  tags = merge(
    var.common_tags,
    {
      Name        = var.table_name
      Environment = var.environment
      ManagedBy   = "terraform"
      Module      = "dynamodb-orders"
    }
  )

  # Habilitar flujos de DynamoDB para	eventos de cambio de datos
  stream_enabled   = var.enable_streams
  stream_view_type = var.enable_streams ? var.stream_view_type : null

  # Timeouts para operaciones de creación y actualización
  timeouts {
    create = var.create_timeout
    update = var.update_timeout
    delete = var.delete_timeout
  }
}

# Recurso opcional: índice secundario global para consultas por cliente
resource "aws_dynamodb_table" "orders_customer_gsi" {
  count        = var.enable_customer_gsi ? 1 : 0
  name         = "${var.table_name}-by-customer"
  billing_mode = var.billing_mode
  hash_key     = var.customer_gsi_hash_key
  range_key    = var.customer_gsi_range_key != null ? var.customer_gsi_range_key : null

  attribute {
    name = var.customer_gsi_hash_key
    type = "S"
  }

  dynamic "attribute" {
    for_each = var.customer_gsi_range_key != null ? [1] : []
    content {
      name = var.customer_gsi_range_key
      type = "S"
    }
  }

  global_secondary_index {
    name            = "by-customer-index"
    hash_key        = var.customer_gsi_hash_key
    range_key       = var.customer_gsi_range_key
    projection_type = "ALL"
    read_capacity   = var.billing_mode == "PROVISIONED" ? var.gsi_read_capacity : null
    write_capacity  = var.billing_mode == "PROVISIONED" ? var.gsi_write_capacity : null
  }

  tags = merge(
    var.common_tags,
    {
      Name        = "${var.table_name}-by-customer"
      Environment = var.environment
      ManagedBy   = "terraform"
      Module      = "dynamodb-orders-gsi"
    }
  )

  timeouts {
    create = var.create_timeout
    update = var.update_timeout
    delete = var.delete_timeout
  }
}

# Recurso opcional: índice secundario global para consultas por fecha/estado
resource "aws_dynamodb_table" "orders_status_gsi" {
  count        = var.enable_status_gsi ? 1 : 0
  name         = "${var.table_name}-by-status"
  billing_mode = var.billing_mode
  hash_key     = var.status_gsi_hash_key
  range_key    = var.status_gsi_range_key != null ? var.status_gsi_range_key : null

  attribute {
    name = var.status_gsi_hash_key
    type = "S"
  }

  dynamic "attribute" {
    for_each = var.status_gsi_range_key != null ? [1] : []
    content {
      name = var.status_gsi_range_key
      type = "S"
    }
  }

  global_secondary_index {
    name            = "by-status-index"
    hash_key        = var.status_gsi_hash_key
    range_key       = var.status_gsi_range_key
    projection_type = "ALL"
    read_capacity   = var.billing_mode == "PROVISIONED" ? var.gsi_read_capacity : null
    write_capacity  = var.billing_mode == "PROVISIONED" ? var.gsi_write_capacity : null
  }

  tags = merge(
    var.common_tags,
    {
      Name        = "${var.table_name}-by-status"
      Environment = var.environment
      ManagedBy   = "terraform"
      Module      = "dynamodb-orders-status-gsi"
    }
  )

  timeouts {
    create = var.create_timeout
    update = var.update_timeout
    delete = var.delete_timeout
  }
}

# Recurso: Política de acceso IAM para la tabla DynamoDB
# Esta política permite las operaciones CRUD básicas sobre la tabla
resource "aws_iam_policy" "dynamodb_access" {
  name        = "${var.table_name}-access-policy"
  description = "Política de acceso para operaciones CRUD en la tabla de órdenes"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "dynamodb:PutItem",
          "dynamodb:GetItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:Query",
          "dynamodb:Scan"
        ]
        Resource = [
          aws_dynamodb_table.orders.arn,
          "${aws_dynamodb_table.orders.arn}/index/*"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "dynamodb:ListTables",
          "dynamodb:DescribeTable"
        ]
        Resource = "*"
      }
    ]
  })

  tags = merge(
    var.common_tags,
    {
      Name = "${var.table_name}-access"
    }
  )
}

// === ARCHIVO: infra/modules/dynamodb/outputs.tf ===
# Outputs del módulo DynamoDB
# Exponen la información necesaria para que otros módulos y recursos
# puedan interactuar con la tabla de órdenes

# Nombre de la tabla DynamoDB principal
output "table_name" {
  description = "Nombre de la tabla DynamoDB de órdenes"
  value       = aws_dynamodb_table.orders.name
}

# ARN de la tabla DynamoDB principal
output "table_arn" {
  description = "ARN de la tabla DynamoDB de órdenes"
  value       = aws_dynamodb_table.orders.arn
}

# ID de la tabla DynamoDB
output "table_id" {
  description = "ID de la tabla DynamoDB de órdenes"
  value       = aws_dynamodb_table.orders.id
}

# Nombre del índice GSI de cliente (si está habilitado)
output "customer_gsi_name" {
  description = "Nombre del índice secundario global por cliente"
  value       = var.enable_customer_gsi ? aws_dynamodb_table.orders_customer_gsi[0].name : null
}

# ARN del índice GSI de cliente (si está habilitado)
output "customer_gsi_arn" {
  description = "ARN del índice secundario global por cliente"
  value       = var.enable_customer_gsi ? aws_dynamodb_table.orders_customer_gsi[0].arn : null
}

# Nombre del índice GSI de estado (si está habilitado)
output "status_gsi_name" {
  description = "Nombre del índice secundario global por estado"
  value       = var.enable_status_gsi ? aws_dynamodb_table.orders_status_gsi[0].name : null
}

# ARN del índice GSI de estado (si está habilitado)
output "status_gsi_arn" {
  description = "ARN del índice secundario global por estado"
  value       = var.enable_status_gsi ? aws_dynamodb_table.orders_status_gsi[0].arn : null
}

# ARN de la política IAM de acceso a la tabla
output "iam_policy_arn" {
  description = "ARN de la política IAM de acceso a la tabla"
  value       = aws_iam_policy.dynamodb_access.arn
}

# ID de la política IAM de acceso a la tabla
output "iam_policy_id" {
  description = "ID de la política IAM de acceso a la tabla"
  value       = aws_iam_policy.dynamodb_access.id
}

# Modo de facturación configurado
output "billing_mode" {
  description = "Modo de facturación de la tabla (PROVISIONED o PAY_PER_REQUEST)"
  value       = aws_dynamodb_table.orders.billing_mode
}

# Estado del stream de DynamoDB
output "stream_enabled" {
  description = "Indica si los streams de DynamoDB están habilitados"
  value       = aws_dynamodb_table.orders.stream_enabled
}

# Tipo de vista del stream (si está habilitado)
output "stream_view_type" {
  description = "Tipo de vista del stream de DynamoDB"
  value       = aws_dynamodb_table.orders.stream_view_type
}

# Atributos de la tabla
output "table_attributes" {
  description = "Mapa de atributos de la tabla DynamoDB"
  value       = { for attr in aws_dynamodb_table.orders.attribute : attr.name => attr.type }
}

# Clave primaria de la tabla
output "primary_key" {
  description = "Información de la clave primaria de la tabla"
  value = {
    hash_key  = aws_dynamodb_table.orders.hash_key
    range_key = aws_dynamodb_table.orders.range_key
  }
}

# Tags aplicados a la tabla
output "table_tags" {
  description = "Etiquetas aplicadas a la tabla DynamoDB"
  value       = aws_dynamodb_table.orders.tags
}

// === ARCHIVO: docker-compose.yml ===
# Infraestructura local del reto. SOLO desarrollo: credenciales de ejemplo (local-dev-only), puertos en loopback.
# Levantar: docker compose up -d --wait
name: infra-local
services:
  dynamodb-local:
    image: "amazon/dynamodb-local:2.5.2"
    command: ["-jar","DynamoDBLocal.jar","-sharedDb","-inMemory"]
    ports:
      - "127.0.0.1:8000:8000"
    healthcheck:
      test: ["CMD-SHELL","bash -c ':> /dev/tcp/127.0.0.1/8000' || exit 1"]
      interval: 10s
      timeout: 5s
      retries: 10
      start_period: 5s


// === ARCHIVO: infra-local/README.md ===
# Infraestructura local

Servicios de soporte para el reto, definidos en `docker-compose.yml` (raiz del repo).

```bash
docker compose up -d --wait
```

| Servicio | Imagen | Puertos (host) |
|---|---|---|
| DynamoDB Local | `amazon/dynamodb-local:2.5.2` | 8000 |

Credenciales: solo de desarrollo local (`local-dev-only`, `local`). No son secretos ni deben reutilizarse.
Los scripts de `infra-local/` (tablas, topics) se ejecutan con el compose en estado healthy.


// === ARCHIVO: infra-local/dynamodb/create-tables.sh ===
#!/usr/bin/env bash
# Crea las tablas en DynamoDB Local (idempotente). Credenciales dummy: DynamoDB Local no valida firmas.
set -euo pipefail

export AWS_ACCESS_KEY_ID=local
export AWS_SECRET_ACCESS_KEY=local
export AWS_REGION=us-east-1
ENDPOINT="${DYNAMODB_ENDPOINT:-http://localhost:8000}"

create_table() {
  local name="$1" pk="$2" sk="${3:-}"
  if aws dynamodb describe-table --table-name "$name" --endpoint-url "$ENDPOINT" >/dev/null 2>&1; then
    echo "Tabla $name ya existe"
    return
  fi
  local attrs="AttributeName=$pk,AttributeType=S"
  local keys="AttributeName=$pk,KeyType=HASH"
  if [ -n "$sk" ]; then
    attrs="$attrs AttributeName=$sk,AttributeType=S"
    keys="$keys AttributeName=$sk,KeyType=RANGE"
  fi
  # shellcheck disable=SC2086
  aws dynamodb create-table --table-name "$name" --attribute-definitions $attrs --key-schema $keys \
    --billing-mode PAY_PER_REQUEST --endpoint-url "$ENDPOINT" >/dev/null
  echo "Tabla $name creada"
}

create_table "app-items" "id"

```
