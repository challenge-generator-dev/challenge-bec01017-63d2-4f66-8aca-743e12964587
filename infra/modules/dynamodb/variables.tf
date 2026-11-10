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