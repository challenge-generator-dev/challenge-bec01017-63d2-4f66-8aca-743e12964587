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