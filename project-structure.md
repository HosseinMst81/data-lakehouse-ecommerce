# Project Structure

Generated on: 6/13/2026, 3:40:00 PM
Excluded: .git, .venv, phase6-dashboard/frontend/node_modules, phase6-dashboard/frontend/public

text```
├── notebooks/
│   ├── .ipynb_checkpoints/
│   │   ├── phase3_data_quality-checkpoint.ipynb
│   │   ├── phase4_silver_layer-checkpoint.ipynb
│   │   └── phase5_gold_layer-checkpoint.ipynb
│   ├── spark-warehouse/
│   ├── phase3_data_quality.ipynb
│   ├── phase4_silver_layer.ipynb
│   └── phase5_gold_layer.ipynb
├── phase1-environment-setup/
│   ├── jupyter/
│   │   └── Dockerfile
│   ├── scripts/
│   │   └── test_connection.py
│   ├── spark/
│   │   ├── Dockerfile
│   │   └── spark-defaults.conf
│   ├── docker-compose.yml
│   └── README.md
├── phase2-bronze-ingestion/
│   ├── data/
│   ├── jars/
│   │   ├── delta-spark_2.12-3.2.0.jar
│   │   └── delta-storage-3.2.0.jar
│   ├── scripts/
│   │   └── bronze_ingest.py
│   ├── spark/
│   │   └── spark-defaults.conf
│   └── README.md
├── phase3-data-quality/
│   └── notebooks/
│       └── phase3_data_quality.ipynb
├── phase4-silver-layer/
│   └── notebooks/
│       └── phase4_silver_layer.ipynb
├── phase5-gold-layer/
│   └── notebooks/
│       └── phase5_gold_layer.ipynb
├── phase6-dashboard/
│   ├── backend/
│   │   ├── Dockerfile
│   │   ├── main.py
│   │   └── requirements.txt
│   └── frontend/
│       ├── src/
│       │   ├── assets/
│       │   │   ├── hero.png
│       │   │   ├── react.svg
│       │   │   └── vite.svg
│       │   ├── components/
│       │   │   ├── ui/
│       │   │   │   ├── button.tsx
│       │   │   │   └── card.tsx
│       │   │   ├── DailySalesChart.tsx
│       │   │   ├── Dashboard.tsx
│       │   │   ├── KpiCards.tsx
│       │   │   ├── MonthlySalesChart.tsx
│       │   │   ├── SalesByCountryChart.tsx
│       │   │   ├── ThemeToggle.tsx
│       │   │   ├── TopCustomersTable.tsx
│       │   │   └── TopProductsChart.tsx
│       │   ├── lib/
│       │   │   ├── api.ts
│       │   │   ├── chartTheme.ts
│       │   │   ├── types.ts
│       │   │   └── utils.ts
│       │   ├── App.tsx
│       │   ├── index.css
│       │   └── main.tsx
│       ├── .gitignore
│       ├── components.json
│       ├── Dockerfile
│       ├── eslint.config.js
│       ├── index.html
│       ├── package-lock.json
│       ├── package.json
│       ├── README.md
│       ├── tsconfig.app.json
│       ├── tsconfig.json
│       ├── tsconfig.node.json
│       └── vite.config.ts
├── .gitignore
├── data.csv
├── LICENSE
├── README.md
└── requirements.txt
```