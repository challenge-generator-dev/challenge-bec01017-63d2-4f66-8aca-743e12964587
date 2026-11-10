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