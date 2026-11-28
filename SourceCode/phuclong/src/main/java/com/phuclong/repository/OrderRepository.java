package com.phuclong.repository;

import com.phuclong.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    // Lấy danh sách đơn hàng theo trạng thái, mới nhất lên đầu
    List<Order> findByStatusOrderByOrderDateDesc(String status);

    // Lấy toàn bộ đơn hàng sắp xếp từ mới nhất đến cũ nhất
    List<Order> findAllByOrderByOrderDateDesc();

    // Tìm đơn hàng theo số điện thoại khách hàng
    List<Order> findByPhoneOrderByOrderDateDesc(String phone);
}