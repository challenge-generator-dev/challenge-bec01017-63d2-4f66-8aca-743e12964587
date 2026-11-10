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