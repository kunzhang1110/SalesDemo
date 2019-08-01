--CREATE DATABASE [IC_OnboardApp]

USE [IC_OnboardApp]

IF OBJECT_ID ('[dbo].[Customer]', 'U') IS NOT NULL  
   DROP TABLE [dbo].[Customer]; 
GO
IF OBJECT_ID ('[dbo].[Product]', 'U') IS NOT NULL  
   DROP TABLE [dbo].[Product]; 
GO
IF OBJECT_ID ('[dbo].[Sales]', 'U') IS NOT NULL  
   DROP TABLE [dbo].[Sales]; 
GO
IF OBJECT_ID ('[dbo].[Store]', 'U') IS NOT NULL  
   DROP TABLE [dbo].[Store]; 
GO
CREATE TABLE [Customer](
	[Id] int NOT NULL PRIMARY KEY IDENTITY(1,1),
	[Name] nvarchar(255) NOT NULL,
	[Address] nvarchar(Max)
);

CREATE TABLE [Product](
	[Id] int NOT NULL PRIMARY KEY IDENTITY(1,1),
	[Name] nvarchar(255) NOT NULL,
	[Price] float
);

CREATE TABLE [Store](
	[Id] int NOT NULL PRIMARY KEY IDENTITY(1,1),
	[Name] nvarchar(255) NOT NULL,
	[Address] nvarchar(Max)
);

CREATE TABLE [Sales](
	[Id] int NOT NULL PRIMARY KEY IDENTITY(1,1),
	[CustomerId] int NOT NULL,
	[ProductId] int NOT NULL,
	[StoreId] int NOT NULL,
	[DateSold] datetime
	CONSTRAINT FK_Sales_CustomerId
		FOREIGN KEY([CustomerId]) REFERENCES [Customer]([Id]),
	CONSTRAINT FK_Sales_ProductId
		FOREIGN KEY([ProductId]) REFERENCES [Product]([Id]),
	CONSTRAINT FK_Sales_StoreId
		FOREIGN KEY([StoreId]) REFERENCES [Store]([Id])
);