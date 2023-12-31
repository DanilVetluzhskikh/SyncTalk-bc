# SyncTalk server

## Description

SyncTalk is a pet project built with the idea of Discord in mind.

## Technology Stack

- Node.js
- NestJS
- TypeScript
- Sequelize (ORM)
- PostgreSQL
- JWT (Authentication)
- class-validator (validation)
- Socket.io (Real-time)
- WebRTC (Audio/Video)
- Jest (Testing)

```plaintext
SyncTalk-bc/
├── src/
│   ├── modules/                # Core functional modules
│   │   ├── app/                # App Module as entry point
│   │   ├── auth/               # Authentication logic
│   │   ├── user/               # User management
│   │   ├── server/             # Server (aka guild) management
│   │   ├── channel/            # Channel management
│   │   ├── message/            # Message management
│   │   └── call/               # Call management
│   ├── config/                 # Application-wide configuration
│   ├── middleware/             # Middlewares
│   ├── interceptors/           # NestJS interceptors
│   ├── decorators/             # Custom decorators
│   ├── exceptions/             # Custom exception filters
│   ├── utils/                  # Utility classes and functions
│   └── main.ts                 # Application entry point
├── test/                       # Test setups and specs
├── migrations/                 # Sequelize migrations
├── seeders/                    # Sequelize seeders for initial data
├── public/                     # Public static assets
├── uploads/                    # Uploaded assets
├── nest-cli.json               # Nest CLI json 
├── .eslint.js                  # Eslint settings
├── .prettierrc                 # Pretter settings
├── .env                        # Environment variables
├── package.json                # Project dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── README.md                   # Project documentation
└── .gitignore                  # Ignored files and folders in git
```

### Tables and Fields

#### 1. Users
  - `id` (Primary Key)
  - `profileId` (Foreign Key)
  - `username`
  - `email`
  - `passwordHash`
  - `createdAt`
  - `updatedAt`
  - `deletedAt`

#### 2. Profiles
  - `id` (Primary Key)
  - `avatarURL`
  - `status`
  - `createdAt`
  - `updatedAt`
  - `deletedAt`

#### 3. Servers
  - `id` (Primary Key)
  - `name`
  - `ownerId` (Foreign Key)
  - `createdAt`
  - `updatedAt`
  - `deletedAt`

#### 4. ServerMembers
  - `id` (Primary Key)
  - `userId` (Foreign Key)
  - `serverId` (Foreign Key)
  - `joinedAt`
  - `role`
  - `createdAt`
  - `updatedAt`
  - `deletedAt`

#### 5. Channel
  - `id` (Primary Key)
  - `name`
  - `serverId` (Foreign Key)
  - `createdAt`
  - `updatedAt`
  - `deletedAt`

#### 6. Messages
  - `id` (Primary Key)
  - `content`
  - `userId` (Foreign Key)
  - `channelId` (Foreign Key)
  - `createdAt`
  - `updatedAt`
  - `deletedAt`

#### 7. DirectMessages
  - `id` (Primary Key)
  - `content`
  - `senderId` (Foreign Key)
  - `receiverId` (Foreign Key)
  - `createdAt`
  - `updatedAt`
  - `deletedAt`

#### 8. Friendships
  - `id` (Primary Key)
  - `userId` (Foreign Key)
  - `friendId` (Foreign Key)
  - `status`
  - `createdAt`
  - `updatedAt`
  - `deletedAt`

#### 9. Calls
  - `id` (Primary Key)
  - `initiatorId` (Foreign Key)
  - `receiverId` (Foreign Key)
  - `status`
  - `startTime`
  - `endTime`
  - `createdAt`
  - `updatedAt`
  - `deletedAt`

> Note: The `deletedAt` field is used for soft deletion. If this field is populated, the corresponding record is considered to be 'archived' or 'soft deleted'.

## Installation and Run

1. Clone the repository:
git clone https://github.com/DanilVetluzhskikh/SyncTalk-bc.git
2. Install dependencies:
npm install
3. Create a `.env` file and add database settings:
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=yourusername
DB_PASSWORD=yourpassword
4. Run the project:
npm run dev
