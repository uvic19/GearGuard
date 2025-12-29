# 🛡️ GearGuard

**GearGuard** is a modern, full-stack **Computerized Maintenance Management System (CMMS)** designed to streamline facility operations, track equipment health, and manage maintenance workflows efficiently.

Built with **React**, **Supabase**, and **TailwindCSS**, it offers an enterprise-grade interface inspired by Odoo, featuring real-time tracking, drag-and-drop Kanban boards, and comprehensive reporting.

### 🟢 **Live Preview**: [https://gearguard25.netlify.app/](https://gearguard25.netlify.app/)

_(The application is live and connected to a test database. No setup required to test!)_

> [!NOTE]
> **Use these credentials to access seeded test data:**
>
> - **Email**: `kd190706@gmail.com`
> - **Password**: `admin123`

---

## 🚀 Key Features

- **📊 Interactive Dashboard**: Real-time overview of critical KPIs, equipment status, and open requests.
- **🔧 Maintenance Request Management**:
  - **Kanban Workflow**: Visual drag-and-drop board for request stages (New → In Progress → Repaired → Scrap).
  - **Smart Worksheets**: Integrated checklists for quality control and standardized maintenance procedures.
- **🏭 Asset & Equipment Tracking**:
  - Complete lifecycle management for machines, vehicles, and tools.
  - Track serial numbers, locations, and assigned technicians.
- **👥 Team Management**: Organize workforce into specialized teams (Electrical, Mechanical, IT) with workload distribution.
- **🏭 Work Centers**: Monitor production units with efficiency, capacity, and OEE targets.
- **📈 Analytics & Reporting**: Data visualization for resolution times, compliance rates, and technician performance.
- **🔐 Secure Authentication**: Role-based access via Supabase Auth.

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite)
- **Styling**: TailwindCSS + Lucide Icons
- **Backend & Database**: Supabase (PostgreSQL)
- **State Management**: React Context API
- **Drag & Drop**: @hello-pangea/dnd
- **Notifications**: react-toastify

---

## ⚡ Run Locally

Since the project is pre-configured for the hackathon explanation, you can simply:

1.  **Clone the Repository**

    ```bash
    git clone <repository_url>
    cd gearguard
    ```

2.  **Install Dependencies**

    ```bash
    npm install
    ```

3.  **Run Development Server**
    ```bash
    npm run dev
    ```

---



## 📄 License

This project is licensed under the MIT License.
Made for the Odoo x Adani University Hackathon