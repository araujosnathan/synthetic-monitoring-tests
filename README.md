# Synthetic Monitoring with Playwright, Application Insights and Blob Storage

## What is Synthetic Monitoring?

Synthetic Monitoring is a proactive monitoring technique that simulates real user interactions with your web application. Instead of waiting for problems to happen with real users, you run automated tests continuously to detect issues before they affect your users.

### Why use Synthetic Monitoring?

- **Early Detection**: Identifies problems before real users are impacted
- **24/7 Monitoring**: Works even when there's no real traffic
- **Consistent Metrics**: Provides standardized data about performance and availability
- **Complete Coverage**: Tests critical business flows automatically

## Solution Architecture

This project combines four main technologies to create a complete monitoring system:

### 🎭 Playwright - The Test Engine
**Why Playwright?**
- Supports multiple browsers (Chrome, Firefox, Safari)
- Fast and reliable execution
- Advanced features like screenshots, videos and network interception
- Modern and intuitive API

### ☁️ Azure Functions - Serverless Execution
**Why Azure Functions?**
- On-demand execution without managing infrastructure
- Automatically scales as needed
- Native integration with other Azure services
- Optimized cost (pay only for what you use)

### 📊 Application Insights - Telemetry and Observability
**Why Application Insights?**
- Automatic performance metrics collection
- Integrated dashboards and alerts
- Correlation between different telemetry types
- Powerful queries with KQL (Kusto Query Language)

### 📁 Blob Storage - Evidence Storage
**Why Blob Storage?**
- Scalable and reliable storage
- Ideal for media files (screenshots, videos)
- Simple integration with other Azure tools
- URL access for quick visualization

## Project Structure

```
src/
├── functions/
│   └── synthetic-monitor.ts      # Main test orchestrator
├── support/
│   ├── azure/                    # Azure services integrations
│   ├── pages/                    # Page Objects for test organization
│   ├── reporter/                 # Custom reporting
│   └── services/                 # Auxiliary services (auth, etc)
└── tests/
    └── *.spec.ts                 # Specific test scenarios
```

## Main Components

### 🔧 Azure Functions - The Orchestrator
The Azure Function (`synthetic-monitor.ts`) acts as the central point that:
- Receives triggers (timer, HTTP, or other events)
- Initializes the Playwright browser
- Executes test scenarios
- Collects metrics and evidence
- Sends data to Application Insights
- Stores screenshots/videos in Blob Storage

**Why an Azure Function?**
- Scheduled execution (CRON jobs)
- Automatic scalability
- No need to maintain servers
- Native integration with Azure ecosystem

### 📊 Application Insights Integration
The telemetry system captures:
- **Custom Events**: Test start/end, specific actions sent for Availability to see which tests are passing or failing
- **Metrics**: Response time, test duration
- **Exceptions**: Detailed failures and errors

**Benefits:**
- Automatic dashboards in Azure Portal
- Metrics-based alerts
- Trend analysis over time
- Correlation between different data types

### 📁 Blob Storage - Visual Evidence
Blob Storage stores visual evidence from tests:
- **Screenshots**: Captured on failures or important milestones
- **Reports**: HTML or JSON files with detailed results

**Why store evidence?**
- Faster debugging when tests fail
- Audit and compliance
- Visual regression analysis
- Sharing with development teams

### 📋 Custom Reporter - The Bridge between Playwright and Azure

**What is a Custom Reporter?**
Playwright allows creating custom reporters that intercept test results and send data to external systems. In this project, we developed a custom reporter that automatically:

- **Captures results in real-time**: During test execution
- **Sends telemetry to Application Insights**: Metrics, events and exceptions
- **Uploads evidence to Blob Storage**: Screenshots, videos and traces
- **Correlates data**: Links visual evidence with telemetry

**Why use a Custom Reporter?**
- **Complete automation**: No need to remember adding telemetry code to each test
- **Standardization**: All tests follow the same data collection pattern
- **Separation of concerns**: Test code focuses on business, reporter handles observability
- **Reusability**: Once configured, works for all project tests

