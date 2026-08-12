# 🚀 Relu Consultancy — Autonomous Enterprise Intelligence Engine

[![Next.js](https://img.shields.io/badge/Next.js-14.2-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![OpenRouter](https://img.shields.io/badge/OpenRouter-Multi--LLM-6466F1?style=for-the-badge&logo=openai&logoColor=white)](https://openrouter.ai/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://relu-ai-dev-hiring-virid.vercel.app/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![Status](https://img.shields.io/badge/Build-Passing-10B981?style=for-the-badge)](https://github.com/kumarvishal10351/Company-AI)

> **Relu Consultancy** is an enterprise-grade, autonomous company research and intelligence synthesis platform. Built on Next.js 14, it orchestrates real-time web crawling, Google search discovery via Serper.dev, multi-LLM reasoning via OpenRouter, vector PDF report generation, and automated Discord bot dispatches — all within an ultra-sleek, pixel-perfect pure black dark-mode UI inspired by ChatGPT.

## 🌐 Live Demo

**🔗 [relu-ai-dev-hiring-virid.vercel.app](https://relu-ai-dev-hiring-virid.vercel.app/)**

> Try it out — enter any company name or URL and watch the autonomous research pipeline in action.

---

## 📸 Key Interfaces & UI Experience

- **1:1 ChatGPT Pure Black Theme (`#000000`)** — Stadium pill prompt input, collapsible navigation sidebar, interactive model selector, and inline progress pipeline.
- **Direct Canvas Flow** — Assistant synthesis reports render directly on pure black with clean typography, key-value metadata grids, and zero heavy grey box containers.
- **Quick Research Tags** — One-click company pills (Microsoft, Tesla, Stripe, NVIDIA, Amazon, Apple, OpenAI) for instant research kickoff.
- **Model Selector Dropdown** — Switch between 80+ LLMs on-the-fly directly from the top navigation bar.

---

## ✨ Features & Engineering Highlights

### 🔍 1. Real-Time Deep Crawling Engine
- **Intelligent URL Discovery** — Automatically resolves domain links from company names or extracts sitemap links.
- **DOM Parsing & Sanitization** — Uses Cheerio to parse HTML, extract clean main body content, strip scripts/styles/ads, and extract public contact vectors (emails, phone, address, social media links).
- **Deduplication & Page Scoring** — Filters redundant pages to prioritize high-value pages (`/about`, `/products`, `/team`, `/pricing`).

### 🧠 2. Universal OpenRouter Multi-LLM Orchestration
- **Dynamic Model Switching** — Supports **any model** on OpenRouter (`Mistral Large`, `Google Gemini 2.0 Flash`, `OpenAI GPT-4o / GPT-4o Mini`, `Anthropic Claude 3.5 Sonnet`, `DeepSeek V3`).
- **Resilient Fallback Pipeline** — Includes automatic secondary fallback to `mistralai/mistral-large` if the primary model endpoint experiences rate limits or API downtime.

### 📊 3. Automated Competitive Intelligence & Pain Point Extraction
- **Market Competitor Identification** — Identifies 4–6 direct market rivals operating in the same domain and geographic region with specific competitive rationale.
- **Strategic Pain Point Analysis** — Synthesizes 4–6 tailored business challenges and opportunities based on market positioning and industry trends.

### 📄 4. Vector PDF Generation Engine
- **Client-Side Synthesis** — Powered by `jsPDF` and `jspdf-autotable` with zero external server dependencies.
- **Enterprise Design** — Clean dark theme vector typography, custom brand headers, multi-column key metadata tables, and page counters.

### 🤖 5. Discord Bot Integration & Dispatcher
- **Automated Webhooks** — Sends structured rich embeds with executive summaries, company metrics, applicant metadata, and downloadable report details directly to Discord channels.

---

## 🏗️ Architecture & System Sequence

```
+-----------------------------------------------------------------------------------+
|                                  USER INTERFACE                                   |
|               (ChatGPT 1:1 Pure Black UI / Stadium Prompt Bar / Next.js)           |
+----------------------------------------+------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                            NEXT.JS SSE API ORCHESTRATOR                           |
|                             (/api/research - Route Handler)                       |
+--------+-------------------------------+----------------------------------+-------+
         |                               |                                  |
         v                               v                                  v
+------------------+           +-------------------+             +------------------+
|   SERPER SEARCH  |           |   CHEERIO CRAWLER |             |   OPENROUTER LLM |
|   (Serper.dev)   |           | (DOM Sanitizer)   |             | (Multi-Model AI) |
+--------+---------+           +---------+---------+             +--------+---------+
         |                               |                                  |
         +-------------------------------+----------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                              STRUCTURED SYNTHESIS REPORT                          |
|             (Executive Summary, Metadata Grid, Pain Points, Competitors)          |
+----------------------------------------+------------------------------------------+
                                         |
                       +-----------------+-----------------+
                       |                                   |
                       v                                   v
        +----------------------------+       +----------------------------+
        |   PDF GENERATOR (jsPDF)    |       |   DISCORD BOT DISPATCHER   |
        |  (Client-Side Vector PDF)  |       |     (Discord REST API)     |
        +----------------------------+       +----------------------------+
```

---

## 📁 Repository Structure

```
relu-consultancy/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── discord/route.js      # Discord REST Webhook dispatcher
│   │   │   ├── models/route.js       # OpenRouter model list fetcher
│   │   │   └── research/route.js     # Server-Sent Events (SSE) research orchestrator
│   │   ├── globals.css               # ChatGPT pure black custom tokens & CSS resets
│   │   ├── layout.js                 # Root layout & Google Fonts integration
│   │   └── page.js                   # Main conversational state engine & prompt bar
│   ├── components/
│   │   ├── ApiSettings.js            # API keys & model selector form
│   │   ├── DiscordSettings.js        # Discord bot webhook configuration form
│   │   ├── HeroSection.js            # Main welcome view with stadium pill input
│   │   ├── ProgressIndicator.js      # Live 8-stage pipeline progress indicator
│   │   ├── ResearchReport.js         # Pure black assistant response report viewer
│   │   ├── Sidebar.js                # Collapsible navigation drawer
│   │   └── TopAppBar.js              # Header bar with OpenRouter model dropdown
│   ├── hooks/
│   │   └── useLocalStorage.js        # Persistent state hook for API keys & history
│   └── lib/
│       ├── crawler.js                # Cheerio web crawler & HTML parser
│       ├── discord.js                # Discord REST API client
│       ├── openrouter.js             # Universal OpenRouter & Mistral API client
│       ├── pdf.js                    # jsPDF client-side report generator
│       ├── serper.js                 # Serper.dev Google Search API client
│       └── utils.js                  # String sanitization & formatting helpers
├── .env.example                      # Sample environment variables
├── next.config.js                    # Next.js configuration
├── package.json                      # Project dependencies & scripts
└── tailwind.config.js                # Tailwind CSS custom color extensions
```

---

## 🛠️ Tech Stack & Technologies

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | Next.js 14 (App Router) | React server components, SSE streaming, route handlers |
| **Styling** | Vanilla CSS + Tailwind CSS | Custom pure black tokens (`#000000`), HSL accents, Inter font |
| **AI Orchestration** | OpenRouter REST API | Dynamic routing across 80+ LLMs with fallback safety |
| **Web Crawling** | Cheerio + Native Fetch | DOM parsing, link discovery, and text extraction |
| **Search Engine** | Serper.dev API | Real-time Google search indexing for company metadata |
| **Document Export** | jsPDF + jspdf-autotable | High-resolution client-side vector PDF generation |
| **Bot Integration** | Discord REST API | Structured embed dispatches via Discord webhooks |
| **Deployment** | Vercel | Automatic CI/CD with preview deployments |

---

## ⚡ Quick Start & Installation

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher

### 1. Clone Repository
```bash
git clone https://github.com/kumarvishal10351/Company-AI.git
cd Company-AI
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables (Optional)
Create a `.env.local` file in the root directory (API keys can also be configured directly via the UI Settings panel):

```env
OPENROUTER_API_KEY=sk-or-v1-your-openrouter-key
SERPER_API_KEY=your-serper-api-key
```

### 4. Run Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 5. Production Build
```bash
npm run build
npm run start
```

---

## ⚙️ API Configuration & LLM Setup

1. **OpenRouter API Key** — Obtain a key from [openrouter.ai](https://openrouter.ai) to enable multi-LLM synthesis.
2. **Serper Search Key** — Obtain a search key from [serper.dev](https://serper.dev) for real-time web search discovery.
3. Open the **Settings** panel in the app sidebar, paste your keys, and choose your preferred AI model from the dropdown.

---

## 🧪 Verification & Engineering Standards

- **Clean Compilation** — Verified with zero build warnings or lint errors (`npm run build`).
- **Resilient Fallbacks** — Automatic fallback handling for search, crawler timeouts, and LLM rate limits.
- **Pure Black Focus Reset** — Standardized cross-browser CSS reset preventing blue outline rings on input elements.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/kumarvishal10351/Company-AI/issues).

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<p align="center">
  Made with ❤️ by <strong>Kumar Vishal</strong> — <a href="https://github.com/kumarvishal10351">@kumarvishal10351</a>
</p>