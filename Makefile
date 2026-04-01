# HR Enterprise Platform — Pipeline Makefile
# All CI/CD systems call these targets: make build, make test, make package, etc.
# Works locally too — run any target from the project root.

BACKEND_DIR   := backend
FRONTEND_DIR  := frontend
SERVICE_MODULE := hrapp-service

.PHONY: all build test lint package verify clean help

## Default: full pipeline
all: build test lint package

## ─── Backend ────────────────────────────────────────────────────────────────

backend-build:
	@echo ">>> Building backend..."
	cd $(BACKEND_DIR) && mvn clean compile -q

backend-test:
	@echo ">>> Running backend unit tests..."
	cd $(BACKEND_DIR) && mvn test -pl $(SERVICE_MODULE) -q

backend-package:
	@echo ">>> Packaging backend (skip tests — already ran)..."
	cd $(BACKEND_DIR) && mvn package -DskipTests -q

## ─── Frontend ───────────────────────────────────────────────────────────────

frontend-install:
	@echo ">>> Installing frontend dependencies..."
	cd $(FRONTEND_DIR) && npm ci --silent

frontend-lint:
	@echo ">>> Linting frontend..."
	cd $(FRONTEND_DIR) && npm run lint

frontend-build:
	@echo ">>> Building frontend..."
	cd $(FRONTEND_DIR) && npm run build

frontend-test-e2e:
	@echo ">>> Running E2E smoke tests..."
	cd $(FRONTEND_DIR) && npm run test:e2e:smoke

## ─── Composite pipeline stages ──────────────────────────────────────────────

build: backend-build frontend-install frontend-build
	@echo ">>> BUILD complete."

test: backend-test
	@echo ">>> TEST complete."

lint: frontend-lint
	@echo ">>> LINT complete."

package: backend-package
	@echo ">>> PACKAGE complete."

verify: build test lint
	@echo ">>> VERIFY complete — ready for deployment."

## ─── Utility ────────────────────────────────────────────────────────────────

clean:
	@echo ">>> Cleaning build artifacts..."
	cd $(BACKEND_DIR) && mvn clean -q
	rm -rf $(FRONTEND_DIR)/dist $(FRONTEND_DIR)/node_modules

help:
	@echo ""
	@echo "HR Platform — available targets:"
	@echo "  make build          Backend compile + frontend install + frontend build"
	@echo "  make test           Backend unit tests"
	@echo "  make lint           Frontend ESLint"
	@echo "  make package        Backend JAR (tests skipped)"
	@echo "  make verify         Full pipeline: build + test + lint"
	@echo "  make clean          Remove all build artifacts"
	@echo ""
