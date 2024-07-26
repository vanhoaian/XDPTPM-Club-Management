package vnua.k66cnpma.clubmanagement.service;


import vnua.k66cnpma.clubmanagement.dto.LoginDTO;
import vnua.k66cnpma.clubmanagement.dto.PasswordDTO;
import vnua.k66cnpma.clubmanagement.dto.RegisterDTO;
import vnua.k66cnpma.clubmanagement.dto.UserDTO;

import java.util.List;

public interface UserService {

	void login(LoginDTO loginDTO);
	void register(RegisterDTO registerDTO);
	UserDTO findById(String username);
	void changePassword(PasswordDTO passwordDTO);
	List<UserDTO> findByClubId(String clubId);
	void addUser(UserDTO userDTO);
	void removeUser(String username);

}
