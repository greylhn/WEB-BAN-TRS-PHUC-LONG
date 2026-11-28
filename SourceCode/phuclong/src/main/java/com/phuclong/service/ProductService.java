
package com.phuclong.service;

import com.phuclong.entity.Product;
import com.phuclong.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    // Lấy toàn bộ sản phẩm
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
    // tim san pham theo id
    public Product getProductById(int id)
    {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));
    }
    // them hoac cap nhat san pham
    public Product saveProduct (Product product)
    {
        return productRepository.save(product) ;
    }
    // xoa san pham theo id
    public void deleteProduct (int id)
    {
        productRepository.deleteById(id) ;
    }
}
