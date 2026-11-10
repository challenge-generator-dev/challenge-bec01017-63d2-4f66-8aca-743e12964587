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