resource "kubernetes_namespace" "external_secrets" {
  metadata {
    name = "external-secrets"
  }
}

resource "helm_release" "external_secrets" {
  depends_on       = [kubernetes_namespace.external_secrets]
  repository       = "https://charts.external-secrets.io"
  chart            = "external-secrets"
  name             = "external-secrets"
  version          = "1.2.0"
  namespace        = kubernetes_namespace.external_secrets.metadata[0].name
  create_namespace = false

  wait            = true
  wait_for_jobs   = true
  timeout         = 300
  atomic          = true
  cleanup_on_fail = true
  max_history     = 3

  values = [
    file("${path.module}/external-secrets.values.yaml")
  ]
}
