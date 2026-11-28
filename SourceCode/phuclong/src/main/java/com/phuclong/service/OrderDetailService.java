
package com.phuclong.service;

import com.phuclong.entity.OrderDetail;
import com.phuclong.repository.OrderDetailRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderDetailService {

    private final OrderDetailRepository orderDetailRepository;

    public OrderDetailService(OrderDetailRepository orderDetailRepository) {
        this.orderDetailRepository = orderDetailRepository;
    }

    public List<OrderDetail> getAllOrderDetails() {
        return orderDetailRepository.findAll();
    }

    public OrderDetail getOrderDetailById(Integer id) {
        return orderDetailRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chi tiết đơn hàng"));
    }

    public OrderDetail saveOrderDetail(OrderDetail orderDetail) {
        return orderDetailRepository.save(orderDetail);
    }

    public void deleteOrderDetail(Integer id) {
        orderDetailRepository.deleteById(id);
    }
}
