# Billor NestJS Challenge

This repository contains a project developed using the **NestJS** framework, focusing on implementing features related to authentication, transactions, users, and digital wallets.

Below, you will find information about the folder structure, dependencies, execution instructions, and how to test the application using the provided Postman collection.

---

## Project Structure

Below is the main organization of the project's folders and files:

```
root
├── data/                 # Data-related files (if applicable)
├── dist/                 # Compiled files
├── node_modules/         # Installed dependencies
├── src/                  # Main source code
│   ├── modules/          # Application modules
│   │   ├── auth/         # Authentication functionalities
│   │   ├── transactions/ # Financial transaction functionalities
│   │   │   ├── applications/
│   │   │   │   ├── commands/ # Commands for creating, canceling, and updating transactions
│   │   │   │   ├── events/   # Event handling related to transactions
│   │   │   │   ├── queries/  # Query handling
│   │   │   ├── domain/       # Domain definitions, such as aggregates and events
│   │   │   ├── infrastructure/ # Infrastructure implementation (RabbitMQ, Postgres, etc.)
│   │   │   ├── interfaces/  # DTO definitions and REST controllers
│   │   ├── users/           # User-related functionalities
│   │   ├── wallets/         # Digital wallet-related functionalities
│   ├── app.controller.ts    # Main controller
│   ├── app.module.ts        # Root module of the project
│   ├── app.service.ts       # Main application service
│   ├── main.ts              # Application entry file
├── test/                    # Unit and integration tests
├── .env                     # Environment variables
├── docker-compose.yml       # Docker Compose configurations
├── nest-cli.json            # NestJS CLI configurations
├── package.json             # Node.js dependency configuration
├── tsconfig.json            # TypeScript configurations
└── README.md                # Project documentation
```

---

## Technologies Used

- **Node.js**: Server-side JavaScript runtime.
- **NestJS**: Efficient and scalable Node.js framework.
- **TypeScript**: Language that adds static typing to JavaScript.
- **RabbitMQ**: Messaging system for service communication.
- **PostgreSQL**: Relational database.
- **MongoDB**: Non-relational database.
- **Docker**: For application containerization.

---

## Project Configuration

### Dependencies

To install the dependencies, run:

```bash
npm install
```

### Running the Application

1. Create a `.env` file based on the example file, adding the necessary configurations (such as database credentials and environment variables).
2. Start the services using Docker Compose:

```bash
docker-compose -f docker-compose.yaml up -d
```

3. Start the application in development mode:

```bash
nest start
```

The application will be available at: `http://localhost:3000`

---

## Modular Structure

The project uses a modular approach to organize functionalities, focusing on separation of concerns. Below are descriptions of some of the main modules:

### `Auth` Module

- Manages user authentication and authorization.

### `Transactions` Module

- Manages financial transactions, including:
  - Transaction creation.
  - Cancellation and status updates.
  - Listing and querying transactions.

### `Wallets` Module

- Manages digital wallets associated with users, including:
  - Wallet creation.
  - Wallet updates.
  - Wallet deletion.
  - Listing and querying wallets.

### `Users` Module

- Manages user information, including:
  - User creation.
  - User updates.
  - User deletion.
  - Listing and querying users.

---

## CQRS Implementation

This project follows the **CQRS (Command Query Responsibility Segregation)** pattern, separating write and read operations for better scalability and maintainability:

- **PostgreSQL**: Used for handling **write** operations.
- **MongoDB**: Used for handling **read** operations.
- **RabbitMQ**: Acts as the messaging system to synchronize data between the databases and ensure eventual consistency.

---

## Testing the API with Postman

A Postman collection is provided for testing the application. Follow these steps to test the API endpoints:

1. Import the `Nest Js.postman_collection.json` file into Postman.
2. Use the following endpoints:

### Wallet Endpoints
- **POST /wallets**: Create a new wallet.
- **PUT /wallets/:id**: Update an existing wallet.
- **GET /wallets/:id**: Retrieve a wallet by ID.
- **GET /wallets**: Retrieve all wallets.

### Transaction Endpoints
- **POST /transactions**: Create a new transaction.
- **GET /transactions**: Retrieve all transactions.
- **GET /transactions/:id**: Retrieve a transaction by ID.
- **DELETE /transactions/:id**: Cancel a transaction.
- **GET /transactions?filters**: Retrieve transactions with filters.

### User Endpoints
- **POST /users**: Create a new user.
- **PUT /users/:id**: Update an existing user.
- **GET /users/:id**: Retrieve a user by ID.
- **GET /users**: Retrieve all users.
- **DELETE /users/:id**: Delete a user.

### Auth Endpoint
- **POST /auth**: Authenticate a user (sign-in).

3. Adjust the `Authorization` header if needed for endpoints requiring authentication.

---

## API Documentation

The project includes Swagger documentation for all available endpoints. You can access the API documentation at:

`http://localhost:3000/api-docs`

---

## License

This project is licensed under the [MIT License](LICENSE).

