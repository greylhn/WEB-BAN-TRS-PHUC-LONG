USE PHUCLONG;
GO

INSERT INTO Categories (CategoryName, Description, IsActive)
VALUES
    (N'Trà sữa', N'Các loại trà sữa đậm vị trà truyền thống', 1),
    (N'Trà trái cây', N'Trà kết hợp trái cây tươi thanh mát', 1),
    (N'Cà phê', N'Các món cà phê pha phin và pha máy', 1);
GO

INSERT INTO Products (CategoryId, ProductName, Description, Price, ImageUrl, IsAvailable)
VALUES
    (1, N'Trà sữa Phúc Long', N'Hồng trà đậm vị kết hợp sữa béo ngậy', 45000, '/images/tra-sua-phuc-long.jpg', 1),
    (1, N'Trà sữa Ô Long', N'Trà Ô Long rang thơm lừng hòa quyện vị sữa', 50000, '/images/tra-sua-olong.jpg', 1),
    (1, N'Trà sữa Matcha', N'Bột trà xanh Nhật Bản kết hợp sữa tươi', 52000, '/images/tra-sua-matcha.jpg', 1),
    (2, N'Trà đào cam sả', N'Hồng trà đào miếng giòn cùng hương sả dịu nhẹ', 45000, '/images/tra-dao-cam-sa.jpg', 1),
    (2, N'Trà vải lài', N'Trà hoa lài thanh khiết kết hợp trái vải ngọt thanh', 45000, '/images/tra-vai-lai.jpg', 1),
    (3, N'Cà phê sữa đá', N'Cà phê rang xay đậm đà pha cùng sữa đặc', 39000, '/images/ca-phe-sua-da.jpg', 1);
GO