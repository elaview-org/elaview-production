terraform {
  required_providers {
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "2.38.0"
    }
    kustomization = {
      source  = "kbst/kustomization"
      version = "0.9.7"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "2.15.0"
    }
    # ansible = {
    #   source  = "ansible/ansible"
    #   version = "1.3.0"
    # }
  }
}

provider "kubernetes" {
  config_path = var.kubeconfig_path
}

provider "kustomization" {
  kubeconfig_path = var.kubeconfig_path
}

provider "helm" {
  kubernetes {
    config_path = var.kubeconfig_path
  }
}
