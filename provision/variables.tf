variable "manifests_overlay_path" {
  description = "Path to Kustomization /overlay"
  type        = string
  default     = "../manifests/overlays"
}

variable "kubeconfig_path" {
  description = "Path to the kubeconfig file"
  type        = string
  default     = "~/.kube/config"
}
