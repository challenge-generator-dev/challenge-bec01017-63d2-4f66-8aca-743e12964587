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