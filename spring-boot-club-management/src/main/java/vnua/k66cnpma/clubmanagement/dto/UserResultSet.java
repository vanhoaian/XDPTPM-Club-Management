package vnua.k66cnpma.clubmanagement.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import java.util.Date;

@JsonPropertyOrder({
        "username",
        "password",
        "fullname",
        "birthday",
        "email",
        "phone",
        "role",
        "team",
        "position",
        "club_id"
})
public interface UserResultSet {
    String getUsername();
    String getPassword();
    String getFullname();
    Date getBirthday();
    String getEmail();
    String getPhone();
    String getRole();
    String getTeam();
    String getPosition();
    String getClubId();
}

