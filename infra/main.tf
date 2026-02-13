terraform {
  required_providers {
    vercel = {
      source  = "vercel/vercel"
      version = "~> 2.15"
    }
  }
}

data "external" "env" {
  program = ["sh", "${path.module}/env.sh"]
}
