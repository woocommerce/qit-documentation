# QIT Architecture Overview

The Quality Insights Toolkit (QIT) is designed to streamline and standardize the testing of WooCommerce extensions. Its
architecture brings together multiple components—local tools, cloud-based services, managed test suites, custom E2E
tests, and the WooCommerce Marketplace itself—to create a cohesive, automated testing ecosystem. By understanding the
big picture of how QIT is structured, developers can better appreciate the role of each component and how they all work
together to ensure quality, compatibility, and reliability.

## Key Components

**1. QIT CLI**
The QIT Command Line Interface is the primary tool developers use locally. Through simple commands, a developer can:

- Authenticate with their WooCommerce Marketplace account.
- Trigger managed or custom tests.
- Upload custom tests, run them against different WordPress/WooCommerce versions, and inspect results.
- Integrate QIT into their existing development workflows or CI/CD pipelines.

**2. Managed Test Suites**
  Maintained by the QIT team, these pre-built tests validate critical WordPress and WooCommerce functionality. They
  cover everything from plugin activation and WooCommerce flows to security, PHP compatibility, and more. The
  architecture ensures these tests remain updated and relevant, running seamlessly both on developer demand and
  automatically when new releases are published to the Marketplace.

**3. Custom E2E Tests**
  Developers can create and maintain their own Playwright-based E2E tests tailored to their extension’s unique features.
  These tests are uploaded and stored within QIT’s infrastructure. The architecture supports running these custom tests
  locally or in the cloud environment, enabling compatibility testing between multiple extensions and scenarios that
  managed tests don’t cover.

**4. Cloud-based Test Runner and Environment**
  When a test run is triggered, QIT provisions a clean, isolated environment—complete with the specified WordPress,
  WooCommerce, and PHP versions. Depending on whether it’s a managed or a custom test, QIT retrieves the correct test
  files, executes the tests, and captures logs, screenshots, and detailed reports. The environment is disposable,
  ensuring one test run does not affect another.

**5. WooCommerce Marketplace Integration**
  For extensions listed on the WooCommerce Marketplace, QIT integrates directly with the Marketplace platform. New
  releases automatically trigger managed tests, ensuring that updates meet quality standards before reaching merchants.
  Developers can also run these tests on-demand through the Vendor Dashboard. This tight integration reduces friction
  and increases confidence for both developers and store owners.

**6. Reporting and Feedback Loop**
  Once tests complete, QIT aggregates the results and displays them in the CLI output or the WooCommerce Vendor
  Dashboard. Developers can view logs, screenshots, and reports. Failed tests highlight potential issues, guiding
  developers on what to fix. Merchants benefit indirectly, as problematic updates are caught early, ensuring stable and
  secure extensions.

## Architectural Flow

1. **Triggering a Test**:
   A developer initiates a test run—either by a CLI command locally or by using the Vendor Dashboard on WooCommerce.com.
2. **Environment Provisioning**:
   QIT spins up a dedicated, disposable environment. It installs WordPress and WooCommerce at the requested versions,
   activates the developer’s extension, and sets up any other required conditions.
3. **Test Retrieval**:
    - For managed tests, QIT fetches the latest stable set of tests maintained by QIT.
    - For custom tests, QIT retrieves the specific tests uploaded by the developer or linked from a repository.
4. **Test Execution**:
   The tests run within the containerized environment, ensuring isolation and preventing side effects. QIT collects
   logs, errors, screenshots, and performance metrics.
5. **Results and Reporting**:
   After execution, QIT compiles results into easily understandable reports. These reports can be accessed:
    - In the CLI (as textual output and links to detailed logs).
    - In the Vendor Dashboard (with visuals and clickable links to Allure or other reporting tools).
6. **Iteration and Improvement**:
   With immediate feedback, developers refine their code or add more custom tests. Over time, this leads to
   higher-quality extensions and a more trusted WooCommerce ecosystem.

## Why This Matters

For developers, the QIT architecture minimizes guesswork and manual testing by providing a consistent, reproducible
testing process. For merchants, it means confidence that extensions meet rigorous standards. Ultimately, the QIT
architecture weaves together these diverse components to deliver a seamless and efficient testing experience—one that
scales with the ecosystem and consistently raises the bar for extension quality.