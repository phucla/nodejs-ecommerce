#!/bin/bash
export ENVIRONMENT='dev'
export ADMIN_PORTAL="admin-portal"
export STORE_PORTAL="store-manager-portal"
export CUSTOMER_PORTAL="customer-portal"
export DEBUGGING="debugging"

##############################
# Create script to start app
##############################

# Run unit test
function do-app-start() {
  local appName=$1
  npm run start ${appName}
}

# Start customer app
function do-customer-start() {
  do-app-start ${CUSTOMER_PORTAL}
}

# Start store manager app
function do-store-start() {
  do-app-start ${STORE_PORTAL}
}

# Start store manager app
function do-debug-start() {
  do-app-start ${DEBUGGING}
}

# Start admin app
function do-admin-start() {
  do-app-start ${ADMIN_PORTAL}
}

##############################
# Create script to run unit test
##############################

# Run unit test
function do-app-test() {
  local appName=$1
  npm run test ${appName}
}

# Run testing for customer app
function do-customer-test() {
  do-app-test ${CUSTOMER_PORTAL}
}

# Run testing for store manager app
function do-store-test() {
  do-app-test ${STORE_PORTAL}
}

# Run testing for admin app
function do-admin-test() {
  do-app-test ${ADMIN_PORTAL}
}

##############################
# Create script to build app
##############################

# Run build app
function do-app-build() {
  local appName=$1
  npm run build ${appName}
}

# Build customer app
function do-customer-build() {
  do-app-build ${CUSTOMER_PORTAL}
}

# Build store manager app
function do-store-build() {
  do-app-build ${STORE_PORTAL}
}

# Build for admin app
function do-admin-build() {
  do-app-build ${ADMIN_PORTAL}
}

##############################
# Create script to run linting
##############################

# Run linting
function do-app-linting() {
  local appName=$1
  npm run lint ${appName}
}

# Linting customer app
function do-customer-linting() {
  do-app-linting ${CUSTOMER_PORTAL}
}

# Linting store manager app
function do-store-linting() {
  do-app-linting ${STORE_PORTAL}
}

# Linting for admin app
function do-admin-linting() {
  do-app-linting ${ADMIN_PORTAL}
}

##############################
# Create script to deploy app
##############################

# Deploy app
function do-app-deploy() {
  local appName=$1
  echo "Deploy $appName"
}

# Deploy customer app
function do-customer-deploy() {
  do-app-deploy ${CUSTOMER_PORTAL}
}

# Deploy store manager app
function do-store-deploy() {
  do-app-deploy ${STORE_PORTAL}
}

# Deploy for admin app
function do-admin-deploy() {
  do-app-deploy ${ADMIN_PORTAL}
}
