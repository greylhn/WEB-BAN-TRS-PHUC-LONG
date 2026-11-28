package com.phuclong.repository;

import com.phuclong.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {

    // Lấy toàn bộ sản phẩm đang mở bán
    List<Product> findByIsAvailableTrue();

    // Lọc sản phẩm đang mở bán theo mã danh mục (CategoryId)
    List<Product> findByCategory_CategoryIdAndIsAvailableTrue(Integer categoryId);

    // Lọc toàn bộ sản phẩm theo mã danh mục (dùng cho trang quản lý Admin/Staff)
    List<Product> findByCategory_CategoryId(Integer categoryId);

    // Tìm kiếm sản phẩm đang mở bán theo tên
    List<Product> findByProductNameContainingIgnoreCaseAndIsAvailableTrue(String keyword);

    // Tìm kiếm tất cả sản phẩm theo tên
    List<Product> findByProductNameContainingIgnoreCase(String keyword);
}
