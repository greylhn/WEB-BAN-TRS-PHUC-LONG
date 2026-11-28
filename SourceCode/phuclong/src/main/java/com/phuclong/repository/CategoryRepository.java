package com.phuclong.repository;

import com.phuclong.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {

    // Lấy danh sách các danh mục đang hoạt động (hiển thị menu cho khách)
    List<Category> findByIsActiveTrue();

    // Tìm danh mục theo tên (không phân biệt hoa thường)
    List<Category> findByCategoryNameContainingIgnoreCase(String categoryName);
}