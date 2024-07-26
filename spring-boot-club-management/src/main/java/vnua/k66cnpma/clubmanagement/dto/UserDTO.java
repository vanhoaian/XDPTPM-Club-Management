package vnua.k66cnpma.clubmanagement.dto;


import lombok.Getter;
import lombok.Setter;
import vnua.k66cnpma.clubmanagement.entity.User;

import java.util.Date;

@Getter
@Setter
public class UserDTO {
    private String username; 
    private String fullname; 
    private String password; 
    private Date birthday;
    private String phone; 
    private String email; 
    private String role; 
    private String team; 
    private String position;
    private String clubId;

    public UserDTO() {}

    public UserDTO(User user) {
        this.username = user.getUsername(); 
        this.fullname = user.getFullname(); 
        this.password = user.getPassword(); 
        this.birthday = user.getBirthday(); 
        this.phone = user.getPhone();       
        this.email = user.getEmail();       
        this.role = user.getRole();        
        this.team = user.getTeam();        
        this.position = user.getPosition();
        this.clubId = user.getClubId();
    }


}
