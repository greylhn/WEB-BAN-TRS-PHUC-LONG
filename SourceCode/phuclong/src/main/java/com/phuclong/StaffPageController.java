package com.phuclong;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class StaffPageController {

    @GetMapping("/staff/dashboard")
    public String dashboard() {
        return "staff/dashboard";
    }

    @GetMapping("/staff/orders")
    public String orders() {
        return "staff/orders";
    }

    @GetMapping("/staff/reports")
    public String reports() {
        return "staff/reports";
    }

    @GetMapping("/staff/delivery")
    public String delivery() {
        return "staff/delivery";
    }

    @GetMapping("/staff/history")
    public String history() {
        return "staff/reports";
    }

    @GetMapping("/staff/counter-orders")
    public String counterOrders() {
        return "staff/counter-orders";
    }

    @GetMapping("/staff/profile")
    public String profile() {
        return "staff/profile";
    }

}
