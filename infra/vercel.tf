provider "vercel" {
  api_token = data.external.env.result["VERCEL_API_TOKEN"]
  team      = data.external.env.result["VERCEL_TEAM_ID"]
}

resource "vercel_project" "web" {
  name            = "elaview-web"
  framework       = "nextjs"
  install_command = "bun install"
  build_command   = "bun compile"
}

resource "vercel_project_environment_variables" "web" {
  project_id = vercel_project.web.id
  variables = [
    {
      key    = "ELAVIEW_WEB_API_URL"
      value  = data.external.env.result["WEB_API_URL"]
      target = ["production", "preview"]
    },
    {
      key       = "ELAVIEW_BACKEND_STRIPE_PUBLISHABLE_KEY"
      value     = data.external.env.result["BACKEND_STRIPE_PUBLISHABLE_KEY"]
      target    = ["production", "preview"]
      sensitive = true
    },
  ]
}
