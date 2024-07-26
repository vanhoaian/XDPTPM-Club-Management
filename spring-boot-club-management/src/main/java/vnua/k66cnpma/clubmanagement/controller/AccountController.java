package vnua.k66cnpma.clubmanagement.controller;

import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import vnua.k66cnpma.clubmanagement.commons.DonResponse;
import vnua.k66cnpma.clubmanagement.dto.LoginDTO;
import vnua.k66cnpma.clubmanagement.dto.PasswordDTO;
import vnua.k66cnpma.clubmanagement.dto.RegisterDTO;
import vnua.k66cnpma.clubmanagement.service.UserService;


@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/account")
@Validated
@Slf4j

public class AccountController {

	@Autowired
	private UserService userService;
	
	@CrossOrigin(origins = "http://localhost:3000")
	@PostMapping("/login")
	public DonResponse<String> login(@RequestBody LoginDTO loginDTO) {
		userService.login(loginDTO);
		return DonResponse.build("Đăng nhập thành công");
	}
	
	@CrossOrigin(origins = "http://localhost:3000")
	@PostMapping("/register")
	public DonResponse<String> register(@RequestBody RegisterDTO registerDTO) {
		userService.register(registerDTO);
		return DonResponse.build("Đăng ký thành công");
	}
	
	@CrossOrigin(origins = "http://localhost:3000")
	@PostMapping("/changePassword")
	public DonResponse<String> changePassword(@RequestBody PasswordDTO passwordDTO) {
		userService.changePassword(passwordDTO);
		return DonResponse.build("Thay đổi mật khẩu thành công");
	}
}
