package vnua.k66cnpma.clubmanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vnua.k66cnpma.clubmanagement.entity.UserEvent;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserEventDTO {
    private String username;
    private String idEvent;
    private String status;
    private String note;

    // Constructor từ UserEvent
    public UserEventDTO(UserEvent userEvent) {
        this.username = userEvent.getUsername();
        this.idEvent = userEvent.getIdEvent();
        this.status = userEvent.getStatus().name(); // Chuyển đổi Status enum thành String
        this.note = userEvent.getNote();
    }
}