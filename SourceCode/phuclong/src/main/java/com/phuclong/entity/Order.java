package com.phuclong.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "Orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "OrderId")
    private Long orderId;

    @Column(name = "CustomerName", nullable = false, length = 120)
    private String customerName;

    @Column(name = "Phone", nullable = false, length = 20)
    private String phone;

    @Column(name = "DeliveryAddress", nullable = false, length = 500)
    private String deliveryAddress;

    @Column(name = "OrderDate", nullable = false, updatable = false)
    private LocalDateTime orderDate;

    @Column(name = "Status", nullable = false, length = 30)
    @Builder.Default
    private String status = "PENDING";

    @Column(name = "TotalAmount", nullable = false, precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal totalAmount = BigDecimal.ZERO;

    @Column(name = "Note", length = 500)
    private String note;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<OrderDetail> orderDetails;

    @PrePersist
    protected void onCreate() {
        if (this.orderDate == null) {
            this.orderDate = LocalDateTime.now();
        }
        if (this.status == null) {
            this.status = "PENDING";
        }
        if (this.totalAmount == null) {
            this.totalAmount = BigDecimal.ZERO;
        }
    }
}