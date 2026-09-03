<div align="center">

# 🧬 MERN TodoList — DevOps End-to-End Project

<img src="https://img.shields.io/badge/DevOps-End--to--End-blueviolet?style=for-the-badge&logo=devops&logoColor=white"/>
<img src="https://img.shields.io/badge/Jenkins-Pipeline-D24939?style=for-the-badge&logo=jenkins&logoColor=white"/>
<img src="https://img.shields.io/badge/Docker-Containerized-2496ED?style=for-the-badge&logo=docker&logoColor=white"/>
<img src="https://img.shields.io/badge/Kubernetes-GitOps-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white"/>
<img src="https://img.shields.io/badge/ArgoCD-App--of--Apps-EF7B4D?style=for-the-badge&logo=argo&logoColor=white"/>
<img src="https://img.shields.io/badge/Sealed--Secrets-Bitnami-2596BE?style=for-the-badge&logo=bitnami&logoColor=white"/>
<img src="https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white"/>
<img src="https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=black"/>
<img src="https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=nodedotjs&logoColor=white"/>
<img src="https://img.shields.io/badge/Prometheus-Monitoring-E6522C?style=for-the-badge&logo=prometheus&logoColor=white"/>
<img src="https://img.shields.io/badge/Grafana-Dashboards-F46800?style=for-the-badge&logo=grafana&logoColor=white"/>
<img src="https://img.shields.io/badge/Kustomize-Overlays-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white"/>
<img src="https://img.shields.io/badge/k6-Load%20Testing-7D64FF?style=for-the-badge&logo=k6&logoColor=white"/>

<br/>
<br/>

> **A production-grade DevOps pipeline** that automates the full software delivery lifecycle of the **TodoList MERN application** (MongoDB, Express, React, Node.js) — from source code to a fully monitored, autoscaled, secret-encrypted Kubernetes deployment — using GitOps with an ArgoCD **App-of-Apps** pattern.

</div>

---

## 📋 Table of Contents

