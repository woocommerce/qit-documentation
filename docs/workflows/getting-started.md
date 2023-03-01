# Getting started

The QIT GitHub Workflows are examples of integrating the Quality Insights Toolkit into GitHub. You can delegate tests to the QIT and integrate it as part of your PR approval process, when a release is created, and more.

For more information on how [GitHub Actions](https://docs.github.com/en/actions) work, please see the official GitHub documentation.

The examples below can be tweaked based on your needs, and use a fictional `woocommerce-product-feeds` extension to run the tests against. There's a few [GitHub Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets) that need to be configured for this flow (feel free to rename these to whatever makes the most sense for you and your team):

- `PARTNER_USER`: Your WooCommerce.com username.
- `PARTNER_SECRET`: Your [WordPress Application Password](https://make.wordpress.org/core/2020/11/05/application-passwords-integration-guide/).

## Activation test example

```yaml
name: QIT Activation Test
on:
  workflow_dispatch:
  pull_request:
permissions:
  pull-requests: write
jobs:
  qit_activation:
    name: QIT Activation
    runs-on: ubuntu-20.04
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      - name: Add Partner
        run: ./bin/qit partner:add --user=${{ secrets.PARTNER_USER }} --application_password=${{ secrets.PARTNER_SECRET }}
      - name: Create Zip.
        run: docker run --rm --user $(id -u):$(id -g) -v "$GITHUB_WORKSPACE:/app" -w /app joshkeegan/zip:latest sh -c "zip -r woocommerce-product-feeds.zip woocommerce-product-feeds"
      - name: Run Activation Test
        id: run-activation-test
        run: ./bin/qit run:activation woocommerce-product-feeds --zip=woocommerce-product-feeds.zip --wait > activation.txt
      - uses: marocchino/sticky-pull-request-comment@v2
        if: failure()
        with:
          header: QIT Activation Test
          recreate: true
          path: activation.txt
```

## Security test example

```yaml
name: QIT Security Test
on:
  workflow_dispatch:
  pull_request:
permissions:
  pull-requests: write
jobs:
  qit_activation:
    name: QIT Security
    runs-on: ubuntu-20.04
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      - name: Add Partner
        run: ./bin/qit partner:add --user=${{ secrets.PARTNER_USER }} --application_password=${{ secrets.PARTNER_SECRET }}
      - name: Create Zip.
        run: docker run --rm --user $(id -u):$(id -g) -v "$GITHUB_WORKSPACE:/app" -w /app joshkeegan/zip:latest sh -c "zip -r woocommerce-product-feeds.zip woocommerce-product-feeds"
      - name: Run Security Test.
        id: run-security-test
        run: ./bin/qit run:security woocommerce-product-feeds --zip=woocommerce-product-feeds.zip --wait > security.txt
      - uses: marocchino/sticky-pull-request-comment@v2
        if: failure()
        with:
          header: QIT Security Test
          recreate: true
          path: security.txt
```