package com.phuclong.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "Products")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ProductId")
    private Integer productId;

    @Column(name = "ProductName", nullable = false, length = 150)
    private String productName;

    @Column(name = "Description", length = 1000)
    private String description;

    @Column(name = "Price", nullable = false, precision = 12, scale = 2)
    private BigDecimal price;

    @Column(name = "ImageUrl", length = 500)
    private String imageUrl;

    @Column(name = "IsAvailable", nullable = false)
    @Builder.Default
    private Boolean isAvailable = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CategoryId", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Category category;

    @OneToMany(mappedBy = "product", fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<OrderDetail> orderDetails;

    @PrePersist
    protected void onCreate() {
        if (this.isAvailable == null) {
            this.isAvailable = true;
        }
    }
}