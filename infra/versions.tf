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