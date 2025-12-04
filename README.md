# 📬 Email Inbox — Partner-Configurable UI (Next.js + TypeScript)

This project implements a dynamic email inbox where the UI **changes based on the selected partner configuration**.  
Partners may have different branding, email metadata visibility, or available bulk actions (e.g., Partner B allows _Mark Spam_; Partner A does not).

The app includes:

- Persistent inbox state per partner (via `localStorage`)
- Email detail page with reply flow
- Bulk actions (Read, Unread, Spam\*, Delete)
- Search and filtering
- Partner-level theme + branding
- Light/Dark mode toggle
- Automated test coverage

---

## 🚀 Tech Stack

| Category       | Tool                         |
| -------------- | ---------------------------- |
| Framework      | Next.js (App Router)         |
| Language       | TypeScript                   |
| Styling        | TailwindCSS                  |
| State & Config | React Context + LocalStorage |
| Testing        | Jest + React Testing Library |

---

## 🧠 Key Features

### 🔹 1. Partner Configuration System

Each partner controls:

- Theme colors
- Logo
- Feature toggles (e.g., snippet visibility, spam action)
- Storage scope (separate inbox per partner)

Example config:

| Feature               | Partner A | Partner B |
| --------------------- | --------- | --------- |
| Email Snippet in List | ✅        | ❌        |
| "Mark as Spam" button | ❌        | ✅        |
| Bulk Actions Toolbar  | ✅        | ✅        |
| Theme                 | Blue      | Green     |

Configuration files are stored as:

/data/partners/partnerA.json
/data/partners/partnerB.json

yaml
Copy code

---

### 🔹 2. Inbox UI

- Displays sender, subject, snippet\*, and date
- Unread/read visual indicators
- Row checkboxes for multiselect workflow
- Fully functional bulk toolbar
- Search input filters by sender or subject

\* snippet visibility is partner-controlled.

---

### 🔹 3. Email Detail View

Includes:

- Sender, subject, timestamp
- Full email body (`dangerouslySetInnerHTML`)
- Actions:

  - Mark Read / Unread
  - Mark Spam (if enabled)
  - Delete
  - Reply (inline editor UI)

Reply send is a no-op by requirement.

---

### 🔹 4. Accessibility & Usability

- Keyboard-friendly interactive controls
- Semantic HTML roles (`combobox`, `listitem`, `button`, `checkbox`)
- Cursor feedback on all CTAs

---

## 🧪 Testing Strategy

Unit + integration level tests using:

- **Jest**
- **React Testing Library**

Coverage includes:

✔ Inbox rendering and metadata  
✔ Selection + bulk toolbar behavior  
✔ Partner-driven feature visibility  
✔ Search functionality  
✔ Email detail actions  
✔ Theme toggle

### Run tests:

```bash
pnpm test
▶️ Getting Started
Install dependencies
bash
Copy code
pnpm install
Start app
bash
Copy code
pnpm dev
The inbox will be available at:

arduino
Copy code
http://localhost:3000
📁 Project Structure
bash
Copy code
/components
  ├─ InboxList.tsx
  ├─ EmailRow.tsx
  ├─ EmailDetailClient.tsx
  ├─ PartnerSwitcher.tsx
  ├─ PartnerContext.tsx
/data
  ├─ emails.json
  └─ partners/*.json
/test
  ├─ InboxList.test.tsx
  ├─ PartnerConfig.test.tsx
  ├─ EmailDetail.test.tsx
  ├─ ThemeToggle.test.tsx
  ├─ EmailRow.test.tsx
```
