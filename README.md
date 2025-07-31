## 🐾 Notifyly

**Notifyly** serves as a centralized notification service that manages all messaging from other systems (such as the Order Service and Billing Service).
Each of these services emits events through a RabbitMQ broker channel. Notifyly then determines the appropriate method and channel through which users should be notified.

## 📦 Getting Started

### ✅ Prerequisites

Make sure you have the following installed:

- [Docker](https://www.docker.com/)

### 🚀 Installation

Follow the steps below to set up the application locally:

1. **Clone the repository**
   ```bash
      git clone https://github.com/Abdul-Qoyyum/notifyly.git
   ```
2. **Navigate to the project directory**
    ```bash
       cd notifyly
    ```

3. **Duplicate the `.env.example` file and rename it to `.env`**
    ```bash
       cp .env.example .env
    ```

3. **Set Up Environment Variables** <br/><br/> 

    Open the `.env` file and update the environment variables as needed. Since we're using Docker, it's recommended to leave the values for `DB_HOST`, `REDIS_HOST`, and `RABBITMQ_HOST` unchanged.<br/><br/>

4. **Start the application using Docker**
   ```bash
      docker compose up -d --build
   ```
5. Note: Once the application is running, Docker automatically manages the initial data seeding and database setup. The application includes two default user accounts for testing purposes:  <br/><br/>
   Admin Account
    ```bash
    {
      "email": "mateo@example.com",
      "password": "password"
    }
    ```
   <br/><br/>
   User Account
   ```bash
    {
      "email": "janet@example.com",
      "password": "password"
    }
   ```
7. **Accessing the API Documentation**  
   Open your web browser and navigate to:  [http://localhost:8081/api/docs](http://localhost:8081/api/docs) <br/><br/>

8. **Accessing the RabbitMQ GUI to Monitor Processes**  
   Open your web browser and go to:  [http://localhost:15673](http://localhost:15673) <br/>
   ```bash
   username: guest
   password: guest
   ```
9. **Accessing the Docker MySQL Database**  
   Using the `DB_USERNAME` and `DB_PASSWORD` credentials, you can connect to the database via a MySQL client on port `3307`.

## 🧪 Running Tests
To run the test suite, follow these steps:
1. Install all required dependencies:
   ```bash
   npm install
   ```
2. **Execute end-to-end tests:**
   ```bash
     npm run test:e2e 
   ```

## 📂 Project Structure
```angular2html
    notifyly/
    ├── src/                # Symfony source files
    ├── tests/              # PHPUnit test files
    ├── .env.example        # Environment configuration
    └── ...
```

## Sample notification event
The title and body fields can include placeholders using the #{} syntax (e.g., #{orderId}). If the corresponding fields are present in the metadata object, Notifyly will automatically parse and replace the placeholders with their respective values before sending the notification.
```bash
   {
   
     "event_type": "orders.shipped",
     "title": "New Invoice Created (#{orderId})",
     "body": "Your invoice #{orderId} has been shipped. The amount is #{amount}",
     "channel": "email",
     "metadata": { "orderId": "R43223434", "amount": 100 }
   }
   ```


## 🛠️ Technologies Used
- Node.Js
- Redis
- Docker
- RabbitMQ
- MySQL

## 🙋‍♂️ Contributing
Contributions are welcome! Please fork the repository and submit a pull request.

