package com.phuclong.repository;

import com.phuclong.entity.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail, Long> {

    // Lấy danh sách các món chi tiết thuộc một đơn hàng cụ thể
    List<OrderDetail> findByOrder_OrderId(Long orderId);

    // Lấy danh sách chi tiết đơn theo mã sản phẩm
    List<OrderDetail> findByProduct_ProductId(Integer productId);
}