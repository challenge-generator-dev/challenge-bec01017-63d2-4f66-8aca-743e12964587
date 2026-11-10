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