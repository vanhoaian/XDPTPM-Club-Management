package vnua.k66cnpma.clubmanagement.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class PostDTO {
    private UserEventDTO userEvent;
    private EventDTO event;

    // Constructor từ UserEventDTO và EventDTO
    public PostDTO(UserEventDTO userEvent, EventDTO event) {
        this.userEvent = userEvent;
        this.event = event;
    }
}
