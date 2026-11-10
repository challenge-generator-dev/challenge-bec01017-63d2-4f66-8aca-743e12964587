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