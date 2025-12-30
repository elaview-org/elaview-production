resource "kubernetes_namespace" "vault" {
  metadata {
    name = "vault"
  }
}

resource "helm_release" "vault" {
  depends_on       = [kubernetes_namespace.vault]
  repository       = "https://helm.releases.hashicorp.com"
  chart            = "vault"
  name             = "vault"
  version          = "0.31.0"
  namespace        = kubernetes_namespace.vault.metadata[0].name
  create_namespace = false

  wait            = true
  wait_for_jobs   = true
  timeout         = 300
  atomic          = true
  cleanup_on_fail = true
  max_history     = 3

  values = [
    file("${path.module}/vault.values.yaml")
  ]
}
