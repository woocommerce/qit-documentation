# The Security Architecture of the Custom Tests

:::info
The Custom Tests feature is coming soon.
:::

## Containerized Test Environments

All test code runs only on containerized Docker Environments meticulously designed for maximum isolation. This advanced engineering at both high and low levels guarantees that the test code execution remains completely segregated from the rest of the system.

Every volume mount was carefully considered, and by default, only the directories within the disposable test directory are mounted into the Docker Environments. The only exception is if you choose to mount additional volumes with the `--volumes` parameter or config file, in which case the volumes will be mounted in read-only mode.

The tests are executed as a non-root user, defaulting to UID/GID of your currently logged-in user.

For the main PHP service we use our own custom-built Docker images based on Alpine.

This setup provides an intrinsic layer for executing code in a secure and sandboxed environment.