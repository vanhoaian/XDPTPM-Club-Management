package vnua.k66cnpma.clubmanagement.dto;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class RegisterDTO {
    private String username;
    private String fullname;
    private String password;
    private Date birthday;
    private String phone;
    private String email;
}
