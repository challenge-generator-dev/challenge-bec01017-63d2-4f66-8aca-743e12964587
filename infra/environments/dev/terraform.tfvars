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