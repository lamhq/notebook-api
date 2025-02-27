variable "tf_backend_policy_arn" {
  type        = string
  description = "ARN of IAM policy for managing Terraform backend resources on AWS"
}

variable "github_repo_id" {
  description = "GitHub repository identifier"
  type        = string
  default     = "github-username/repository-name"
}

resource "aws_iam_role" "api_cd_role" {
  name = "${local.name_prefix}-api-deployment-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Principal = {
          Federated = aws_iam_openid_connect_provider.github_oidc_provider.arn
        },
        Action = "sts:AssumeRoleWithWebIdentity",
        Condition = {
          StringEquals = {
            "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com",
          },
          StringLike = {
            "token.actions.githubusercontent.com:sub" = "repo:${var.github_repo_id}:*"
          }
        }
      }
    ]
  })
}

resource "aws_iam_policy" "code_deploy_policy" {
  name        = "${local.name_prefix}-code-deploy-policy"
  description = "Permissions to deploy code for the api app"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      # manage s3 bucket
      {
        Effect = "Allow"
        Action = ["s3:*"]
        Resource = [
          "${aws_s3_bucket.project_bucket.arn}",
          "${aws_s3_bucket.project_bucket.arn}/*",
        ]
      },

      # manage application code
      {
        Effect = "Allow"
        Action = ["apigateway:*"]
        Resource = [
          "arn:aws:apigateway:${var.aws_region}::/restapis",
          "arn:aws:apigateway:${var.aws_region}::/restapis/*",
          "arn:aws:apigateway:${var.aws_region}::/tags/*",
        ]
      },
      {
        Effect   = "Allow"
        Action   = ["lambda:*"]
        Resource = "arn:aws:lambda:${var.aws_region}:${local.aws_acc_id}:function:${local.name_prefix}-*",
      },

      # manage user pool
      {
        Effect   = "Allow"
        Action   = ["cognito-idp:*"]
        Resource = "arn:aws:cognito-idp:${var.aws_region}:${local.aws_acc_id}:userpool/*"
      },
      {
        Effect   = "Allow"
        Action   = ["cognito-idp:DescribeUserPoolDomain"]
        Resource = "*"
      },

      # manage log groups of project
      {
        Effect   = "Allow"
        Action   = ["logs:DescribeLogGroups"]
        Resource = "*"
      },
      {
        Effect   = "Allow"
        Action   = ["logs:*"]
        Resource = "arn:aws:logs:${var.aws_region}:${local.aws_acc_id}:log-group:/aws/lambda/${local.name_prefix}-*"
      },

      # manage roles & policies of project
      {
        Effect = "Allow"
        Action = ["iam:*"]
        Resource = [
          "arn:aws:iam::${local.aws_acc_id}:role/${local.name_prefix}-*",
          "arn:aws:iam::${local.aws_acc_id}:policy/${local.name_prefix}-*"
        ]
      },

      # manage identity providers of project
      {
        Effect   = "Allow"
        Action   = ["iam:*"]
        Resource = "arn:aws:iam::${local.aws_acc_id}:oidc-provider/token.actions.githubusercontent.com"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "code_deploy_pol_attm" {
  role       = aws_iam_role.api_cd_role.name
  policy_arn = aws_iam_policy.code_deploy_policy.arn
}

resource "aws_iam_role_policy_attachment" "tf_backend_pol_attm" {
  role       = aws_iam_role.api_cd_role.name
  policy_arn = var.tf_backend_policy_arn
}

output "api_cd_role_arn" {
  description = "IAM role for CD server to deploy the app (in this case, Github Action)"
  value       = aws_iam_role.api_cd_role.arn
}