**How it works:**
1. Playwright executes tests normally
2. The custom reporter is notified about events (start, end, failure)
3. For each event, the reporter collects relevant data (duration, screenshots, etc.)
4. Data is automatically sent to Application Insights and Blob Storage
5. Dashboards and alerts are updated in real-time

**Reporter Structure:**
```
src/support/reporter/
├── appinsights-reporter.ts    # Main reporter for Application Insights
```

You can see that is being used in `playwright.config.ts` as one of the reporters.

## Execution Flow

### 1. Execution Trigger
- **Timer Trigger**: Scheduled execution (e.g., every 5 minutes)

### 2. Environment Preparation
- Playwright browser initialization

### 3. Test Execution
- Navigation through pages using Page Objects
- Element and functionality verification
- Performance metrics capture
- Screenshots at critical points

### 4. Results Collection (via Custom Reporter)
The custom reporter automatically intercepts and processes:
- **Success**: Performance metrics, duration, screenshots
- **Failure**: Stack trace, error screenshot, page state
- **Network Data**: Slow requests, API failures
- **Complete Trace**: Detailed execution recording for debugging

### 5. Persistence and Alerts (Automated by Reporter)
- **Automatic sending** of telemetry to Application Insights
- **Automatic upload** of evidence to Blob Storage
- **Data correlation** between telemetry and visual evidence
- **Alert triggering** configured in Application Insights
- **Real-time updating** of dashboards

## Monitoring and Alerts

### Application Insights Dashboards
- **Availability**: Application uptime percentage
- **Performance**: Response time trends
- **Errors**: Frequency and types of failures
- **Usage**: Test execution patterns

### Recommended Alerts
1. **Test Failed**: Immediate alert when any critical test fails
2. **Performance Degraded**: When response time exceeds baseline
3. **Multiple Failures**: When several tests fail consecutively
4. **Low Availability**: When success percentage falls below threshold

## Getting Started


### Prerequisites

- **Node.js** (v18+)
- **Azure Functions Core Tools**: `npm install -g azure-functions-core-tools@4`
- **Azure CLI** for deployment

### Setup

### 1. Install Dependencies
```bash
npm install
npx playwright install
```

### 2. Environment Variables

Set these in your Azure Function App settings:

```json
{
  "AzureWebJobsStorage": "DefaultEndpointsProtocol=https;AccountName=<storage>;AccountKey=<key>",
  "FUNCTIONS_WORKER_RUNTIME": "node",
  "FUNCTIONS_EXTENSION_VERSION": "~4",
  
  //ScheduleTime
   "SYNTHETIC_MONITOR_SCHEDULE": "0 */10 * * * *",

  // Test Configuration
  "username": "<test-user-email>",
  "password": "<test-user-password>",
  "baseUrl": "<base-url>",
  
  // Azure Services
  "APPLICATIONINSIGHTS_CONNECTION_STRING": "<app-insights-connection>",
  "APPINSIGHTS_INSTRUMENTATIONKEY": "<app-insights-key>",
  "AZURE_BLOB_CONNECTION_STRING": "<blob-storage-connection>",
  "AZURE_BLOB_CONTAINER_NAME": "<container-name>",
}
```

### 3. Local Development
```bash
# Build and start locally
npm run build
npm run start

# Or watch mode for development
npm run dev
```

You might need to start Azurite to emulate an Azure Function environment
```bash
# Start azurite
azurite --location ./azurite --debug ./azurite/debug.log 

# If some port is already being used you can start using other ports
azurite --location ./azurite --debug ./azurite/debug.log --blobPort 10000 --queuePort 11001 --tablePort 11002
```

## Next Steps

### Test Expansion
- Add new critical business scenarios

### Observability Improvements
- Configure custom dashboards
- Implement intelligent alerts
- Add correlation with real user metrics

### Advanced Automation
- Configure conditional execution based on deploy
- Implement auto-healing based on test results using some AI Agent.

---

This project provides a solid foundation for proactive web application monitoring, allowing you to detect problems before they impact real users. This article was used as initial research in this theme and was make some improvements like project structure, reporter and etc: [synthetic-monitoring-in-application-insights](https://techcommunity.microsoft.com/blog/azurearchitectureblog/synthetic-monitoring-in-application-insights-using-playwright-a-game-changer/4400509)
