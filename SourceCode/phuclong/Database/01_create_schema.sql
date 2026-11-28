IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'PHUCLONG')
BEGIN
    CREATE DATABASE PHUCLONG;
END
GO

USE PHUCLONG;
GO

-- 1. Bảng Categories (Danh mục sản phẩm)
CREATE TABLE Categories (
                            CategoryId INT IDENTITY(1,1) PRIMARY KEY,
                            CategoryName NVARCHAR(100) NOT NULL,
                            Description NVARCHAR(500) NULL,
                            IsActive BIT NOT NULL CONSTRAINT DF_Categories_IsActive DEFAULT 1
);
GO

-- 2. Bảng Products (Sản phẩm)
CREATE TABLE Products (
                          ProductId INT IDENTITY(1,1) PRIMARY KEY,
                          CategoryId INT NOT NULL,
                          ProductName NVARCHAR(150) NOT NULL,
                          Description NVARCHAR(1000) NULL,
                          Price DECIMAL(12,2) NOT NULL,
                          ImageUrl NVARCHAR(500) NULL,
                          IsAvailable BIT NOT NULL CONSTRAINT DF_Products_IsAvailable DEFAULT 1,
                          CONSTRAINT FK_Products_Categories
                              FOREIGN KEY (CategoryId) REFERENCES Categories(CategoryId),
                          CONSTRAINT CK_Products_Price CHECK (Price >= 0)
);
GO

-- 3. Bảng Orders (Đơn hàng)
CREATE TABLE Orders (
                        OrderId BIGINT IDENTITY(1,1) PRIMARY KEY,
                        CustomerName NVARCHAR(120) NOT NULL,
                        Phone VARCHAR(20) NOT NULL,
                        DeliveryAddress NVARCHAR(500) NOT NULL,
                        OrderDate DATETIME2 NOT NULL CONSTRAINT DF_Orders_OrderDate DEFAULT SYSDATETIME(),
                        Status VARCHAR(30) NOT NULL CONSTRAINT DF_Orders_Status DEFAULT 'PENDING',
                        TotalAmount DECIMAL(12,2) NOT NULL,
                        Note NVARCHAR(500) NULL,
                        CONSTRAINT CK_Orders_TotalAmount CHECK (TotalAmount >= 0),
                        CONSTRAINT CK_Orders_Status CHECK
                            (Status IN ('PENDING','CONFIRMED','PREPARING','READY','DELIVERING','COMPLETED','CANCELLED'))
);
GO

-- 4. Bảng OrderDetails (Chi tiết đơn hàng)
CREATE TABLE OrderDetails (
                              OrderDetailId BIGINT IDENTITY(1,1) PRIMARY KEY,
                              OrderId BIGINT NOT NULL,
                              ProductId INT NOT NULL,
                              Quantity INT NOT NULL,
                              UnitPrice DECIMAL(12,2) NOT NULL,
                              LineTotal AS (Quantity * UnitPrice) PERSISTED,
                              CONSTRAINT FK_OrderDetails_Orders
                                  FOREIGN KEY (OrderId) REFERENCES Orders(OrderId),
                              CONSTRAINT FK_OrderDetails_Products
                                  FOREIGN KEY (ProductId) REFERENCES Products(ProductId),
                              CONSTRAINT CK_OrderDetails_Quantity CHECK (Quantity > 0),
                              CONSTRAINT CK_OrderDetails_UnitPrice CHECK (UnitPrice >= 0)
);
GO