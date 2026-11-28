
package com.phuclong.service;

import com.phuclong.entity.Role;
import com.phuclong.repository.RoleRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoleService {

    private final RoleRepository roleRepository;

    public RoleService(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    // Lấy tất cả vai trò
    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    // Tìm vai trò theo ID
    public Role getRoleById(Integer id) {
        return roleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy vai trò"));
    }

    // Thêm hoặc cập nhật vai trò
    public Role saveRole(Role role) {
        return roleRepository.save(role);
    }

    // Xóa vai trò
    public void deleteRole(Integer id) {
        roleRepository.deleteById(id);
    }
}
