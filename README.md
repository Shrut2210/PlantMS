# Plant Management System (PlantMS)

Welcome to **PlantMS**, a full-stack e-commerce platform for browsing and purchasing plants, pots, seeds, and other gardening accessories.

## 🌱 Live Demo
[PlantMS is live!](https://plant-ms.vercel.app/)

## 📂 Repository
This project utilizes the **PlantMS** library from GitHub:
[GitHub - Shrut2210/PlantMS](https://github.com/Shrut2210/PlantMS)

## 🚀 Features
- User authentication and account management
- Product listing with images and descriptions
- Shopping cart and checkout functionality
- Order management system
- Review system for users to provide feedback

## 🛠️ Tech Stack
- **Frontend:** React, Next.js, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Tokens)
- **State Management:** Context API
- **Hosting:** Vercel (Frontend), Render/Atlas (Backend & Database)

## 📦 Installation
### Prerequisites
- Node.js (>=16)
- MongoDB (Local or Atlas)
- NPM/Yarn

### Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/Shrut2210/PlantMS.git
   cd PlantMS
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up environment variables:
   - Create a `.env` file in the root directory and configure the necessary variables:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   NEXT_PUBLIC_API_URL=your_backend_api_url
   ```
4. Run the development server:
   ```sh
   cd client
   npm run dev
   ```

## 🚀 Deployment
- The project is deployed using Vercel. To deploy your own version:
  ```sh
  vercel
  ```

## 🤝 Contributing
We welcome contributions! To contribute:
1. Fork the repository.
2. Create a new branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add new feature'`
4. Push to the branch: `git push origin feature-name`
5. Open a Pull Request.

## 📜 License
This project is licensed under the MIT License.

---
### 📧 Contact
For any questions or issues, feel free to reach out via GitHub Issues or connect on [GitHub - Shrut2210](https://github.com/Shrut2210).

