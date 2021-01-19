#!/bin/bash
export CMD=${1:-do-admin-start}
export MODE='dev'
export ADMIN_PORTAL="admin-portal"
export STORE_PORTAL="store-manager-portal"
export CUSTOMER_PORTAL="customer-portal"

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
function do-store-manager-start() {
  do-app-start ${STORE_PORTAL}
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
function do-store-manager-test() {
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
function do-store-manager-build() {
  do-app-build ${STORE_PORTAL}
}

# Build for admin app
function do-admin-build() {
  do-app-build ${ADMIN_PORTAL}
}

echo "env $CMD"
${CMD}
