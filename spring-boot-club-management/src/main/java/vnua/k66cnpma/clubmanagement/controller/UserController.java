package vnua.k66cnpma.clubmanagement.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.MediaType;
import vnua.k66cnpma.clubmanagement.commons.DonResponse;
import vnua.k66cnpma.clubmanagement.dto.UserDTO;
import vnua.k66cnpma.clubmanagement.service.UserService;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Validated
@Slf4j
public class UserController {
    private final UserService userService;


    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping(value = "/{username}", produces = MediaType.APPLICATION_JSON_VALUE)
    public DonResponse<UserDTO> findById(@PathVariable("username") String username) {
        UserDTO result = userService.findById(username);
        return DonResponse.build(result);
    }
    
    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping(value = "/clubMember/{clubId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public DonResponse<List<UserDTO>> findByClubId(@PathVariable("clubId") String clubId) {
        List<UserDTO> result = userService.findByClubId(clubId);
        return DonResponse.build(result);
    }
    
	@CrossOrigin(origins = "http://localhost:3000")
	@PostMapping("/addUser")
	public DonResponse<String> register(@RequestBody UserDTO userDTO) {
		userService.addUser(userDTO);
		return DonResponse.build("Thêm thành viên thành công");
	}
	
	@CrossOrigin(origins = "http://localhost:3000")
	@PostMapping("/removeUser/{username}")
	public DonResponse<String> remove(@RequestBody String username) {
		userService.removeUser(username);
		return DonResponse.build("Xóa thành viên thành công");
	}
}
