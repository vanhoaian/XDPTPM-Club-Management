package vnua.k66cnpma.clubmanagement.service.impl;

import lombok.RequiredArgsConstructor;


import org.springframework.stereotype.Service;

import vnua.k66cnpma.clubmanagement.commons.exception.DonException;
import vnua.k66cnpma.clubmanagement.commons.exception.ErrorMessages;
import vnua.k66cnpma.clubmanagement.converter.ConverterToDTO;
import vnua.k66cnpma.clubmanagement.dto.LoginDTO;
import vnua.k66cnpma.clubmanagement.dto.PasswordDTO;
import vnua.k66cnpma.clubmanagement.dto.RegisterDTO;
import vnua.k66cnpma.clubmanagement.dto.UserDTO;
import vnua.k66cnpma.clubmanagement.entity.User;
import vnua.k66cnpma.clubmanagement.repository.UserRepository;
import vnua.k66cnpma.clubmanagement.service.UserService;

import java.util.List;
import java.util.Optional;


@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
	private final UserRepository userRepo;
	private final ConverterToDTO converterToDTO;
	
	@Override
    public UserDTO findById(String username) {
        Optional<User> user = userRepo.findById(username);
        if (user.isEmpty()) {
            throw new DonException(ErrorMessages.NOT_FOUND);
        }
        return new UserDTO(user.get());
    }

	@Override
    public void login(LoginDTO loginDTO) {
        Optional<User> userOptional = userRepo.findById(loginDTO.getUsername());
        
        if (userOptional.isEmpty()) {
            throw new DonException(ErrorMessages.NOT_FOUND);
        }

        User user = userOptional.get();

        if (!user.getPassword().equals(loginDTO.getPassword())) {
            throw new DonException(ErrorMessages.INVALID_VALUE);
        }

        // Kiểm tra vai trò của người dùng
        if (!user.getRole().equals(loginDTO.getRole())) {
            throw new DonException(ErrorMessages.INVALID_VALUE);
        }
    }

    @Override
    public void register(RegisterDTO registerDTO) {
        Optional<User> userOptional = userRepo.findById(registerDTO.getUsername());

        // Kiểm tra nếu người dùng đã tồn tại
        if (userOptional.isPresent()) {
            throw new DonException(ErrorMessages.USER_ALREADY_EXISTS);
        }

        User newUser = new User();
        newUser.setUsername(registerDTO.getUsername());
        newUser.setFullname(registerDTO.getFullname());
        newUser.setPassword(registerDTO.getPassword());
        newUser.setBirthday(registerDTO.getBirthday());
        newUser.setPhone(registerDTO.getPhone());
        newUser.setEmail(registerDTO.getEmail());
        newUser.setRole("admin");
        newUser.setTeam("Quản lý câu lạc bộ");
        newUser.setPosition("Câu lạc bộ");
        newUser.setClubId(registerDTO.getUsername());

        userRepo.save(newUser);
    }


	@Override
	public void changePassword(PasswordDTO passwordDTO) {
        Optional<User> userOptional = userRepo.findById(passwordDTO.getUsername());
        
        User user = userOptional.get();
        user.setPassword(passwordDTO.getPassword());
        userRepo.save(user);	
	}


	@Override
	public List<UserDTO> findByClubId(String clubId) {
        List<User> users = userRepo.findByClubId(clubId);
        if (users.isEmpty()) {
            throw new DonException(ErrorMessages.NOT_FOUND);
        }
        return converterToDTO.toUserDTOList(users);
    }


	@Override
	public void addUser(UserDTO userDTO) {
		Optional<User> userOptional = userRepo.findById(userDTO.getUsername());

        // Kiểm tra nếu người dùng đã tồn tại
        if (userOptional.isPresent()) {
            throw new DonException(ErrorMessages.USER_ALREADY_EXISTS);
        }
		
        User newUser = new User();
        newUser.setUsername(userDTO.getUsername());
        newUser.setFullname(userDTO.getFullname());
        newUser.setPassword(userDTO.getPassword());
        newUser.setBirthday(userDTO.getBirthday());
        newUser.setPhone(userDTO.getPhone());
        newUser.setEmail(userDTO.getEmail());
        newUser.setRole("user");
        newUser.setTeam(userDTO.getTeam());
        newUser.setPosition(userDTO.getPosition());
        newUser.setClubId(userDTO.getClubId());
	}

	@Override
	public void removeUser(String username) {
	   userRepo.deleteById(username);
	}
	
}
