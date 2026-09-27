export interface DbColumn {
  name: string;
  type: string;
  isPrimaryKey: boolean;
  isForeignKey: boolean;
  isNullable: boolean;
  defaultValue?: string;
  relationTarget?: string;
  attributes?: string[];
}

export interface DbTable {
  name: string;
  columns: DbColumn[];
  description?: string;
}

export interface DbRelationship {
  sourceTable: string;
  targetTable: string;
  relationship: string; // '||--o{' or '||--||'
  label: string;
}

export interface DatabaseDesignResult {
  hasDatabase: boolean;
  engine: string;
  filePath: string | null;
  rawContent: string;
  format: 'prisma' | 'sql' | 'mermaid' | 'custom' | 'none';
  tables: DbTable[];
  erdMermaid: string;
  sourceType: 'disk' | 'database' | 'generated' | 'none';
}

/**
 * Starter database templates
 */
export function getDatabaseTemplate(templateName: string): {
  engine: string;
  rawContent: string;
  format: 'prisma' | 'sql';
} {
  switch (templateName) {
    case 'ecommerce':
      return {
        engine: 'PostgreSQL (Prisma)',
        format: 'prisma',
        rawContent: `datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  USER
  ADMIN
}

enum OrderStatus {
  PENDING
  PAID
  SHIPPED
  DELIVERED
  CANCELLED
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String?
  role      Role     @default(USER)
  orders    Order[]
  createdAt DateTime @default(now())
}

model Product {
  id          String      @id @default(uuid())
  name        String
  description String?
  price       Decimal     @db.Decimal(10, 2)
  stock       Int         @default(0)
  items       OrderItem[]
  createdAt   DateTime    @default(now())
}

model Order {
  id        String      @id @default(uuid())
  userId    String
  user      User        @relation(fields: [userId], references: [id])
  status    OrderStatus @default(PENDING)
  total     Decimal     @db.Decimal(10, 2)
  items     OrderItem[]
  createdAt DateTime    @default(now())
}

model OrderItem {
  id        String   @id @default(uuid())
  orderId   String
  order     Order    @relation(fields: [orderId], references: [id])
  productId String
  product   Product  @relation(fields: [productId], references: [id])
  quantity  Int      @default(1)
  price     Decimal  @db.Decimal(10, 2)
}`,
      };

    case 'pos':
      return {
        engine: 'PostgreSQL',
        format: 'sql',
        rawContent: `-- POS & Inventory Management Schema
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'cashier',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  category_id INT REFERENCES categories(id),
  sku VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  cost NUMERIC(10,2) NOT NULL,
  stock_quantity INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  cashier_id INT REFERENCES users(id),
  receipt_number VARCHAR(100) UNIQUE NOT NULL,
  total_amount NUMERIC(10,2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INT REFERENCES orders(id),
  product_id INT REFERENCES products(id),
  quantity INT NOT NULL,
  unit_price NUMERIC(10,2) NOT NULL
);`,
      };

    case 'saas':
    default:
      return {
        engine: 'PostgreSQL (Prisma)',
        format: 'prisma',
        rawContent: `datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Organization {
  id        String   @id @default(uuid())
  name      String
  slug      String   @unique
  plan      String   @default("free")
  users     User[]
  projects  Project[]
  createdAt DateTime @default(now())
}

model User {
  id             String       @id @default(uuid())
  email          String       @unique
  name           String?
  orgId          String
  organization   Organization @relation(fields: [orgId], references: [id])
  createdAt      DateTime     @default(now())
}

model Project {
  id             String       @id @default(uuid())
  name           String
  orgId          String
  organization   Organization @relation(fields: [orgId], references: [id])
  status         String       @default("active")
  createdAt      DateTime     @default(now())
}`,
      };
  }
}
