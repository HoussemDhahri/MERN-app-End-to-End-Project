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
<img src="https://img.shields.io/badge/SonarQube-Code%20Quality-4E9BCD?style=for-the-badge&logo=sonarqube&logoColor=white"/>
<img src="https://img.shields.io/badge/Trivy-Security%20Scanning-1904DA?style=for-the-badge&logo=aquasecurity&logoColor=white"/>
<img src="https://img.shields.io/badge/Prometheus-Monitoring-E6522C?style=for-the-badge&logo=prometheus&logoColor=white"/>
<img src="https://img.shields.io/badge/Grafana-Dashboards-F46800?style=for-the-badge&logo=grafana&logoColor=white"/>
<img src="https://img.shields.io/badge/Kustomize-Overlays-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white"/>
<img src="https://img.shields.io/badge/k6-Load%20Testing-7D64FF?style=for-the-badge&logo=k6&logoColor=white"/>

<br/>
<br/>

> **A production-grade DevOps pipeline** that automates the full software delivery lifecycle of the **TodoList MERN application** (MongoDB, Express, React, Node.js) — from source code, through security/quality scanning, to a fully monitored, autoscaled, secret-encrypted Kubernetes deployment — using GitOps with an ArgoCD **App-of-Apps** pattern.
>
> The application itself (`Application-Code/`) is a third-party MERN base; the **Jenkins CI/CD pipelines** and the entire **Kubernetes-Manifests-file/** GitOps setup (ArgoCD, Kustomize base/overlays, monitoring stack) were built on top of it.

</div>

---

## 📋 Table of Contents

- [🎯 Overview](#-overview)
- [🏗️ Architecture](#️-architecture)
- [📁 Project Structure](#-project-structure)
- [🔄 CI/CD Pipeline](#-cicd-pipeline)
- [🔍 Code Quality & Security Scanning](#-code-quality--security-scanning)
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

This project implements a **complete DevOps pipeline** around the **TodoList** MERN application (MongoDB, Express/Node.js backend, React frontend). It demonstrates industry best practices for:

| Pillar | Implementation |
|--------|---------------|
| 🔄 **Continuous Integration** | Two Jenkins pipelines (`Jenkinsfile-backend`, `Jenkinsfile-frontend`), triggered automatically via GitHub webhook (`githubPush()`) |
| 🔍 **Code Quality & Security** | **SonarQube** static analysis + Quality Gate, and **Trivy** filesystem & image scanning (vulnerabilities + secrets), on every build |
| 📦 **Containerization** | Independent Dockerfiles per service, orchestrated locally via `docker-compose.yaml` |
| 🚢 **Continuous Delivery** | GitOps with **ArgoCD App-of-Apps** — 6 child Applications (Staging, Prod, Monitoring, Blackbox Exporter, PVC Exporter, Load Test) managed declaratively |
| ☸️ **Orchestration** | Kubernetes with Kustomize (`base` + per-environment `overlays`) |
| 🔐 **Secrets Management** | **Bitnami Sealed Secrets** — encrypted secrets committed safely to Git, per environment |
| 🗄️ **Database** | MongoDB deployed as a `StatefulSet` with a `mongodb-exporter` sidecar; `mongo-express` UI available in **staging only** |
| 📈 **Autoscaling** | Horizontal Pod Autoscaler (HPA) for backend & frontend — currently enabled in **prod only** |
| 📊 **Monitoring** | Prometheus + Grafana + Alertmanager (Telegram alerts) + Blackbox uptime probing + a custom local-PVC storage exporter, each wired into ArgoCD |
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
                    │  ✅ Checkout & Set Image Tag  │
                    │  ⚙️  Install Dependencies      │
                    │  🔬 Trivy FS Scan              │
                    │  📊 SonarQube + Quality Gate   │
                    │  🐳 Docker Build (per service)│
                    │  🔬 Trivy Image Scan           │
                    │  📤 Push to Registry           │
                    │  🔄 Update Kustomize Image     │
                    │  🔄 Git Push (GitOps repo)     │
                    └──────┬────────────┬──────────┘
                           │            │
               ┌───────────▼──┐    ┌────▼────────────┐
               │   DockerHub  │    │   GitHub Repo    │
               │  (Registry)  │    │ (GitOps Source)  │
               └──────────────┘    └────────┬─────────┘
                                            │
                               ┌────────────▼─────────────┐
                               │   ArgoCD "todolist-app"   │
                               │   App-of-Apps Pattern     │
                               └─┬──────┬──────┬─────┬───┬─┘
                                 │      │      │     │   │
                    ┌────────────▼─┐ ┌──▼─────┐│     │   │
                    │ todolist-    │ │todolist-││     │   │
                    │ staging (ns) │ │prod (ns)││     │   │
                    │  Frontend    │ │ Frontend││     │   │
                    │  Backend     │ │ Backend ││     │   │
                    │  MongoDB     │ │ MongoDB ││     │   │
                    │  Mongo-Expr  │ │ HPA     ││     │   │
                    │  Ingress     │ │ Ingress ││     │   │
                    │  Sealed-Sec  │ │ Sealed-S││     │   │
                    │              │ │ Loadgen ││     │   │
                    └──────────────┘ └─────────┘│     │   │
                                                 │     │   │
                                   ┌─────────────▼─┐   │   │
                                   │  monitoring ns │   │   │
                                   │ (4 Applications│   │   │
                                   │  land here)    │   │   │
                                   │                │   │   │
                                   │ 📈 Prom Rules   │   │   │
                                   │ 📊 Grafana Dash │   │   │
                                   │ 🔔 Alertmanager │   │   │
                                   │ 🔎 ServiceMons  │◄──┘   │
                                   │ 🌐 Blackbox Exp │◄──────┘  (own Helm-based App)
                                   │ 💾 Local PVC Exp│◄────────  (own App)
                                   └────────────────┘
                                                              │
                                            ┌─────────────────▼──┐
                                            │  todolist-loadtest  │
                                            │  (standalone k6 App)│
                                            │  → todolist-prod ns │
                                            │  manual sync only    │
                                            └─────────────────────┘
```

> ℹ️ **ArgoCD** and the **kube-prometheus-stack** are installed via **Helm** into their own dedicated namespaces (`argocd` and `monitoring`), while every application workload and every monitoring resource is synced declaratively through the **App-of-Apps** pattern. The `todolist-staging`, `todolist-prod` and `monitoring` namespaces are auto-created by ArgoCD (`CreateNamespace=true`). The **Blackbox Exporter** and the **local PVC storage exporter** are *not* bundled inside the main `monitoring` Kustomize app — each is deployed by its own dedicated ArgoCD Application. The **k6 load generator** ships both bundled inside the `prod` overlay (as an ArgoCD Sync Hook Job) and as its own standalone ArgoCD Application (`todolist-loadtest`) for on-demand runs.

---

## 📁 Project Structure

```
MERN-app-End-to-End-Project/
│
├── Application-Code/
│   ├── backend/                          # Node.js / Express API source
│   ├── frontend/                         # React application source
│   └── docker-compose.yaml               # Local multi-container dev environment
│
├── Jenkins/
│   ├── Jenkinsfile-backend                # CI/CD pipeline for the backend service
│   └── Jenkinsfile-frontend               # CI/CD pipeline for the frontend service
│
└── Kubernetes-Manifests-file/
    │
    ├── argocd/
    │   ├── app-of-apps.yaml               # Root ArgoCD Application "todolist-app"
    │   └── applications/
    │       ├── blackbox-exporter.yaml     # ArgoCD App → Helm chart + custom Probe CR (monitoring ns)
    │       ├── loadtest.yaml              # ArgoCD App → overlays/prod/loadgenerator (manual sync)
    │       ├── monitoring.yaml            # ArgoCD App → monitoring/ (alertmanager+grafana+rules+servicemonitors)
    │       ├── prod.yaml                  # ArgoCD App → overlays/prod
    │       ├── pvc-exporter.yaml          # ArgoCD App → monitoring/pvc-exporter
    │       └── staging.yaml               # ArgoCD App → overlays/staging
    │
    ├── base/
    │   ├── kustomization.yaml             # Aggregates frontend + backend + database
    │   │
    │   ├── backend/
    │   │   ├── deployment.yaml            # todolist-backend-deployment
    │   │   ├── kustomization.yaml
    │   │   └── service.yaml
    │   │
    │   ├── database/
    │   │   ├── configmap.yaml
    │   │   ├── kustomization.yaml
    │   │   ├── pvc.yaml                   # mongodb-pvc (1Gi)
    │   │   ├── secret.yaml                # base MongoDB secret (overridden by sealed secrets per env)
    │   │   ├── service.yaml               # exposes mongodb (27017) + metrics (9216)
    │   │   └── statefulset.yaml           # mongodb + mongodb-exporter sidecar
    │   │
    │   └── frontend/
    │       ├── configmap.yaml
    │       ├── deployment.yaml            # todolist-frontend-deployment
    │       ├── kustomization.yaml
    │       └── service.yaml
    │
    ├── monitoring/                         # Core stack synced by "monitoring-todolist-app"
    │   ├── kustomization.yaml              # aggregates: alertmanager, grafana, prometheus-rules, servicemonitors
    │   │
    │   ├── alertmanager/
    │   │   ├── alertmanager-config.yaml    # AlertmanagerConfig → routes to Telegram
    │   │   ├── kustomization.yaml
    │   │   ├── sealed-secret-telegram.yaml # Encrypted Telegram bot token
    │   │   └── secret.yaml
    │   │
    │   ├── blackbox-exporter/              # NOT part of monitoring/kustomization.yaml — synced by its own ArgoCD App
    │   │   ├── kustomization.yaml
    │   │   ├── values.yaml                 # Helm values for the prometheus-blackbox-exporter chart
    │   │   └── probes/
    │   │       ├── frontend-probe.yaml     # Probe CR: HTTP uptime check (staging + prod frontend)
    │   │       └── kustomization.yaml
    │   │
    │   ├── grafana/
    │   │   ├── kustomization.yaml
    │   │   └── dashboards/
    │   │       ├── kustomization.yaml
    │   │       └── todolist-dashboard.yaml # Custom Grafana dashboard (ConfigMap)
    │   │
    │   ├── prometheus-rules/
    │   │   ├── backend-alerts.yaml         # Down / high CPU / high memory / restarts
    │   │   ├── database-alerts.yaml        # Down / CPU / memory / restarts / PVC almost full
    │   │   ├── frontend-alerts.yaml        # Down / restarts
    │   │   └── kustomization.yaml
    │   │
    │   ├── pvc-exporter/                   # NOT part of monitoring/kustomization.yaml — synced by its own ArgoCD App
    │   │   ├── clusterrole.yaml            # Read access to PV/PVC/Node/StorageClass
    │   │   ├── clusterrolebinding.yaml
    │   │   ├── daemonset.yaml              # local-pvc-exporter (one pod per node, hostPath mount)
    │   │   ├── kustomization.yaml
    │   │   ├── service.yaml
    │   │   ├── serviceaccount.yaml
    │   │   └── servicemonitor.yaml
    │   │
    │   └── servicemonitors/
    │       ├── backend-servicemonitor.yaml
    │       ├── database-servicemonitor.yaml # scrapes mongodb-exporter metrics
    │       └── kustomization.yaml
    │
    └── overlays/
        ├── prod/
        │   ├── kustomization.yaml          # base + hpa + ingress + secrets + loadgenerator
        │   ├── hpa/
        │   │   ├── hpa-backend.yaml
        │   │   ├── hpa-frontend.yaml
        │   │   └── kustomization.yaml
        │   ├── ingress/
        │   │   ├── ingress.yaml            # host: todolist.local
        │   │   └── kustomization.yaml
        │   ├── loadgenerator/
        │   │   ├── configmap.yaml          # k6 script + env vars (target URLs, VUs)
        │   │   ├── job.yaml                # k6 Job, run as an ArgoCD Sync Hook
        │   │   └── kustomization.yaml
        │   └── secrets/
        │       ├── kustomization.yaml
        │       └── sealed-secret-database.yaml
        │
        └── staging/
            ├── kustomization.yaml          # base + mongo-express + secrets + ingress
            ├── ingress/
            │   ├── ingress.yaml            # host: staging.local (+ /mongo-express path)
            │   └── kustomization.yaml
            ├── mongo-express/
            │   ├── deployment.yaml         # DB admin UI (staging only)
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

Both `Jenkinsfile-backend` and `Jenkinsfile-frontend` follow the same shape, and are auto-triggered on every push via `githubPush()`. They run with `nodejs 'node18'`, keep the last **2** builds (`buildDiscarder`), enforce a **60-minute** timeout, and disallow concurrent builds.

```
🧹 Clean Workspace
    │
    ▼
📥 Checkout (GitHub, branch main)
    │
    ▼
🏷️  Set Image Tag ──────── latest git tag, else "sha-<short commit>"
    │
    ▼
⚙️  Install Dependencies (npm ci)
    │
    ▼
🔬 Trivy FS Scan ──────── vuln + secret scan, HIGH/CRITICAL, non-blocking (report archived)
    │
    ▼
📊 SonarQube Analysis
    │
    ▼
🚦 Quality Gate ────────── backend: non-blocking · frontend: blocking (aborts on failure)
    │
    ▼
🐳 Docker Build ─────────  labeled with image tag / build number / build date
    │
    ▼
🔬 Trivy Image Scan ─────  full report (non-blocking) + CRITICAL-only gate (blocking, fails build)
    │
    ▼
📤 Push to DockerHub ────  <tag> + latest
    │
    ▼
🔄 Update Staging ───────  kustomize edit set image → overlays/staging → git commit & push
    │
    ▼
✋ Deploy Production ────  only runs when the APPLY_PROD parameter is set to true
    │
    ▼
🔄 Update Prod ──────────  kustomize edit set image → overlays/prod → git commit & push (APPLY_PROD only)
    │
    ▼
♻️  ArgoCD Auto-Sync
```

> The **`APPLY_PROD`** boolean build parameter (default `false`) controls whether a given run also promotes the image straight to the `overlays/prod` overlay. Left unset, every push only updates **staging**; production promotion is an explicit, opt-in action.

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

## 🔍 Code Quality & Security Scanning

Every pipeline run is gated by two layers of automated scanning before an image is ever pushed:

| Tool | Stage | Scope | Behavior |
|------|-------|-------|----------|
| **Trivy (filesystem)** | `Trivy FS Scan` | Source dependencies + secrets, HIGH/CRITICAL | Report-only (`exit-code 0`), archived as `trivy-fs-report.json` |
| **SonarQube** | `SonarQube Analysis` + `Quality Gate` | Static code analysis (`sonar.sources=.`) | Backend: informational only · Frontend: blocks the pipeline on failure |
| **Trivy (image)** | `Trivy Image Scan` | Built Docker image, HIGH/CRITICAL then CRITICAL-only | First pass is report-only (`trivy-report.json`); second pass fails the build (`exit-code 1`) on any CRITICAL CVE (`trivy-critical-report.json`) |

Both projects are registered in SonarQube as `todolist-backend` and `todolist-frontend`, scanned via the `sonarqube-scanner` Jenkins tool and the `SonarQube-Server` server configuration.

---

## ☸️ Kubernetes & GitOps

This project follows the **App-of-Apps** GitOps pattern with ArgoCD.

### How It Works

1. `app-of-apps.yaml` defines the root Application **`todolist-app`**, which points to the `argocd/applications` folder and lets ArgoCD discover the child Applications automatically.
2. **Six** child Applications live under `argocd/applications/`:
   - `staging.yaml` (**todolist-staging**) → syncs `overlays/staging` into namespace `todolist-staging`, fully automated (`prune` + `selfHeal`)
   - `prod.yaml` (**todolist-prod**) → syncs `overlays/prod` into namespace `todolist-prod`, with `ignoreDifferences` on `spec.replicas` for both Deployments (so HPA-driven scaling isn't reverted by ArgoCD) and `ApplyOutOfSyncOnly` sync option
   - `monitoring.yaml` (**monitoring-todolist-app**) → syncs `Kubernetes-Manifests-file/monitoring` (alertmanager, grafana, prometheus-rules, servicemonitors) into namespace `monitoring`, fully automated
   - `blackbox-exporter.yaml` (**monitoring-blackbox-exporter**) → a **multi-source** Application that installs the official `prometheus-blackbox-exporter` Helm chart (from the `prometheus-community` chart repo) with values overridden from `monitoring/blackbox-exporter/values.yaml`, and applies the custom `Probe` CR from `monitoring/blackbox-exporter/probes`, into namespace `monitoring`, fully automated
   - `pvc-exporter.yaml` (**pvc-exporter**) → syncs `Kubernetes-Manifests-file/monitoring/pvc-exporter` into namespace `monitoring`, fully automated
   - `loadtest.yaml` (**todolist-loadtest**) → syncs `overlays/prod/loadgenerator` into namespace `todolist-prod`, with an **empty `syncPolicy`** (no automation) so the k6 load test only runs when manually synced from the ArgoCD UI/CLI
3. Jenkins updates the image tag directly inside the target overlay's `kustomization.yaml` (`images:` block) and pushes to `main`.
4. ArgoCD detects the diff and automatically syncs the corresponding namespace.

### Namespaces

| Namespace | Created By | Purpose |
|-----------|-----------|---------|
| `todolist-staging` | ArgoCD (`CreateNamespace=true`) | Staging environment workloads |
| `todolist-prod` | ArgoCD (`CreateNamespace=true`) | Production environment workloads + k6 load test Job |
| `monitoring` | ArgoCD (`CreateNamespace=true`) | Prometheus rules/dashboards, Alertmanager, Blackbox Exporter, PVC Exporter |
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

> **HPA** and **Ingress** are defined as standalone resources directly inside each overlay's `kustomization.yaml` rather than being patched onto shared base manifests — this keeps staging and prod fully independent.

### Kustomize Overlay Structure

```yaml
# overlays/prod/kustomization.yaml
resources:
  - ../../base/
  - hpa
  - ingress
  - secrets
  # loadgenerator is added separately (see 🧪 Load Testing)

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

The observability stack is split across **four** ArgoCD Applications, all landing in the `monitoring` namespace:

| ArgoCD Application | Source | What it does |
|---------------------|--------|---------------|
| **monitoring-todolist-app** | `monitoring/` (kustomize) | Prometheus alerting rules, ServiceMonitors, the Grafana dashboard ConfigMap, and Alertmanager's Telegram routing |
| **monitoring-blackbox-exporter** | Helm chart `prometheus-blackbox-exporter` + `monitoring/blackbox-exporter/` | Deploys the Blackbox Exporter itself (via Helm) plus the custom `Probe` CR that performs synthetic HTTP checks |
| **pvc-exporter** | `monitoring/pvc-exporter/` | Deploys `local-pvc-exporter`, a DaemonSet that reports real on-disk usage for local PVCs |
| **todolist-loadtest** *(optional)* | `overlays/prod/loadgenerator` | Not monitoring per se, but generates the traffic the dashboards visualize |

| Sub-component | What it does |
|----------------|--------------|
| **Prometheus Rules** | Alerting rules for backend, frontend, and database — service down, container restarts, high CPU/memory, PVC almost full |
| **ServiceMonitors** | Scrape backend `/metrics` and the `mongodb-exporter` sidecar metrics from both `todolist-staging` and `todolist-prod` |
| **Blackbox Exporter** | Installed via its official Helm chart (`values.yaml` configures the `http_2xx`, `tcp_connect`, `dns` and `icmp` modules, plus an auto-created `ServiceMonitor`); a `Probe` CR (`frontend-probe.yaml`) then runs an `http_2xx` uptime check against the frontend service in both staging and prod |
| **Local PVC Exporter** | A DaemonSet (`local-pvc-exporter`) running on every node with a read-only `hostPath` mount; it reports real disk usage (`local_pvc_capacity_bytes`, `local_pvc_used_bytes`, `local_pvc_available_bytes`, `local_pvc_used_ratio`) for local PVCs such as MongoDB's, scraped via its own `ServiceMonitor` |
| **Grafana Dashboard** | A custom "🚀 TodoList Monitoring" dashboard (provisioned via ConfigMap) with an environment selector (`todolist-staging` / `todolist-prod`) showing service status, CPU/memory usage vs limits, container restarts, **MongoDB PVC storage usage**, HPA scaling, and active alerts |
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
| **Node.js** (Jenkins tool `node18`) | Build environment (backend & frontend) | 18+ |
| **SonarQube** | Static code analysis + Quality Gate | Server configured as `SonarQube-Server` |
| **Trivy** | Filesystem & image vulnerability/secret scanning | Latest |
| **Docker** | Container runtime | 24+ |
| **Kustomize** | K8s manifest patching | v5+ |
| **ArgoCD** | GitOps controller (installed via Helm) | v2.x |
| **Kubernetes** | Container orchestration | v1.28+ |
| **Helm** | Kubernetes package manager (used for ArgoCD, kube-prometheus-stack, and the Blackbox Exporter Application) | v3+ |
| **Sealed Secrets Controller** | Encrypts/decrypts SealedSecret CRDs | Latest |
| **Prometheus + Grafana** | Metrics & dashboards (kube-prometheus-stack) | Latest |
| **Blackbox Exporter** | HTTP uptime probing (deployed as an ArgoCD-managed Helm release) | Chart `prometheus-blackbox-exporter` 11.18.0 |
| **Metrics Server** | Required for HPA to function | Latest |
| **k6** | Load testing (runs in-cluster via the `grafana/k6` image) | Latest |

### Jenkins Credentials Required

| Credential ID | Type | Usage |
|--------------|------|-------|
| `github-token` | Username/Password | GitHub checkout & GitOps push |
| `Dockerhub` | Username/Password | DockerHub image push |

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

This single command bootstraps **staging**, **prod**, **monitoring**, **Blackbox Exporter**, and **PVC Exporter**, and registers the **load test** Application through ArgoCD automatically (namespaces are created on the fly). The load test Application itself stays unsynced until you trigger it manually.

### 5. Configure Jenkins

- Create two **Pipeline** jobs, one pointing to `Jenkins/Jenkinsfile-backend` and one to `Jenkins/Jenkinsfile-frontend`
- Enable the **GitHub webhook trigger** on both
- Configure the `node18` NodeJS tool and the `sonarqube-scanner` / `SonarQube-Server` SonarQube integration
- Add the required credentials (`github-token`, `Dockerhub`)

### 6. Trigger the Pipelines

```bash
git push origin main
# Jenkins webhook fires → backend and/or frontend pipeline starts automatically
# Set APPLY_PROD=true on a manual build run to also promote the image to overlays/prod
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
- Only promoted from Jenkins when the `APPLY_PROD` parameter is enabled
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
<img src="https://img.shields.io/badge/Quality-SonarQube-4E9BCD?style=flat-square"/>
<img src="https://img.shields.io/badge/Security-Trivy-1904DA?style=flat-square"/>
<img src="https://img.shields.io/badge/Secrets-Sealed--Secrets-2596BE?style=flat-square"/>
<img src="https://img.shields.io/badge/Monitoring-Prometheus%20%2B%20Grafana-F46800?style=flat-square"/>
<img src="https://img.shields.io/badge/Alerts-Telegram-26A5E4?style=flat-square"/>
<img src="https://img.shields.io/badge/Load%20Testing-k6-7D64FF?style=flat-square"/>
<img src="https://img.shields.io/badge/License-MIT-green?style=flat-square"/>

</div>