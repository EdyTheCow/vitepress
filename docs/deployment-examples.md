# Deployment Examples

There are three most important files when deploying, `env.hcl`, `terragrunt.stack.hcl` and `root.hcl`. If you are using an already setup repository, there is probably a `root.hcl` file already configured. If you're looking to set up a new repository from scratch, look at the "Setting up new repository from scratch" section.

## Deploy IAM users and S3 buckets
This section gives you a quick overview of what and how it is possible to deploy. For more in-depth documentation of all options in IAM users and S3 buckets, check out https://github.com/arkivverket/****/.


### terragrunt.stack.hcl
Terragrunt stack defines which Terragrunt units need to be fetched from catalog repository in order to deploy various entities defined in env.hcl.

```hcl
locals {
  # Import all of variables and definqed deployments
  environment_vars = read_terragrunt_config("./env.hcl")
}

# Terragrunt IAM users unit
# source: points to the unit to be fetched
# path: name of a folder unit will be downloaded to. Useful when same unit is defined more than once in the same stack
unit "iam_users" {
  source = "git::git@github.com:arkivverket/****.git//units/iam_users"
  path   = "iam_users"

  # Various values that are fetched from env.hcl file and passed to the unit
  values = {
    # Release version from repository, can be used to pull a specific version of Terraform module (not unit)
    version          = "master"
    users            = local.environment_vars.locals.iam_users
    cloudian_group   = local.environment_vars.locals.cloudian_group
    cloudian_account = local.environment_vars.locals.cloudian_account
    iam_path         = "/terraform/repo/plattform-lagring-s3/definitions/${basename(get_terragrunt_dir())}/"
  }
}

# Terragrunt S3 buckets unit
unit "s3_buckets" {
  source = "git::git@github.com:arkivverket/****.git//units/s3_buckets"
  path   = "s3_buckets"

  values = {
    version          = "master"
    buckets          = local.environment_vars.locals.buckets
  }
}
```

### env.hcl
This file is just a list of variables and arrays defining what needs to be deployed. 
Everything in `env.hcl` is passed down to units in `terragrunt.stack.hcl`. The defined arrays are looped and executed by Terraform.

```hcl
locals {
  # Cloudian group and account the IAM users and S3 buckets should be deployed under.
  # Additionally, these variables are also used by root.hcl file to define path in Vault
  # to fetch IAM credentials which are used to deploy the entities defined below
  cloudian_group   = "TEST"
  cloudian_account = "terraform-test"

#---------------------------#
# IAM USERS
#---------------------------#

  # Section for defining IAM user to be deployed
  iam_users = [

    # IAM users with pre-defined standard IAM policies
    # These policies can be found in catalog repository under IAM user module
    {
       name = "sysadmin"
       common_policies = ["all_s3", "all_iam"]
    },
    {
       name = "sysrw"
       common_policies = ["read_write_access"]
    },
    {
       name = "sysra"
       common_policies = ["read_access"]
    },

    # IAM user with custom inline IAM policy
    # You can also create IAM users with both common and custom policies defined at the same time
    {
      name = "example-user-read"
      inline_policies_custom = {

        # Inline IAM policy block
        # You can add unlimited amount of custom IAM policy blocks
        # These blocks follow the same standard IAM policy formatting
        "example-user-read_access" = jsonencode({
          Version = "2012-10-17"
          Statement = [
            {
              Effect = "Allow"
              Action = [
                "s3:HeadObject",
                "s3:ListBucket",
                "s3:GetBucketNotification",
                "s3:GetBucketTagging",
                "s3:GetBucketVersioning"
              ]
              Resource = [
                "arn:aws:s3:::example-bucket",
                "arn:aws:s3:::example-bucket/*"
              ]
            }
          ]
        }),
          
      }
    },

    # IAM user can be also defined without any IAM policies
    # "name" is the only required field
    {name = "example-user-no-policy"},

    # IAM user without Vault integration
    # By default credentials for IAM users are generated and stored in Vault
    # We can turn this off to skip this in case you want to manage the credentials manually
    {
      name = "example-user-no-vault"
      enable_vault_integration = false
    },

  ]

#---------------------------#
# S3 BUCKETS
#---------------------------#

  # Section for defining S3 buckets to be deployed
  buckets = [
    
    # Bucket definition can be as simple as only defining bucket name
    {name = "example-bucket"},

    # All buckets by default have versioning enabled
    # You can disable this by setting versioning to false
    {
      name = "example-bucket-no-versioning"
      versioning = false
    },

    # All buckets by default have bucket policy set to false
    # Bucket policy is a strict policy which is used to deny ALL DELETE actions
    # CAREFUL: if set to true, NO ONE will be able to delete the bucket
    # Manual intervention is required to give Terraform root permissions to delete the bucket
    # THIS IS BY DESIGN. Read section "Deploying with S3 bucket policy" for instructions before deploying
    {
      name = "example-bucket-with-policy"
      bucket_policy = true
    },

    # All buckets has object ownership set to "BucketOwnerEnforced" by default
    # This shouldn't be changed unless you know what you are doing
    # You don't need to define this option because it is the default
    # This is just an example to show it is possible to change it
    {
      name = "example-bucket-obj-ownership"
      object_ownership = "BucketOwnerEnforced"
    },


  ]

}
```

### Deploying with S3 bucket policy
Bucket policy is used as a security measure to protect objects from being deleted. Our predefined bucket policy could be seen as a more flexible object lock alternative. 

Once bucket policy is attached to S3 bucket, it denies all delete actions. Even administrator accounts won't be able to delete any of the objects or the bucket itself. This is due to object ownership being set to "BucketOwnerEnforced" which means only the Cloudian account owning the bucket is able to delete it. Cloudian account root credentials have to be used to first delete bucket policy. Only then are we able to delete the S3 bucket and objects. Since we don't use root credentials to execute Terraform code, the credentials need to be swapped to root credentials in Vault so Terraform is able to pull them. 

#### Deleting S3 bucket policy
-

## Setting up new repository from scratch
This section explains how to set up a ready to use repository for deployments with Terrafrom and Terragrunt. You are able to create an unlimited amount of repositories with a limitless amount of deployments. Reasons for additional repositories could be related to security and / or ownership of the project for more granular control.


TODO: important points to cover
- root.hcl has to be properly configured (s3 bucket, iam credentials)
- Correct structure
- Github actions needs proper permissions