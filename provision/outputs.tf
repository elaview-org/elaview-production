output "applied_resource_ids" {
  description = "List of all resource IDs applied via Kustomization"
  value       = data.kustomization_build.dev.ids
}

output "applied_manifest_count" {
  description = "Number of Kubernetes resources applied"
  value       = length(data.kustomization_build.dev.ids)
}

output "manifests_overlay_path" {
  description = "The Kustomization overlay path used"
  value       = var.manifests_overlay_path
}

output "kubeconfig_path" {
  description = "The kubeconfig path used"
  value       = var.kubeconfig_path
}
