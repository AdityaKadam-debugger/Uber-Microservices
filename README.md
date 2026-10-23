# Uber Microservices Backend — Node.js, Express & RabbitMQ

An Uber-inspired, microservices-based ride-hailing backend built with **Node.js, Express.js, MongoDB, and RabbitMQ**. The project separates core business functionality into independent **User, Captain, and Ride services**, enabling modular development, independent execution, and asynchronous inter-service communication through message queuing.

This project focuses on backend engineering concepts, including microservices architecture, RESTful API development, JWT-based authentication, database integration, and event-driven communication.

## Overview

The system is organized into independently running services, each responsible for a specific domain of the ride-hailing application. RabbitMQ is used to facilitate asynchronous communication between services, reducing direct coupling and supporting event-driven workflows.

### Key Features

- **Microservices Architecture:** Separate User, Captain, and Ride services with distinct responsibilities.
- **Asynchronous Messaging:** RabbitMQ-based communication between services using message queues.
- **RESTful API Development:** HTTP endpoints built with Node.js and Express.js.
- **Authentication and Authorization:** JWT-based authentication where implemented.
- **Database Integration:** MongoDB and Mongoose for data persistence.
- **Captain Availability Management:** Manage captain availability status, where implemented.
- **Modular Backend Structure:** Organized controllers, routes, models, middleware, and database configuration.
- **API Gateway:** A dedicated gateway component for routing client requests, where configured.
- **Environment-Based Configuration:** Environment variables for service-specific settings and sensitive configuration.

## Technology Stack

| Category | Technologies |
|---|---|
| Runtime | Node.js |
| Backend Framework | Express.js |
| Architecture | Microservices |
| Messaging | RabbitMQ |
| Message Broker Protocol | AMQP |
| Database | MongoDB |
| ODM | Mongoose |
| Authentication | JSON Web Token (JWT) |
| API Communication | REST APIs over HTTP |
| Development Tools | Git, GitHub, npm, Postman |

## System Architecture

The application is divided into three core business services, with a gateway component in the project structure.

### 1. User Service
Responsible for user-related functionality, such as user registration, login, authentication, and user data management, depending on the implemented endpoints.

### 2. Captain Service
Responsible for captain-related functionality, including captain authentication, profile management, and availability status management, where implemented.

### 3. Ride Service
Responsible for ride-related operations, including ride request workflows and ride data management, depending on the implemented endpoints.

### 4. API Gateway
The gateway component is intended to provide a common entry point for client requests and route them to the appropriate backend services according to its configuration.

### 5. RabbitMQ Message Broker
RabbitMQ enables asynchronous communication between services through message queues. This allows services to exchange messages without requiring every interaction to happen as a direct synchronous HTTP request.

## Architecture Flow

```text
                 Client Application
                         |
                         v
                    API Gateway
                         |
             +-----------+-----------+
             |           |           |
             v           v           v
        User Service  Captain     Ride Service
                      Service         |
             |           |            |
             +-----------+------------+
                         |
                         v
                    RabbitMQ
               Asynchronous Messaging
```

*Conceptual overview. Actual routing and message flows depend on the implemented gateway, queue configuration, publishers, and consumers.*

## Project Structure

```text
Uber-Micro/
├── gateway/
├── user/
├── captain/
├── ride/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── app.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── .gitignore
└── README.md
```

Each service can maintain its own dependencies, environment variables, database configuration, and application entry point according to its implementation.

## Installation and Setup

### Prerequisites

Install the following before running the application:

- Node.js and npm
- MongoDB
- RabbitMQ
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/AdityaKadam-debugger/Uber-Microservices.git
cd Uber-Micro
```

Ensure that the cloned repository directory name matches the directory created on your computer.

### 2. Install Dependencies

Install dependencies separately in each service that contains a `package.json`.

```bash
cd user
npm install
```

Repeat for the other services:

```bash
cd ../captain
npm install

cd ../ride
npm install
```

Install gateway dependencies separately if the gateway has its own `package.json`.

### 3. Configure Environment Variables

Create a `.env` file inside each service directory, using its `.env.example` as a template.

Example:

```env
PORT=4003
MONGO_URI=mongodb://127.0.0.1:27017/uber_rides
JWT_SECRET=replace_with_a_secure_secret
RABBITMQ_URL=amqp://localhost
```

Use only the variables required by each service. Configure appropriate ports, database names, JWT secrets, and RabbitMQ connection settings based on your source code.

**Security:** Never commit `.env` files, passwords, database credentials, JWT secrets, or other sensitive configuration to GitHub.

### 4. Start MongoDB and RabbitMQ

Ensure MongoDB and RabbitMQ are running and accessible using the connection URLs configured in each service.

### 5. Run the Services

Start each service in a separate terminal using the start command defined in its `package.json`.

For example, if a service uses `server.js` as its entry point:

```bash
node server.js
```

Repeat for the User, Captain, Ride, and Gateway components as applicable.

Check each service's `package.json` for the correct entry point and available npm scripts.

## Engineering Concepts Demonstrated

This project provides practical exposure to:

- Microservices architecture and separation of concerns
- Backend development with Node.js and Express.js
- REST API design and HTTP request handling
- Asynchronous inter-service communication
- Message brokers and message queuing with RabbitMQ
- Event-driven architecture fundamentals
- JWT-based authentication and middleware
- MongoDB data modeling using Mongoose
- Environment-based application configuration
- Git version control and collaborative development workflows

## Future Improvements

Potential extensions for this project include:

- Docker and Docker Compose for service orchestration
- API Gateway routing, request validation, and centralized error handling
- RabbitMQ acknowledgements, retries, dead-letter queues, and idempotent consumers
- Centralized logging and distributed tracing
- Health checks and service monitoring
- Automated testing with Jest or another testing framework
- CI/CD pipelines using GitHub Actions
- OpenAPI/Swagger API documentation

These are proposed enhancements and should not be interpreted as already implemented features.

## Project Goals

The goal of this project is to develop a stronger understanding of distributed backend systems by building an Uber-inspired application with independently running services and asynchronous messaging.

It serves as a practical learning project for backend development, distributed systems fundamentals, message-driven communication, and scalable application design.

## Author

**Aditya Anil Kadam**

GitHub: [AdityaKadam-debugger](https://github.com/AdityaKadam-debugger)

---

*Built for learning and practicing Node.js microservices architecture, Express.js backend development, RabbitMQ messaging, and distributed application design.*
