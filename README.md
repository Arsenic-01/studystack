# 📚 StudyStack

A centralized, high-performance platform for students and teachers to manage and share study materials efficiently.

🔗 **Live Website:** [StudyStack](https://studystack01.vercel.app/)  
🔗 **Source Code:** [GitHub Repository](https://github.com/Arsenic-01/studystack)

---

## 🎥 Demo

[![StudyStack Demo](https://img.youtube.com/vi/bcyYHZSmW88/0.jpg)](https://youtu.be/bcyYHZSmW88)

_Click the image above to watch the video demo._

---

## 🚀 About StudyStack

StudyStack is a **notes storage platform** designed for colleges where:

- **Students** can browse and download notes easily.
- **Teachers** can upload study materials for their students.
- **Admins** have full control over managing content and user access.

It provides a **fast, secure, and highly scalable** solution for academic content sharing, built with modern web technologies.

---

## 🌟 Features

✅ **Role-based Access Control (RBAC)** to ensure proper authorization for Students, Teachers, and Admins.  
✅ **Efficient Content Management** for notes, video links, and quizzes.  
✅ **Modern UI/UX** for a smooth, intuitive user experience.  
✅ **Fast and Secure Storage** powered by Appwrite's dedicated storage buckets.  
✅ **Blazing-fast Performance** through advanced caching and server-side optimizations.

### ✨ Key Improvements

This project has been optimized for scalability and performance using the latest industry best practices:

- **Server-Side Pagination:** Instead of fetching all data at once, the app now uses server-side pagination with **TanStack Query (React Query)**. The initial page is server-rendered for a fast first load, while subsequent pages are fetched on the client-side for a smooth, app-like experience.

- **Server-Side Filtering & Sorting:** All filtering and sorting logic is handled by the server, ensuring the client only receives the data it needs and maintaining a consistent and scalable user experience.

- **Direct-to-Drive Resumable Uploads:** Instead of proxying through a server, file uploads go directly from the client to Google Drive. This serverless approach eliminates file size limits, drastically reduces Vercel costs, and makes uploads significantly faster for users.

- **Scalable Admin Dashboard:** The admin dashboard is designed to handle massive amounts of data by fetching only the necessary information. Total counts for statistics are fetched separately from paginated table data, ensuring the dashboard loads instantly and remains performant.

- **Advanced Caching**: Client-side caching with staleTime is implemented to minimize redundant API calls, reduce server load, and provide an instant experience for users navigating between previously visited pages.

- **Hybrid Token Renewal for Google Drive:** A robust, high-availability system for Google Drive authentication. A scheduled Appwrite cron job proactively renews the OAuth token, while on-demand server-side logic acts as a resilient fallback, guaranteeing the upload functionality is always online.

- **Optimized Database Indexing:** Appwrite collections are indexed to ensure that search and filter queries remain fast and efficient, regardless of the number of documents in the database.

---

## 🛠️ Tech Stack

### **Frontend:**

- 🚀 **Next.js 15 (App Router)**
- 🎨 **Tailwind CSS** & **Shadcn UI**
- ⚡ **React 19 (RSC)**

### **Backend & Database:**

- 📦 **Appwrite** (Database, Storage & Authentication)
- ⚡ **Vercel** (Hosting & Serverless Functions)
- 🔗 **Google** (Drive Storage - For our college use-case)

### **State Management & Data Fetching:**

- 🏗️ **Zustand** (Global state management)
- 🔄 **TanStack Query (React Query)** (Server state management, caching, and data fetching)

---

## 🔧 Setup & Installation

1️⃣ **Clone the Repository**

```sh
git clone https://github.com/Arsenic-01/studystack.git
cd studystack
```

2️⃣ Install Dependencies

```sh
npm install
```

3️⃣ Set Up Environment Variables Create a .env.local file in the root directory and add your Appwrite and other service credentials:

```sh
PROJECT_ID=
API_KEY=
DATABASE_ID=
USER_COLLECTION_ID=
NOTE_COLLECTION_ID=
BUCKET_ID= #(optional, if you're using appwrite then ignore the google drive code)
RESEND_API_KEY=
SUBJECT_COLLECTION_ID=
YOUTUBE_COLLECTION_ID=
SESSION_COLLECTION_ID=
LOGIN_COLLECTION_ID=
FORM_COLLECTION_ID=

GOOGLE_REFRESH_TOKEN_COLLECTION_ID=
GOOGLE_DRIVE_TOKEN_DOC_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CLIENT_ID=GOOGLE_REFRESH_TOKEN=
GOOGLE_DRIVE_FOLDER_ID=

NEXT_PUBLIC_ALGOLIA_APP_ID=
ALGOLIA_ADMIN_KEY=
NEXT_PUBLIC_ALGOLIA_SEARCH_KEY=
NEXT_PUBLIC_ALGOLIA_INDEX_NAME=
```

4️⃣ Run the Development Server

```sh
npm run dev
```

Visit `http://localhost:3000/` to view the app locally.

---

## 🤝 **Contributing**

1. Fork the repository
2. Create a new branch: `git checkout -b feature-branch`
3. Commit your changes: `git commit -m "Added new feature"`
4. Push to your branch: `git push origin feature-branch`
5. Submit a pull request 🎉

---

## 📜 License

Copyright (c) 2024-present, `Vedant Bhor`.

This project is licensed under the MIT License. See the [License.md](LICENSE.md) file for details.

---

## 📬 Contact

💡 Got suggestions or feedback? Feel free to connect!

📧 **Email:** [vedbhor25@gmail.com](mailto:vedbhor25@gmail.com)  
🐦 **Twitter:** [@arsenic_dev](https://x.com/arsenic_dev)  
👨‍💻 **LinkedIn:** [Vedant Bhor](https://www.linkedin.com/in/vedant-bhor-39287828b/)
