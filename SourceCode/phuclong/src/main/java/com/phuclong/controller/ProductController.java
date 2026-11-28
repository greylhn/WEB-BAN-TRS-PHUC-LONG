
package com.phuclong.controller;

import com.phuclong.entity.Product;
import com.phuclong.service.ProductService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Controller
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // Hiển thị danh sách sản phẩm
    @GetMapping("products")
    public String getAllProducts(Model model) {

        List<Product> products = productService.getAllProducts();

        model.addAttribute("products", products);

        return "products";
    }
}
