# Express.js Chatzone API

Selamat datang di repositori Express.js Chatzone API! Proyek ini bertujuan untuk menyediakan backend yang kuat dan skalabel untuk aplikasi chat menggunakan Express.js dan MySQL.

Welcome to the Express.js Chatzone API repository! This project aims to provide a robust and scalable backend for a chat application using Express.js and MySQL.

## 📚 Daftar Isi / Table of Contents

- [Pengenalan / Introduction](#pengenalan--introduction)
- [Fitur / Features](#fitur--features)
- [Teknologi / Technologies](#teknologi--technologies)
- [Instalasi / Installation](#instalasi--installation)
- [Penggunaan / Usage](#penggunaan--usage)
- [Endpoint API](#endpoint-api)
- [Kontribusi / Contributing](#kontribusi--contributing)

## 📖 Pengenalan / Introduction

Express.js Chatzone API dirancang untuk menangani pengiriman pesan dalam aplikasi chat. API ini mendukung berbagai fitur seperti otentikasi pengguna, riwayat pesan, dan chat grup.

The Express.js Chatzone API is designed to handle messaging for a chat application. It supports various features such as user authentication, message history, and group chats.

## ✨ Fitur / Features

- Otentikasi dan otorisasi pengguna
- Mendukung chat pribadi dan grup
- Penyimpanan dan riwayat pesan
- Desain API RESTful

- User authentication and authorization
- Support for private and group chats
- Message history and storage
- RESTful API design

## 🛠️ Teknologi / Technologies

- **JavaScript**: Bahasa pemrograman utama yang digunakan untuk pengembangan.
- **Express.js**: Framework aplikasi web minimal dan fleksibel untuk Node.js.
- **MySQL**: Database relasional untuk menyimpan data pengguna dan riwayat chat.

- **JavaScript**: The primary language used for development.
- **Express.js**: A minimal and flexible Node.js web application framework.
- **MySQL**: A relational database for storing user data and chat history.

## 🚀 Instalasi / Installation

Untuk memulai dengan Express.js Chatzone API, ikuti langkah-langkah berikut:

To get started with the Express.js Chatzone API, follow these steps:

1. Clone repositori:
    ```sh
    git clone https://github.com/Resky89/express.js-chatzone-api.git
    cd express.js-chatzone-api
    ```

2. Instal dependensi:
    ```sh
    npm install
    ```

3. Atur variabel lingkungan. Buat file `.env` di direktori root dan tambahkan variabel yang diperlukan:
    ```env
    PORT=3000
    DB_HOST=your_host
    DB_USER=your_username
    DB_PASSWORD=your_password
    DB_NAME=your_database_name
    DB_PORT=3306
    NGROK_AUTH_TOKEN=your_ngrok_auth_token
    ```

4. Mulai server:
    ```sh
    npm start
    ```

1. Clone the repository:
    ```sh
    git clone https://github.com/Resky89/express.js-chatzone-api.git
    cd express.js-chatzone-api
    ```

2. Install the dependencies:
    ```sh
    npm install
    ```

3. Set up the environment variables. Create a `.env` file in the root directory and add the necessary variables:
    ```env
    PORT=3000
    DB_HOST=your_host
    DB_USER=your_username
    DB_PASSWORD=your_password
    DB_NAME=your_database_name
    DB_PORT=3306
    NGROK_AUTH_TOKEN=your_ngrok_auth_token
    ```

4. Start the server:
    ```sh
    npm start
    ```

## 📖 Penggunaan / Usage

Setelah server berjalan, Anda dapat mengakses API di `http://localhost:3000`. Anda dapat menggunakan tools seperti Postman untuk menguji endpoint.

Once the server is running, you can access the API at `http://localhost:3000`. You can use tools like Postman to test the endpoints.

## 📡 Endpoint API

Berikut adalah beberapa endpoint API utama:

Here are some of the main API endpoints:

- `POST /api/auth/register`: Mendaftarkan pengguna baru / Register a new user
- `POST /api/auth/login`: Masuk sebagai pengguna yang ada / Log in an existing user
- `GET /api/users`: Mendapatkan daftar semua pengguna / Get a list of all users
- `GET /api/chats`: Mendapatkan daftar semua chat / Get a list of all chats
- `POST /api/chats`: Membuat chat baru / Create a new chat
- `GET /api/chats/:chatId/messages`: Mendapatkan pesan untuk chat tertentu / Get messages for a specific chat
- `POST /api/chats/:chatId/messages`: Mengirim pesan ke chat tertentu / Send a message to a specific chat

Untuk daftar lengkap endpoint API dan deskripsinya, silakan merujuk ke [Dokumentasi API](API_DOCUMENTATION.md).

For a full list of API endpoints and their descriptions, please refer to the [API Documentation](API_DOCUMENTATION.md).

## 🤝 Kontribusi / Contributing

Kami menyambut kontribusi untuk Express.js Chatzone API! Jika Anda memiliki ide, saran, atau laporan bug, silakan buka issue atau kirim pull request.

We welcome contributions to the Express.js Chatzone API! If you have any ideas, suggestions, or bug reports, please open an issue or submit a pull request.

1. Fork repositori / Fork the repository
2. Buat cabang baru (`git checkout -b feature/your-feature`) / Create a new branch (`git checkout -b feature/your-feature`)
3. Commit perubahan Anda (`git commit -am 'Add some feature'`) / Commit your changes (`git commit -am 'Add some feature'`)
4. Push ke cabang (`git push origin feature/your-feature`) / Push to the branch (`git push origin feature/your-feature`)
5. Buat pull request / Open a pull request