- [🎯 Overview](#-overview)
- [🏗️ Architecture](#️-architecture)
- [📁 Project Structure](#-project-structure)
- [🔄 CI/CD Pipeline](#-cicd-pipeline)
- [☸️ Kubernetes & GitOps](#️-kubernetes--gitops)
- [🔐 Secrets Management (Sealed Secrets)](#-secrets-management-sealed-secrets)
- [📈 Monitoring Stack](#-monitoring-stack)
- [🧪 Load Testing (k6)](#-load-testing-k6)
- [⚙️ Prerequisites](#️-prerequisites)
- [🚀 Getting Started](#-getting-started)
- [🌍 Environments](#-environments)
- [📊 Autoscaling (HPA)](#-autoscaling-hpa)

---

## 🎯 Overview

This project implements a **complete DevOps pipeline** for the **TodoList** MERN application (MongoDB, Express/Node.js backend, React frontend). It demonstrates industry best practices for:

| Pillar | Implementation |
|--------|---------------|
| 🔄 **Continuous Integration** | Jenkins pipelines (separate `Jenkinsfile` for backend & frontend) triggered on every push |
| 📦 **Containerization** | Independent Dockerfiles per service, orchestrated locally via `docker-compose.yaml` |
| 🚢 **Continuous Delivery** | GitOps with **ArgoCD App-of-Apps** — Staging, Prod, Monitoring & Load Testing applications managed declaratively |
| ☸️ **Orchestration** | Kubernetes with Kustomize (`base` + per-environment `overlays`) |
| 🔐 **Secrets Management** | **Bitnami Sealed Secrets** — encrypted secrets committed safely to Git, per environment |
| 🗄️ **Database** | MongoDB deployed as a `StatefulSet` with a `mongodb-exporter` sidecar; `mongo-express` UI available in **staging only** |
| 📈 **Autoscaling** | Horizontal Pod Autoscaler (HPA) for backend & frontend — currently enabled in **prod only** |
| 📊 **Monitoring** | Prometheus + Grafana + Alertmanager (Telegram alerts) + Blackbox uptime probing, all wired into ArgoCD as a dedicated Application |
| 🧪 **Load Testing** | **k6**-based load generator Job, deployed as an ArgoCD Sync Hook in `prod`, also runnable on demand as its own ArgoCD Application |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          DEVELOPER WORKFLOW                              │
│                                                                          │
│   git push ──► GitHub ──► Webhook ──► Jenkins (backend / frontend)      │
└──────────────────────────────────┬──────────────────────────────────────┘
                                   │
                    ┌──────────────▼──────────────┐
                    │       JENKINS CI/CD          │
                    │                              │
                    │  ✅ Checkout & Build          │
                    │  ✅ Install Dependencies      │
                    │  🐳 Docker Build (per service)│
                    │  📤 Push to Registry          │
                    │  🔄 Update Kustomize Image    │
                    │  🔄 Git Push (GitOps repo)    │
                    └──────┬────────────┬──────────┘
                           │            │
               ┌───────────▼──┐    ┌────▼────────────┐
               │   Registry   │    │   GitHub Repo    │
               │  (Docker)    │    │ (GitOps Source)  │
               └──────────────┘    └────────┬─────────┘
                                            │
                               ┌────────────▼─────────────┐
                               │   ArgoCD "todolist-app"   │
                               │   App-of-Apps Pattern     │
                               └──┬──────────┬────────┬───┬─┘
                                  │          │        │   │
                     ┌────────────▼─┐  ┌─────▼─────┐  │   │
                     │ todolist-    │  │ todolist-  │  │   │
                     │ staging (ns) │  │ prod (ns)  │  │   │
                     │              │  │            │  │   │
                     │  Frontend    │  │ Frontend   │  │   │
                     │  Backend     │  │ Backend    │  │   │
                     │  MongoDB     │  │ MongoDB    │  │   │
                     │  Mongo-Expr  │  │ HPA        │  │   │
                     │  Ingress     │  │ Ingress    │  │   │
                     │  Sealed-Sec  │  │ Sealed-Sec │  │   │
                     │              │  │ Loadgen Job│  │   │
                     └──────────────┘  └────────────┘  │   │
                                                        │   │
                                          ┌─────────────▼─┐ │
                                          │  monitoring ns │ │
                                          │                │ │
                                          │ 📈 Prom Rules   │ │
                                          │ 📊 Grafana Dash │ │
                                          │ 🔎 ServiceMons  │ │
                                          │ 🌐 Blackbox     │ │
                                          │ 🔔 Alertmanager │ │
                                          └────────────────┘ │
                                                              │
                                            ┌─────────────────▼──┐
                                            │  todolist-loadtest  │
                                            │  (standalone k6 App)│
                                            │  → todolist-prod ns │
                                            │  manual sync         │
                                            └─────────────────────┘
```

> ℹ️ **ArgoCD** and the **kube-prometheus-stack** are installed via **Helm** into their own dedicated namespaces (`argocd` and `monitoring`), while all application workloads and the monitoring resources (rules, dashboards, probes) are synced declaratively through the **App-of-Apps** ArgoCD pattern. The `todolist-staging` and `todolist-prod` namespaces are auto-created by ArgoCD (`CreateNamespace=true`). The **k6 load generator** ships both bundled inside the `prod` overlay (as an ArgoCD Sync Hook Job) and as its own standalone ArgoCD Application (`todolist-loadtest`) for on-demand runs.

---

## 📁 Project Structure

```
MERN-app-End-to-End-Project/
│
├── Application-Code/
│   ├── backend/                        # Node.js / Express API source
│   ├── frontend/                       # React application source
│   └── docker-compose.yaml             # Local multi-container dev environment
│
├── Jenkins/
│   ├── Jenkinsfile-backend              # CI/CD pipeline for the backend service
│   └── Jenkinsfile-frontend             # CI/CD pipeline for the frontend service
│
└── Kubernetes-Manifests-file/
    │
    ├── argocd/
    │   ├── applications/
    │   │   ├── loadtest.yaml           # ArgoCD Application → overlays/prod/loadgenerator (manual sync)
    │   │   ├── monitoring.yaml         # ArgoCD Application → monitoring stack
    │   │   ├── prod.yaml               # ArgoCD Application → overlays/prod
    │   │   └── staging.yaml            # ArgoCD Application → overlays/staging
    │   └── app-of-apps.yaml            # Root ArgoCD Application "todolist-app"
    │
    ├── base/
    │   ├── kustomization.yaml          # Aggregates frontend + backend + database
    │   │
    │   ├── backend/
    │   │   ├── deployment.yaml         # todolist-backend-deployment
    │   │   ├── kustomization.yaml
    │   │   └── service.yaml
    │   │
    │   ├── database/
    │   │   ├── configmap.yaml
    │   │   ├── kustomization.yaml
    │   │   ├── pvc.yaml                # mongodb-pvc (1Gi)
    │   │   ├── secret.yaml             # base MongoDB secret (overridden by sealed secrets per env)
    │   │   ├── service.yaml            # exposes mongodb (27017) + metrics (9216)
    │   │   └── statefulset.yaml        # mongodb + mongodb-exporter sidecar
    │   │
    │   └── frontend/
    │       ├── configmap.yaml
    │       ├── deployment.yaml         # todolist-frontend-deployment
    │       ├── kustomization.yaml
    │       └── service.yaml
    │
    ├── monitoring/                      # Synced as its own ArgoCD Application
    │   ├── kustomization.yaml
    │   │
    │   ├── alertmanager/
    │   │   ├── alertmanager-config.yaml   # AlertmanagerConfig → routes to Telegram
    │   │   ├── kustomization.yaml
    │   │   ├── sealed-secret-telegram.yaml # Encrypted Telegram bot token
    │   │   └── secret.yaml
    │   │
    │   ├── blackbox/
    │   │   ├── frontend-probe.yaml     # Probe: HTTP uptime check (staging + prod frontend)
    │   │   └── kustomization.yaml
    │   │
    │   ├── grafana/
    │   │   ├── kustomization.yaml
    │   │   └── dashboards/
    │   │       ├── kustomization.yaml
    │   │       └── todolist-dashboard.yaml   # Custom Grafana dashboard (ConfigMap)
    │   │
    │   ├── prometheus-rules/
    │   │   ├── backend-alerts.yaml     # Down / restarts / CPU / memory
    │   │   ├── database-alerts.yaml    # Down / restarts / CPU / memory / PVC usage
    │   │   ├── frontend-alerts.yaml    # Down / restarts
    │   │   └── kustomization.yaml
    │   │
    │   └── servicemonitors/
    │       ├── backend-servicemonitor.yaml
    │       ├── database-servicemonitor.yaml   # scrapes mongodb-exporter metrics
    │       └── kustomization.yaml
    │
    └── overlays/
        ├── prod/
        │   ├── kustomization.yaml      # base + hpa + ingress + secrets + loadgenerator
        │   ├── hpa/
        │   │   ├── hpa-backend.yaml
        │   │   ├── hpa-frontend.yaml
        │   │   └── kustomization.yaml
        │   ├── ingress/
        │   │   ├── ingress.yaml        # host: todolist.local
        │   │   └── kustomization.yaml
        │   ├── loadgenerator/
        │   │   ├── configmap.yaml      # k6 script + env vars (target URLs, VUs)
        │   │   ├── job.yaml            # k6 Job, run as an ArgoCD Sync Hook
        │   │   └── kustomization.yaml
        │   └── secrets/
        │       ├── kustomization.yaml
        │       └── sealed-secret-database.yaml
        │
        └── staging/
            ├── kustomization.yaml      # base + mongo-express + secrets + ingress
            ├── ingress/
            │   ├── ingress.yaml        # host: staging.local (+ /mongo-express path)
            │   └── kustomization.yaml
            ├── mongo-express/
            │   ├── deployment.yaml     # DB admin UI (staging only)
            │   ├── kustomization.yaml
            │   ├── secret.yaml
            │   └── service.yaml
            └── secrets/
                ├── kustomization.yaml
                ├── sealed-secret-database.yaml
                └── sealed-secret-mongoexpress.yaml
```

---

## 🔄 CI/CD Pipeline

Two independent Jenkins pipelines handle each service separately, triggered on push to their respective paths:

```
🧹 Clean Workspace
    │
    ▼
📥 Checkout (GitHub)
    │
    ▼
🏷️  Set Image Tag ──────────── git commit SHA / build number
    │
    ▼
⚙️  Install Dependencies (npm ci)
    │
    ▼
🧪 Lint + Unit Tests
    │
    ▼
🐳 Docker Build ──────────────── backend or frontend image
    │
    ▼
📤 Push to Registry
    │
    ▼
🔄 Update Kustomize Image Tag ── kustomize edit set image
    │
    ▼
🔄 Git Push (GitOps repo) ────── overlays/staging (or prod)
    │
    ▼
♻️  ArgoCD Auto-Sync
```

### Pipelines

| Pipeline | Trigger Path | Manifest Updated |
|----------|--------------|-------------------|
| `Jenkinsfile-backend` | `Application-Code/backend/**` | `overlays/*/kustomization.yaml` → `houssemdhahri93/todolist-backend` image tag |
| `Jenkinsfile-frontend` | `Application-Code/frontend/**` | `overlays/*/kustomization.yaml` → `houssemdhahri93/todolist-frontend` image tag |

### Local Development

```bash
cd Application-Code
docker-compose up -d
```

This spins up the **frontend**, **backend**, and **MongoDB** locally for fast iteration before pushing to the pipeline.

---

## ☸️ Kubernetes & GitOps

This project follows the **App-of-Apps** GitOps pattern with ArgoCD.

### How It Works

1. `app-of-apps.yaml` defines the root Application **`todolist-app`**, which points to the `argocd/applications` folder and lets ArgoCD discover the child Applications automatically.
2. Four child Applications live under `argocd/applications/`:
   - `staging.yaml` (**todolist-staging**) → syncs `overlays/staging` into namespace `todolist-staging`, fully automated (`prune` + `selfHeal`)
   - `prod.yaml` (**todolist-prod**) → syncs `overlays/prod` into namespace `todolist-prod`, with `ignoreDifferences` on `spec.replicas` for both Deployments (so HPA-driven scaling isn't reverted by ArgoCD) and `ApplyOutOfSyncOnly` sync option
   - `monitoring.yaml` (**monitoring-todolist-app**) → syncs `Kubernetes-Manifests-file/monitoring` into namespace `monitoring`, fully automated
   - `loadtest.yaml` (**todolist-loadtest**) → syncs `overlays/prod/loadgenerator` into namespace `todolist-prod`, with an **empty `syncPolicy`** (no automation) so the k6 load test only runs when manually synced from the ArgoCD UI/CLI
3. Jenkins updates the image tag directly inside the target overlay's `kustomization.yaml` (`images:` block) and pushes to `main`.
4. ArgoCD detects the diff and automatically syncs the corresponding namespace.

### Namespaces

| Namespace | Created By | Purpose |
|-----------|-----------|---------|
| `todolist-staging` | ArgoCD (`CreateNamespace=true`) | Staging environment workloads |
| `todolist-prod` | ArgoCD (`CreateNamespace=true`) | Production environment workloads + k6 load test Job |
| `monitoring` | ArgoCD (`CreateNamespace=true`) | Prometheus / Grafana / Alertmanager / Blackbox |
| `argocd` | *(installed via Helm)* | ArgoCD controller & UI |

### Application Components

| Component | Manifest Source | Staging | Prod |
|-----------|------------------|:---:|:---:|
| **Frontend** | `base/frontend` | ✅ | ✅ |
| **Backend** | `base/backend` | ✅ | ✅ |
| **Database** | `base/database` (StatefulSet + PVC + exporter sidecar) | ✅ | ✅ |
| **Mongo Express** (DB admin UI) | `overlays/staging/mongo-express` | ✅ | ❌ |
| **Ingress** | `overlays/<env>/ingress` | ✅ (`staging.local`) | ✅ (`todolist.local`) |
| **HPA** | `overlays/prod/hpa` | ❌ | ✅ |
| **Sealed Secrets** | `overlays/<env>/secrets` | ✅ | ✅ |
| **Load Generator (k6)** | `overlays/prod/loadgenerator` | ❌ | ✅ (manual / hook-triggered) |

> Unlike the original design, **HPA and Ingress are no longer patched on top of base manifests** — they are now defined as standalone resources directly inside each overlay's `kustomization.yaml`. This makes staging and prod fully independent instead of sharing a common `hpa.yaml`/`ingress.yaml` base + patch.

### Kustomize Overlay Structure

```yaml
# overlays/prod/kustomization.yaml
resources:
  - ../../base/
  - hpa
  - ingress
  - secrets
  - loadgenerator

images:
  - name: houssemdhahri93/todolist-backend
    newTag: v1.0.3
  - name: houssemdhahri93/todolist-frontend
    newTag: v1.0.2
```

```yaml
# overlays/staging/kustomization.yaml
resources:
  - ../../base/
  - mongo-express
  - secrets
  - ingress

images:
  - name: houssemdhahri93/todolist-backend
    newTag: v1.0.3
  - name: houssemdhahri93/todolist-frontend
    newTag: v1.0.2
```

---

## 🔐 Secrets Management (Sealed Secrets)

All sensitive values (MongoDB credentials, connection string, Mongo Express basic-auth, Telegram bot token) are encrypted using **Bitnami Sealed Secrets** before being committed to Git:

| Secret | Location | Consumed By |
|--------|----------|-------------|
| `mongodb-secret` | `overlays/prod/secrets/sealed-secret-database.yaml` | Backend + MongoDB (prod) |
| `mongodb-secret` | `overlays/staging/secrets/sealed-secret-database.yaml` | Backend + MongoDB + Mongo Express (staging) |
| `mongo-express-secret` | `overlays/staging/secrets/sealed-secret-mongoexpress.yaml` | Mongo Express basic-auth (staging) |
| `alertmanager-telegram-token` | `monitoring/alertmanager/sealed-secret-telegram.yaml` | Alertmanager → Telegram notifications |

Each `SealedSecret` is decrypted **in-cluster only** by the `sealed-secrets` controller and rehydrated into a regular Kubernetes `Secret` with the same name/namespace — nothing sensitive is ever stored in plaintext in Git.

---

## 📈 Monitoring Stack

The full observability stack is deployed as its own ArgoCD Application (`monitoring-todolist-app`), synced from `Kubernetes-Manifests-file/monitoring`:

| Sub-component | What it does |
|----------------|--------------|
| **Prometheus Rules** | Alerting rules for backend, frontend, and database — service down, container restarts, high CPU/memory, PVC almost full |
| **ServiceMonitors** | Scrape backend `/metrics` and the `mongodb-exporter` sidecar metrics from both `todolist-staging` and `todolist-prod` |
| **Blackbox Exporter Probe** | External HTTP uptime check (`http_2xx`) against the frontend service in both staging and prod |
| **Grafana Dashboard** | A custom "🚀 TodoList Monitoring" dashboard (provisioned via ConfigMap) with an environment selector (`todolist-staging` / `todolist-prod`) showing service status, CPU/memory usage vs limits, container restarts, PVC usage, HPA scaling, and active alerts |
| **Alertmanager** | `AlertmanagerConfig` routes alerts to a **Telegram** chat, with the bot token stored as a Sealed Secret |

> Full raw dashboard JSON and alert rule definitions live under `monitoring/grafana/dashboards/` and `monitoring/prometheus-rules/` respectively.

---

## 🧪 Load Testing (k6)

Production traffic can be simulated using **[k6](https://k6.io/)**, defined under `overlays/prod/loadgenerator/`:

| Manifest | Purpose |
|----------|---------|
| `configmap.yaml` | Holds the k6 test script (`loadtest.js`) plus target service addresses (`FRONTEND_SERVICE_ADDR`, `BACKEND_SERVICE_ADDR`) and virtual user count (`USERS`) |
| `job.yaml` | A Kubernetes `Job` running `grafana/k6:latest`, which drives HTTP traffic against both the frontend and the backend `/api/tasks` endpoint for a fixed duration |
| `kustomization.yaml` | Aggregates the ConfigMap and Job |

**How it's triggered:**

- The Job is annotated as an **ArgoCD Sync Hook** (`argocd.argoproj.io/hook: Sync`, `hook-delete-policy: BeforeHookCreation,HookSucceeded`), so it re-runs and cleans up automatically on every sync of an Application that includes it.
- It is wired into ArgoCD in two ways:
  1. **Bundled inside `prod`** — `loadgenerator` is listed as a resource in `overlays/prod/kustomization.yaml`, so it's part of the `todolist-prod` Application.
  2. **Standalone Application** — `argocd/applications/loadtest.yaml` (**todolist-loadtest**) points directly at `overlays/prod/loadgenerator` with an empty `syncPolicy: {}`, so it can be synced **manually and independently**, on demand, from the ArgoCD UI/CLI without touching the rest of the prod stack.

This lets you exercise the HPA-driven autoscaling in prod (see [📊 Autoscaling (HPA)](#-autoscaling-hpa)) by manually syncing `todolist-loadtest` whenever you want to generate load.

---

## ⚙️ Prerequisites

| Tool | Purpose | Version |
|------|---------|---------|
| **Jenkins** | CI/CD orchestration | LTS |
| **Node.js** | Build environment (backend & frontend) | 18+ |
| **Docker** | Container runtime | 24+ |
| **Kustomize** | K8s manifest patching | v5+ |
| **ArgoCD** | GitOps controller (installed via Helm) | v2.x |
| **Kubernetes** | Container orchestration | v1.28+ |
| **Helm** | Kubernetes package manager | v3+ |
| **Sealed Secrets Controller** | Encrypts/decrypts SealedSecret CRDs | Latest |
| **Prometheus + Grafana** | Metrics & dashboards (kube-prometheus-stack) | Latest |
| **Blackbox Exporter** | HTTP uptime probing | Latest |
| **Metrics Server** | Required for HPA to function | Latest |
| **k6** | Load testing (runs in-cluster via the `grafana/k6` image) | Latest |

### Jenkins Credentials Required

| Credential ID | Type | Usage |
|--------------|------|-------|
| `github-token` | Username/Password | GitHub checkout & GitOps push |
| `dockerhub-creds` | Username/Password | Registry image push |

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/HoussemDhahri/MERN-app-End-to-End-Project.git
cd MERN-app-End-to-End-Project
```

### 2. Install ArgoCD (Helm)

```bash
helm repo add argo https://argoproj.github.io/argo-helm
kubectl create namespace argocd
helm install argocd argo/argo-cd -n argocd
```

### 3. Install the Sealed Secrets Controller

```bash
helm repo add sealed-secrets https://bitnami-labs.github.io/sealed-secrets
kubectl create namespace kube-system --dry-run=client -o yaml | kubectl apply -f -
helm install sealed-secrets sealed-secrets/sealed-secrets -n kube-system
```

### 4. Bootstrap with App-of-Apps

```bash
kubectl apply -f Kubernetes-Manifests-file/argocd/app-of-apps.yaml
```

This single command bootstraps **staging**, **prod**, **monitoring**, and registers the **load test** Application through ArgoCD automatically (namespaces are created on the fly). The load test Application itself stays unsynced until you trigger it manually.

### 5. Configure Jenkins

- Create two **Pipeline** jobs, one pointing to `Jenkins/Jenkinsfile-backend` and one to `Jenkins/Jenkinsfile-frontend`
- Enable **GitHub webhook trigger** on both
- Add the required credentials (`github-token`, `dockerhub-creds`)

### 6. Trigger the Pipelines

```bash
git push origin main
# Jenkins webhook fires → backend and/or frontend pipeline starts automatically
```

---

## 🌍 Environments

### Staging
- Namespace: `todolist-staging`
- Synced by ArgoCD (`todolist-staging` Application) from: `overlays/staging/`
- Includes **Mongo Express** for direct database inspection
- Ingress host: `staging.local` (`/`, `/api`, `/mongo-express`)
- Auto-updated on every successful pipeline run (fully automated sync)

### Production
- Namespace: `todolist-prod`
- Synced by ArgoCD (`todolist-prod` Application) from: `overlays/prod/`
- HPA-managed replica counts — ArgoCD `ignoreDifferences` prevents scaling from being reverted on sync
- Ingress host: `todolist.local` (`/`, `/api`)
- Sync restricted to `ApplyOutOfSyncOnly` for tighter, more controlled rollouts
- Optional **k6 load test** available on demand via the separate `todolist-loadtest` Application

---

## 📊 Autoscaling (HPA)

HPA is currently defined **only in the `prod` overlay** (`overlays/prod/hpa/`):

| Manifest | Target | Min / Max Replicas | Metrics |
|----------|--------|---------------------|---------|
| `hpa-backend.yaml` | `todolist-backend-deployment` | 2 – 10 | CPU 70% · Memory 80% |
| `hpa-frontend.yaml` | `todolist-frontend-deployment` | 2 – 6 | CPU 70% |

> Staging currently runs with a fixed replica count (no HPA) since it's a lower-traffic, cost-optimized environment. To observe HPA scaling in action in prod, manually sync the `todolist-loadtest` ArgoCD Application (see [🧪 Load Testing (k6)](#-load-testing-k6)) to generate traffic.

---

<div align="center">

**Built with ❤️ — MERN TodoList DevOps End-to-End Project**

<img src="https://img.shields.io/badge/GitOps-ArgoCD-orange?style=flat-square"/>
<img src="https://img.shields.io/badge/Pipeline-Jenkins-D24939?style=flat-square"/>
<img src="https://img.shields.io/badge/Secrets-Sealed--Secrets-2596BE?style=flat-square"/>
<img src="https://img.shields.io/badge/Monitoring-Prometheus%20%2B%20Grafana-F46800?style=flat-square"/>
<img src="https://img.shields.io/badge/Alerts-Telegram-26A5E4?style=flat-square"/>
<img src="https://img.shields.io/badge/Load%20Testing-k6-7D64FF?style=flat-square"/>
<img src="https://img.shields.io/badge/License-MIT-green?style=flat-square"/>

</div>